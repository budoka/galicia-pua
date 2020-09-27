import {
  PublicClientApplication,
  AuthorizationUrlRequest,
  SilentRequest,
  AuthenticationResult,
  Configuration,
  LogLevel,
  AccountInfo,
  InteractionRequiredAuthError,
  EndSessionRequest,
  RedirectRequest,
  PopupRequest,
} from '@azure/msal-browser';

import { SsoSilentRequest } from '@azure/msal-browser/dist/src/request/SsoSilentRequest';
import { MSAL_CONFIG } from './auth-config';

export class AuthModule {
  private myMSALObj: PublicClientApplication; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/classes/_src_app_publicclientapplication_.publicclientapplication.html
  private account?: AccountInfo; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-common/modules/_src_account_accountinfo_.html
  private loginRedirectRequest?: RedirectRequest; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/modules/_src_request_redirectrequest_.html
  private loginRequest?: PopupRequest; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/modules/_src_request_popuprequest_.html
  private profileRedirectRequest?: RedirectRequest;
  private profileRequest?: PopupRequest;
  private silentProfileRequest?: SilentRequest; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/modules/_src_request_silentrequest_.html
  private silentLoginRequest?: SsoSilentRequest;

  constructor() {
    this.myMSALObj = new PublicClientApplication(MSAL_CONFIG);
    // this.account = null;
    this.setRequestObjects();
  }

  /**
   * Initialize request objects used by this AuthModule.
   */
  private setRequestObjects(): void {
    this.loginRequest = {
      scopes: [],
    };

    this.loginRedirectRequest = {
      ...this.loginRequest,
      redirectStartPage: window.location.href,
    };

    this.profileRequest = {
      scopes: ['User.Read'],
    };

    this.profileRedirectRequest = {
      ...this.profileRequest,
      redirectStartPage: window.location.href,
    };

    this.silentLoginRequest = {
      scopes: ['User.Read'],
      loginHint: 'l0629782@bancogalicianp.com.ar',
    };
  }

  /**
   * Calls getAllAccounts and determines the correct account to sign into, currently defaults to first account found in cache.
   * TODO: Add account chooser code
   *
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */
  private getAccount() {
    const currentAccounts = this.myMSALObj.getAllAccounts();
    console.log(currentAccounts);
    if (currentAccounts === null) {
      console.log('No accounts detected');
      return null;
    }

    if (currentAccounts.length > 1) {
      // Add choose account code here
      console.log('Multiple accounts detected, need to add choose account code.');
      return currentAccounts[0];
    } else if (currentAccounts.length === 1) {
      return currentAccounts[0];
    }
  }

  /**
   * Checks whether we are in the middle of a redirect and handles state accordingly. Only required for redirect flows.
   *
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md#redirect-apis
   */
  loadAuthModule(): void {
    this.myMSALObj
      .handleRedirectPromise()
      .then((resp: AuthenticationResult | null) => {
        if (resp) this.handleResponse(resp);
      })
      .catch(console.error);
  }

  /**
   * Handles the response from a popup or redirect. If response is null, will check if we have any accounts and attempt to sign in.
   * @param response
   */
  handleResponse(response: AuthenticationResult) {
    if (response !== null) {
      this.account = response.account;
    } else {
      this.account = this.getAccount() ?? undefined;
    }

    if (this.account) {
      console.log('Welcome!!');
      console.log(this.account);
      // UIManager.showWelcomeMessage(this.account);
    }
  }

  /**
   * Calls ssoSilent to attempt silent flow. If it fails due to interaction required error, it will prompt the user to login using popup.
   * @param request
   */
  attemptSsoSilent() {
    if (this.silentLoginRequest)
      this.myMSALObj
        .ssoSilent(this.silentLoginRequest)
        .then(() => {
          this.account = this.getAccount() ?? undefined;
          console.log('Welcome SSO!!');
          console.log(this.account);
          // UIManager.showWelcomeMessage(this.account);
        })
        .catch((error) => {
          console.error('Silent Error: ' + error);
          if (error instanceof InteractionRequiredAuthError) {
            this.login('loginPopup');
          }
        });
  }

  /**
   * Calls loginPopup or loginRedirect based on given signInType.
   * @param signInType
   */
  login(signInType: string): void {
    if (signInType === 'loginPopup') {
      this.myMSALObj
        .loginPopup(this.loginRequest)
        .then((resp: AuthenticationResult) => {
          this.handleResponse(resp);
        })
        .catch(console.error);
    } else if (signInType === 'loginRedirect') {
      this.myMSALObj.loginRedirect(this.loginRedirectRequest);
    }
  }

  /**
   * Logs out of current account.
   */
  logout(): void {
    const logOutRequest: EndSessionRequest = {
      account: this.account,
    };

    this.myMSALObj.logout(logOutRequest);
  }

  /**
   * Gets the token to read user profile data from MS Graph silently, or falls back to interactive redirect.
   */
  async getProfileTokenRedirect() {
    //if(!this.silentProfileRequest || !this.profileRedirectRequest || !this.account) return;
    this.silentProfileRequest!.account = this.account!;
    return this.getTokenRedirect(this.silentProfileRequest!, this.profileRedirectRequest!);
  }

  /**
   * Gets the token to read user profile data from MS Graph silently, or falls back to interactive popup.
   */
  async getProfileTokenPopup() {
    this.silentProfileRequest!.account = this.account!;
    return this.getTokenPopup(this.silentProfileRequest!, this.profileRequest!);
  }

  /**
   * Gets a token silently, or falls back to interactive popup.
   */
  private async getTokenPopup(silentRequest: SilentRequest, interactiveRequest: PopupRequest) {
    try {
      const response: AuthenticationResult = await this.myMSALObj.acquireTokenSilent(silentRequest);
      return response.accessToken;
    } catch (e) {
      console.log('silent token acquisition fails.');
      if (e instanceof InteractionRequiredAuthError) {
        console.log('acquiring token using redirect');
        return this.myMSALObj
          .acquireTokenPopup(interactiveRequest!)
          .then((resp) => {
            return resp.accessToken;
          })
          .catch((err) => {
            console.error(err);
            return null;
          });
      } else {
        console.error(e);
      }
    }
  }

  /**
   * Gets a token silently, or falls back to interactive redirect.
   */
  private async getTokenRedirect(silentRequest: SilentRequest, interactiveRequest: RedirectRequest) {
    try {
      const response = await this.myMSALObj.acquireTokenSilent(silentRequest);
      return response.accessToken;
    } catch (e) {
      console.log('silent token acquisition fails.');
      if (e instanceof InteractionRequiredAuthError) {
        console.log('acquiring token using redirect');
        this.myMSALObj.acquireTokenRedirect(interactiveRequest).catch(console.error);
      } else {
        console.error(e);
      }
    }
  }
}
