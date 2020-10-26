import {
  AccountInfo,
  AuthenticationResult,
  EndSessionRequest,
  InteractionRequiredAuthError,
  PopupRequest,
  PublicClientApplication,
  RedirectRequest,
  SilentRequest,
  SsoSilentRequest,
} from '@azure/msal-browser';
import { LayoutProps } from 'antd/lib/layout';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MSAL_CONFIG } from './auth-config';
import decodeJwt from 'jwt-decode';
import _ from 'lodash';
import { JWTPayload } from '../interface';
import { hasJsonStructure } from 'src/utils/json';

export type LoginType = 'loginRedirect' | 'loginPopup';

interface AuthRequests {
  loginRedirectRequest: RedirectRequest;
  loginRequest: PopupRequest;
  profileRedirectRequest: RedirectRequest;
  profileRequest: PopupRequest;
  silentProfileRequest: SilentRequest;
  silentLoginRequest: SsoSilentRequest;
}

interface AuthContextProps {
  authInstance?: PublicClientApplication;
  account?: AccountInfo;
  accessToken?: string;
  logout?: () => void;
  getAccessTokenDecoded?: () => JWTPayload;
  getProfileTokenRedirect?: () => Promise<string | undefined>;
  getProfileTokenPopup?: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextProps>({});

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export const ProvideAuth = ({ children }: LayoutProps) => {
  const auth: AuthContextProps = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAzureAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth() {
  const [authInstance, setAuthInstance] = useState<PublicClientApplication>();
  const [authRequest, setAuthRequest] = useState<AuthRequests>();
  const [account, setAccount] = useState<AccountInfo>();
  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    if (!accessToken) return;

    console.log(accessToken);

    const decodedToken = getAccessTokenDecoded()!;
    const exp = +decodedToken?.exp;
    const now = ~~(Date.now() / 1000);

    console.log(now > exp);
    console.log(decodedToken);

    if (now > exp) {
      console.log('silent access token');
      setAccessToken(undefined);
      //  getSilentAccessToken();
    }
  }, []);

  useEffect(() => {
    if (accessToken) return;
    createAuthInstance();
    setRequestObjects();
  }, [accessToken]);

  useEffect(() => {
    if (authInstance && authRequest) {
      loadAuthModule();
    }
  }, [authInstance, authRequest]);

  // Revisar access token exp y obtener uno nuevo
  /*useEffect(() => {
    console.log(account);
    if (!account) return;
    if (accessToken) {
      const decoded = getAccessTokenDecoded()!;
      const exp = +decoded?.exp;
      const now = ~~(Date.now() / 1000);

      console.log(now > exp);
      console.log(accessToken);

      if (now > exp) {
        console.log('silent access token');
        //  getSilentAccessToken();
      }
    } else {
      console.log('getSilentAccessToken');
      //  getSilentAccessToken();
    }
  }, [account]);*/

  /**
   * Create an auth instance.
   */
  const createAuthInstance = (): void => {
    setAuthInstance(new PublicClientApplication(MSAL_CONFIG));
  };

  /**
   * Get the username from the local storage.
   */
  const getUsername = () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const value = localStorage.getItem(key)!;

      if (hasJsonStructure(value)) {
        const data = JSON.parse(value);
        //console.log(data);
        const username = data.username;
        //console.log(username);
        if (username) return username;
      }
    }
  };

  /**
   * Initialize request objects used by this AuthModule.
   */
  const setRequestObjects = (): void => {
    const loginRequest = {
      scopes: [],
    };

    const loginRedirectRequest = {
      ...loginRequest,
      redirectStartPage: window.location.href,
    };

    const profileRequest = {
      scopes: [],
      //scopes: ["User.Read"]
    };

    const profileRedirectRequest = {
      ...profileRequest,
      redirectStartPage: window.location.href,
    };

    // Add here scopes for access token to be used at MS Graph API endpoints.

    const silentProfileRequest = {
      scopes: [],
      account: { environment: '', homeAccountId: '', tenantId: '', username: '' },
      forceRefresh: false,
    };

    const silentLoginRequest = {
      scopes: [],
      loginHint: getUsername(),
    };

    const requests: AuthRequests = {
      loginRequest,
      loginRedirectRequest,
      profileRequest,
      profileRedirectRequest,
      silentProfileRequest,
      silentLoginRequest,
    };

    setAuthRequest(requests);
  };

  /**
   * Calls getAllAccounts and determines the correct account to sign into, currently defaults to first account found in cache.
   * TODO: Add account chooser code
   *
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */
  const getAccount = (): AccountInfo | undefined => {
    const currentAccounts = authInstance?.getAllAccounts();

    // console.log(currentAccounts);

    if (!currentAccounts || currentAccounts.length === 0) {
      //console.log('No accounts detected');
      return;
    }

    if (currentAccounts.length > 1) {
      // Add choose account code here
      // console.log('Multiple accounts detected, need to add choose account code.');
    }

    return currentAccounts[0];
  };

  /**
   * Checks whether we are in the middle of a redirect and handles state accordingly. Only required for redirect flows.
   *
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md#redirect-apis
   */
  const loadAuthModule = (): void => {
    if (!authInstance) return;

    authInstance
      .handleRedirectPromise()
      .then((res: AuthenticationResult | null) => {
        //console.log(res);
        if (res) handleResponse(res);
        else attemptSsoSilent();
      })
      .catch();
  };

  /**
   * Set the state data.
   * @param res
   */
  const setData = (res: AuthenticationResult): void => {
    setAccessToken(res.accessToken);
    setAccount(res.account ?? getAccount());
  };

  /**
   * Handles the response from a popup or redirect. If response is null, will check if we have any accounts and attempt to sign in.
   * @param res
   */
  const handleResponse = (res: AuthenticationResult): void => {
    //console.log('Welcome!!');
    setData(res);
  };

  /**
   * Calls ssoSilent to attempt silent flow. If it fails due to interaction required error, it will prompt the user to login using popup.
   * @param request
   */
  const attemptSsoSilent = (loginType: LoginType = 'loginRedirect'): void => {
    const silentLoginRequest = authRequest?.silentLoginRequest;

    if (silentLoginRequest) {
      authInstance!
        .ssoSilent(silentLoginRequest)
        .then((res) => {
          //console.log('Welcome SSO!!');
          setData(res);
        })
        .catch((error) => {
          // console.error('Silent Error: ' + error);
          if (error instanceof InteractionRequiredAuthError /*|| !status*/) {
            // login(loginType);
          }
          login(loginType);
        });
    }
  };

  /**
   * Calls loginPopup or loginRedirect based on given signInType.
   * @param signInType
   */
  const login = (loginType: LoginType): void => {
    //setStatus(false);
    if (loginType === 'loginPopup') {
      const loginRequest = authRequest?.loginRequest;

      authInstance!
        .loginPopup(loginRequest)
        .then((res: AuthenticationResult) => {
          handleResponse(res);
        })
        .catch();
    } else if (loginType === 'loginRedirect') {
      const loginRedirectRequest = authRequest?.loginRedirectRequest;
      authInstance!.loginRedirect(loginRedirectRequest).catch(/*(e) => console.log(e)*/);
    }
  };

  /**
   * Logs out of current account.
   */
  const logout = (): void => {
    const logOutRequest: EndSessionRequest = {
      account: account,
    };
    if (authInstance) authInstance.logout(logOutRequest);
  };

  const getSilentAccessToken = async () => {
    if (!authInstance || !account) return;

    const silentProfileRequest: SilentRequest = {
      ...authRequest!.silentProfileRequest,
      account: account,
    };

    const response = await authInstance!.acquireTokenSilent(silentProfileRequest);
    const accessToken = response.accessToken;
    setAccessToken(accessToken);
    return accessToken;
  };

  const getAccessTokenDecoded = () => {
    if (!accessToken) return;

    const token: JWTPayload = decodeJwt(accessToken);
    return token;
  };

  /**
   * Gets the token to read user profile data from MS Graph silently, or falls back to interactive redirect.
   */
  const getProfileTokenRedirect = async () => {
    //console.log('getProfileTokenRedirect');
    if (!authInstance || !account) return;

    const silentProfileRequest: SilentRequest = {
      ...authRequest!.silentProfileRequest,
      account: account,
    };

    const accesToken = await getTokenRedirect(silentProfileRequest, authRequest!.profileRedirectRequest);
    setAccessToken(accesToken);
    return accesToken;

    /**
     * Gets a token silently, or falls back to interactive redirect.
     */
    async function getTokenRedirect(silentRequest: SilentRequest, interactiveRequest: RedirectRequest) {
      try {
        const response = await authInstance!.acquireTokenSilent(silentRequest);
        return response.accessToken;
      } catch (e) {
        //console.log('silent token acquisition fails.');
        if (e instanceof InteractionRequiredAuthError) {
          //console.log('acquiring token using redirect');
          authInstance!.acquireTokenRedirect(interactiveRequest).catch();
        } else {
          //console.error(e);
        }
      }
    }
  };

  /**
   * Gets the token to read user profile data from MS Graph silently, or falls back to interactive popup.
   */
  const getProfileTokenPopup = async () => {
    // console.log('getProfileTokenPopup');
    if (!authInstance || !account) return;

    const silentProfileRequest: SilentRequest = {
      ...authRequest!.silentProfileRequest,
      account: account,
    };

    const accesToken = await getTokenPopup(silentProfileRequest, authRequest!.profileRequest);
    setAccessToken(accesToken);
    return accesToken;

    /**
     * Gets a token silently, or falls back to interactive popup.
     */
    async function getTokenPopup(silentRequest: SilentRequest, interactiveRequest: PopupRequest) {
      try {
        const response: AuthenticationResult = await authInstance!.acquireTokenSilent(silentRequest);
        return response.accessToken;
      } catch (e) {
        //console.log('silent token acquisition fails.');
        if (e instanceof InteractionRequiredAuthError) {
          //console.log('acquiring token using redirect');
          return await authInstance!
            .acquireTokenPopup(interactiveRequest!)
            .then((resp) => {
              return resp.accessToken;
            })
            .catch();
        } else {
          //console.error(e);
        }
      }
    }
  };

  return {
    authInstance,
    account,
    accessToken,
    getAccessTokenDecoded,
    getProfileTokenRedirect,
    getProfileTokenPopup,
    logout,
  } as AuthContextProps;
}
