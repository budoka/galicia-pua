import * as msal from '@azure/msal-browser';
import { Configuration } from '@azure/msal-browser';

export const MSAL_CONFIG: Configuration = {
  auth: {
    clientId: '9c9c6d3e-b9f3-4b21-a508-75ccd2bd5236',
    authority: 'https://login.microsoftonline.com/9eea4475-3e4a-4124-9621-552fa654f21c',
    // redirectUri: 'http://localhost:3000/ok',
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    // iframeHashTimeout: 10000,
    loggerOptions: {
      loggerCallback: (level: msal.LogLevel, message: string, containsPii: any) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case msal.LogLevel.Error:
            console.error(message);
            return;
          case msal.LogLevel.Info:
            console.info(message);
            return;
          case msal.LogLevel.Verbose:
            console.debug(message);
            return;
          case msal.LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};
