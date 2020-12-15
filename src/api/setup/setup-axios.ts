import * as retryAxios from 'retry-axios';
import axios from 'axios';

retryAxios.attach(axios);
axios.defaults.timeout = 30000;
axios.defaults.headers = {
  'content-type': 'application/json',
  accept: 'application/json',
};
axios.defaults.raxConfig = {
  retry: 5,
  retryDelay: 1000,
  backoffType: 'static',
  httpMethodsToRetry: ['GET', 'POST', 'HEAD', 'OPTIONS', 'DELETE', 'PUT'],
};
