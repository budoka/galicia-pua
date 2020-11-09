import dayjs from 'dayjs';
import _ from 'lodash';
import { APIError } from 'src/exceptions/api';
import { apis } from 'src/services/apis-data';
import { getVar } from './environment';

export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface IAPI {
  name: string;
  url: string;
  methods: IAPIMethod[];
}

export interface IAPIMethod {
  id: string;
  verb: HttpVerb;
  path: string;
  timeout?: number;
  headers?: {
    [header: string]: string | number | boolean;
  };
  data?: {
    [data: string]: string | number | boolean;
  };
  params?: {
    [params: string]: string | number | boolean;
  };
}

export interface IAPIData {
  url: string;
  method: IAPIMethod;
}

interface ICache<T> {
  [key: string]: T;
}

interface IAPIDataCache {
  cache: ICache<IAPIData>;
}

const cache: ICache<IAPIData> = {};

/**
 * Get the data of an API from an array of APIs.
 * @param apiName API name.
 * @param id Method/path id.
 */
export function getAPIData(apiName: string, id: string): IAPIData {
  const index = `${apiName}_${id}`;
  if (cache[index]) return cache[index];

  const api = apis.find((api) => api.name === apiName);

  if (!api) throw new APIError(`API '${apiName}' not found.`);

  const url = api.url;

  const method = api.methods.find((path) => path.id === id);

  if (!method) throw new APIError(`Method id: '${id}' not found.`);

  // Cache the value and return it.
  return (cache[index] = { url, method });
}

/**
 * Get the url of an API from an array of APIs.
 * @param apiName API name.
 */
export function getAPIURL(apiName: string) {
  const api = apis.find((api) => api.name === apiName);

  if (!api) throw new APIError(`API '${apiName}' not found.`);

  return api.url;
}

/**
 * Build the url of an API.
 * @param apiName API name.
 */
export function buildAPIUrl(apiName: string) {
  const PREFIX_API = 'API_';
  const prefix = getVar(PREFIX_API + 'PREFIX');
  const suffix = getVar(PREFIX_API + 'SUFFIX');
  apiName = getVar(PREFIX_API + apiName);

  return prefix + apiName + suffix;
}

/**
 * Get expiration unix time
 * @param value value
 * @param unit default value *second*
 */
export function getExpirationTime(value: number, unit?: 'second' | 'minute') {
  if (!unit) unit = 'second';
  return dayjs().add(value, unit).unix();
}
