package helm

import (
	"net/http"
	"strings"

	portainer "github.com/portainer/portainer/api"
	"github.com/portainer/portainer/api/http/security"
	"github.com/portainer/portainer/pkg/libhelm"
	httperror "github.com/portainer/portainer/pkg/libhttp/error"
	"github.com/portainer/portainer/pkg/libhttp/request"
	"github.com/portainer/portainer/pkg/libhttp/response"

	"github.com/pkg/errors"
)

type helmUserRepositoryResponse struct {
	GlobalRepository string                         `json:"GlobalRepository"`
	UserRepositories []portainer.HelmUserRepository `json:"UserRepositories"`
}

type addHelmRepoUrlPayload struct {
	URL string `json:"url"`
}

func (p *addHelmRepoUrlPayload) Validate(_ *http.Request) error {
	return libhelm.ValidateHelmRepositoryURL(p.URL, nil)
}

// @id HelmUserRepositoryCreateDeprecated
// @summary Create a user helm repository
// @description Create a user helm repository.
// @description **Access policy**: authenticated
// @tags helm
// @security ApiKeyAuth
// @security jwt
// @accept json
// @produce json
// @param id path int true "Environment(Endpoint) identifier"
// @param payload body addHelmRepoUrlPayload true "Helm Repository"
// @success 200 {object} portainer.HelmUserRepository "Success"
// @failure 400 "Invalid request"
// @failure 403 "Permission denied"
// @failure 500 "Server error"
// @deprecated
// @router /endpoints/{id}/kubernetes/helm/repositories [post]
func (handler *Handler) userCreateHelmRepo(w http.ResponseWriter, r *http.Request) *httperror.HandlerError {
	tokenData, err := security.RetrieveTokenData(r)
	if err != nil {
		return httperror.InternalServerError("Unable to retrieve user authentication token", err)
	}
	userID := tokenData.ID

	p := new(addHelmRepoUrlPayload)
	err = request.DecodeAndValidateJSONPayload(r, p)
	if err != nil {
		return httperror.BadRequest("Invalid Helm repository URL", err)
	}

	// lowercase, remove trailing slash
	p.URL = strings.TrimSuffix(strings.ToLower(p.URL), "/")

	records, err := handler.dataStore.HelmUserRepository().HelmUserRepositoryByUserID(userID)
	if err != nil {
		return httperror.InternalServerError("Unable to access the DataStore", err)
	}

	// check if repo already exists - by doing case insensitive comparison
	for _, record := range records {
		if strings.EqualFold(record.URL, p.URL) {
			errMsg := "Helm repo already registered for user"
			return httperror.BadRequest(errMsg, errors.New(errMsg))
		}
	}

	record := portainer.HelmUserRepository{
		UserID: userID,
		URL:    p.URL,
	}

	err = handler.dataStore.HelmUserRepository().Create(&record)
	if err != nil {
		return httperror.InternalServerError("Unable to save a user Helm repository URL", err)
	}

	return response.JSON(w, record)
}

// @id HelmUserRepositoriesListDeprecated
// @summary List a users helm repositories
// @description Inspect a user helm repositories.
// @description **Access policy**: authenticated
// @tags helm
// @security ApiKeyAuth
// @security jwt
// @produce json
// @param id path int true "User identifier"
// @success 200 {object} helmUserRepositoryResponse "Success"
// @failure 400 "Invalid request"
// @failure 403 "Permission denied"
// @failure 500 "Server error"
// @deprecated
// @router /endpoints/{id}/kubernetes/helm/repositories [get]
func (handler *Handler) userGetHelmRepos(w http.ResponseWriter, r *http.Request) *httperror.HandlerError {
	tokenData, err := security.RetrieveTokenData(r)
	if err != nil {
		return httperror.InternalServerError("Unable to retrieve user authentication token", err)
	}
	userID := tokenData.ID

	settings, err := handler.dataStore.Settings().Settings()
	if err != nil {
		return httperror.InternalServerError("Unable to retrieve settings from the database", err)
	}

	userRepos, err := handler.dataStore.HelmUserRepository().HelmUserRepositoryByUserID(userID)
	if err != nil {
		return httperror.InternalServerError("Unable to get user Helm repositories", err)
	}

	resp := helmUserRepositoryResponse{
		GlobalRepository: settings.HelmRepositoryURL,
		UserRepositories: userRepos,
	}

	return response.JSON(w, resp)
}
