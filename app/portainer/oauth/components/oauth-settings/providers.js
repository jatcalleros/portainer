import { baseHref } from '@/portainer/helpers/pathHelper';
import { OAuthStyle } from '@/react/portainer/settings/types';

export default {
  microsoft: {
    authUrl: 'https://login.microsoftonline.com/TENANT_ID/oauth2/v2.0/authorize',
    accessTokenUrl: 'https://login.microsoftonline.com/TENANT_ID/oauth2/v2.0/token',
    resourceUrl: 'https://graph.microsoft.com/v1.0/me',
    logoutUrl: `https://login.microsoftonline.com/TENANT_ID/oauth2/v2.0/logout`,
    userIdentifier: 'userPrincipalName',
    scopes: 'profile openid',
    authStyle: OAuthStyle.InParams,
  },
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/auth',
    accessTokenUrl: 'https://accounts.google.com/o/oauth2/token',
    resourceUrl: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
    logoutUrl: `https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${window.location.origin}${baseHref()}#!/auth`,
    userIdentifier: 'email',
    scopes: 'profile email',
    authStyle: OAuthStyle.InParams,
  },
  github: {
    authUrl: 'https://github.com/login/oauth/authorize',
    accessTokenUrl: 'https://github.com/login/oauth/access_token',
    resourceUrl: 'https://api.github.com/user',
    logoutUrl: `https://github.com/logout`,
    userIdentifier: 'login',
    scopes: 'id email name',
    authStyle: OAuthStyle.AutoDetect,
  },
  custom: { authUrl: '', accessTokenUrl: '', resourceUrl: '', logoutUrl: '', userIdentifier: '', scopes: '', authStyle: OAuthStyle.AutoDetect },
};

export function getProviderByUrl(providerAuthURL = '') {
  if (providerAuthURL.includes('login.microsoftonline.com')) {
    return 'microsoft';
  }

  if (providerAuthURL.includes('accounts.google.com')) {
    return 'google';
  }

  if (providerAuthURL.includes('github.com')) {
    return 'github';
  }

  return 'custom';
}
