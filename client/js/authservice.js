import auth0 from 'auth0-js';
import { EventEmitter } from 'events';
import authConfig from '../auth_config.json';
import { Session } from 'meteor/session';

const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';
const webAuth = new auth0.WebAuth({
  domain: authConfig.domain,
  redirectUri: `${window.location.origin}/login`,
  clientID: authConfig.clientId,
  responseType: 'id_token',
  scope: 'openid profile email',
  audience: 'https://grevons.eu.auth0.com/api/v2/',
});
/* eslint-disable */
function getParameterByName(name) {
  const match = RegExp(`[#&]${name}=([^&]*)`).exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
const localStorageKey = 'loggedIn';
const loginEvent = 'loginEvent';
class AuthService extends EventEmitter {
  idToken = null;
  profile = null;
  tokenExpiry = null;

  login(customState) {
    webAuth.authorize({
      responseType: 'token id_token',
      redirectUri: `${window.location.origin}/login`,
      audience: 'https://grevons.eu.auth0.com/api/v2/',
      scope: 'openid profile email',
    });
  }

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  setAccessToken() {
    const accessToken = getParameterByName('access_token');
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  setIdToken() {
    const idToken = getParameterByName('id_token');
    localStorage.setItem(ID_TOKEN_KEY, idToken);
  }

  logOut() {
    localStorage.removeItem(localStorageKey);
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('loggedIn');
    sessionStorage.removeItem('profile');
    Session.set('profile',null)
    this.idToken = null;
    this.tokenExpiry = null;
    this.profile = null;

    webAuth.logout({
      client_id: '6tcDv08YuUj9GYKXL9Bui1t1jejjrTSy',
      returnTo: `${window.location.origin}`,
    });

    this.emit(loginEvent, { loggedIn: false });
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      webAuth.parseHash((err, authResult) => {
        if (err) {
          this.emit(loginEvent, {
            loggedIn: false,
            error: err,
            errorMsg: err.statusText,
          });
          reject(err);
        } else {
          this.setIdToken()
          this.setAccessToken()
          this.localLogin(authResult);
          resolve(authResult.idToken);
        }
      });
    });
  }

  isAuthenticated() {
    return Date.now() < new Date(localStorage.getItem('tokenExpiry')) && localStorage.getItem(localStorageKey) === 'true';
  }

  isIdTokenValid() {
    return this.idToken && this.tokenExpiry && Date.now() < this.tokenExpiry;
  }

  getIdToken() {
    return new Promise((resolve, reject) => {
      if (this.isIdTokenValid()) {
        resolve(this.idToken);
      } else if (this.isAuthenticated()) {
        this.renewTokens().then(authResult => {
          resolve(authResult.idToken);
        }, reject);
      } else {
        resolve();
      }
    });
  }

  localLogin(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    sessionStorage.setItem('profile',JSON.stringify(this.profile));
    Session.set('profile',JSON.stringify(this.profile));
    this.tokenExpiry = new Date(this.profile.exp * 1000);
    localStorage.setItem(localStorageKey, 'true');
    localStorage.setItem('tokenExpiry', this.tokenExpiry);
    this.emit(loginEvent, {
      loggedIn: true,
      profile: authResult.idTokenPayload,
      state: authResult.appState || {},
    });
  }

  renewTokens() {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem(localStorageKey) !== 'true') {
        return reject('Not logged in');
      }

      webAuth.checkSession({}, (err, authResult) => {
        if (err) {
          reject(err);
        } else {
          this.localLogin(authResult);
          resolve(authResult);
        }
      });
    });
  }
}
/* eslint-enable */

const service = new AuthService();

service.setMaxListeners(5);

export default service;
