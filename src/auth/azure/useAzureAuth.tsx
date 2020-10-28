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
import decodeJwt from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthAzureError } from 'src/exceptions/auth/azure';
import { hasJsonStructure } from 'src/utils/json';
import { JsxElement } from 'typescript';
import { JWTPayload } from '../interface';
import { MSAL_CONFIG } from './auth-config';

export type LoginType = 'loginRedirect' | 'loginPopup';

interface AuthRequests {
  loginPopupRequest: PopupRequest;
  profilePopupRequest: PopupRequest;
  loginRedirectRequest: RedirectRequest;
  profileRedirectRequest: RedirectRequest;
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

const useProvideAuth = () => {
  const [authInstance, setAuthInstance] = useState<PublicClientApplication>();
  const [authRequest, setAuthRequest] = useState<AuthRequests>();
  const [account, setAccount] = useState<AccountInfo>();
  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    createAuthInstance();
    setRequestObjects();
  }, []);

  useEffect(() => {
    if (authInstance && authRequest) loadAuthModule();
  }, [authInstance, authRequest]);

  /**
   * Create an auth instance.
   */
  const createAuthInstance = (): void => {
    setAuthInstance(new PublicClientApplication(MSAL_CONFIG));
  };

  /**
   * Initialize request objects used by this AuthModule.
   */
  const setRequestObjects = (): void => {
    const loginPopupRequest = {
      scopes: [],
    } as PopupRequest;

    const profilePopupRequest = {
      scopes: [],
      //scopes: ["User.Read"]
    } as PopupRequest;

    const loginRedirectRequest = {
      ...loginPopupRequest,
      redirectStartPage: window.location.href,
    } as RedirectRequest;

    const profileRedirectRequest = {
      ...profilePopupRequest,
      redirectStartPage: window.location.href,
    } as RedirectRequest;

    const silentProfileRequest = {
      scopes: [],
      account: { environment: '', homeAccountId: '', tenantId: '', username: '' },
      forceRefresh: false,
    } as SilentRequest;

    const silentLoginRequest = {
      scopes: [],
      loginHint: getUsername(),
    };

    const requests: AuthRequests = {
      loginPopupRequest: loginPopupRequest,
      profilePopupRequest: profilePopupRequest,
      loginRedirectRequest,
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
  const loadAuthModule = async (): Promise<void> => {
    if (!authInstance) throw new AuthAzureError('No se ha encontrado una instancia de autenticación.');
    if (!authRequest) throw new AuthAzureError('No se ha encontrado instancias de solicitud.');

    const response = await authInstance.handleRedirectPromise();

    handleResponse(response);
  };

  /**
   * Handles the response from a popup or redirect. If response is null, will check if we have any accounts and attempt to sign in.
   * @param res
   */
  const handleResponse = async (res: AuthenticationResult | null): Promise<void> => {
    if (res) {
      //console.log('Welcome!!');
      setData(res);
    } else {
      await attemptAcquireTokenSilent().catch(() => attemptSsoSilent());
    }
  };

  /**
   * Attemp to acquire a silent token from cache.
   */
  const attemptAcquireTokenSilent = async () => {
    if (!authInstance) throw new AuthAzureError('No se ha encontrado una instancia de autenticación.');
    if (!authRequest) throw new AuthAzureError('No se ha encontrado instancias de solicitud.');

    const account = getAccount();

    const silentProfileRequest: SilentRequest = {
      ...authRequest.silentProfileRequest,
      account: account || { environment: '', homeAccountId: '', tenantId: '', username: '' },
    };

    const response = await authInstance.acquireTokenSilent(silentProfileRequest);
    //console.log(response);
    setData(response);
  };

  /**
   * Calls ssoSilent to attempt silent flow. If it fails due to interaction required error, it will prompt the user to login using popup.
   * @param request
   */
  const attemptSsoSilent = async (loginType: LoginType = 'loginRedirect'): Promise<void> => {
    if (!authInstance) throw new AuthAzureError('No se ha encontrado una instancia de autenticación.');
    if (!authRequest) throw new AuthAzureError('No se ha encontrado instancias de solicitud.');

    const silentLoginRequest = authRequest.silentLoginRequest;

    try {
      const response = await authInstance.ssoSilent(silentLoginRequest);
      //console.log(response);
      setData(response);
    } catch (error) {
      //console.log('unabled to sso silent');
      //console.log(error);
      login(loginType);
    }
  };

  /**
   * Calls loginPopup or loginRedirect based on given loginType.
   * @param loginType
   */
  const login = async (loginType: LoginType): Promise<void> => {
    if (!authInstance) throw new AuthAzureError('No se ha encontrado una instancia de autenticación.');
    if (!authRequest) throw new AuthAzureError('No se ha encontrado instancias de solicitud.');

    if (loginType === 'loginPopup') {
      const loginRequest = authRequest.loginPopupRequest;

      try {
        const response = await authInstance.loginPopup(loginRequest);
        handleResponse(response);
      } catch (error) {
        //console.error(error);
      }
    } else if (loginType === 'loginRedirect') {
      const loginRedirectRequest = authRequest?.loginRedirectRequest;

      try {
        await authInstance.loginRedirect(loginRedirectRequest);
      } catch (error) {
        //console.error(error);
      }
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

  /**
   * Set the state data.
   * @param res
   */
  const setData = (res: AuthenticationResult): void => {
    setAccessToken(res.accessToken);
    setAccount(res.account ?? getAccount());
  };

  const getAccessTokenDecoded = () => {
    if (!accessToken) return;

    const token: JWTPayload = decodeJwt(accessToken);
    return token;
  };

  const getUsername = (storage: Storage = sessionStorage) => {
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (!key) continue;
      const value = storage.getItem(key)!;

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

    const accesToken = await getTokenPopup(silentProfileRequest, authRequest!.profilePopupRequest);
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
            .acquireTokenPopup(interactiveRequest)
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
};

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAzureAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAzureAuth().
export const AuthProvider = ({ disabled = false, children }: AuthProviderProps) => {
  if (disabled) return <>{children}</>;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const auth: AuthContextProps = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
