import { rawResponse } from 'Kubernetes/rest/response/transform';

angular.module('portainer.kubernetes').factory('KubernetesPods', [
  '$resource',
  'API_ENDPOINT_ENDPOINTS',
  'EndpointProvider',
  function KubernetesPodsFactory($resource, API_ENDPOINT_ENDPOINTS, EndpointProvider) {
    'use strict';
    return function (namespace) {
      const url = API_ENDPOINT_ENDPOINTS + '/:endpointId/kubernetes/api/v1' + (namespace ? '/namespaces/:namespace' : '') + '/pods/:id/:action';
      return $resource(
        url,
        {
          endpointId: EndpointProvider.endpointID,
          namespace: namespace,
        },
        {
          get: {
            method: 'GET',
            ignoreLoadingBar: true,
          },
          getYaml: {
            method: 'GET',
            headers: {
              Accept: 'application/yaml',
            },
            transformResponse: rawResponse,
            ignoreLoadingBar: true,
          },
          create: { method: 'POST' },
          update: { method: 'PUT' },
          delete: { method: 'DELETE' },
          patch: {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json-patch+json',
            },
          },
          logs: {
            method: 'GET',
            params: { action: 'log' },
            transformResponse: logsHandler,
          },
          evict: { method: 'POST' },
        }
      );
    };
  },
]);

// The Docker API returns the logs as a single string.
// This handler wraps the data in a JSON object under the "logs" property.
function logsHandler(data) {
  return {
    logs: data,
  };
}
