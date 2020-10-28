import _ from 'lodash';
import { APIError } from 'src/exceptions/api';
import { Dictionary, IAPIMethod } from 'src/interfaces';
import { apis } from 'src/services/apis-data';
import { getVar } from './environment';

export interface IAPIData {
  url: string;
  method: IAPIMethod;
}

export interface IAPIDataCache {
  cache: Dictionary<IAPIData>;
}

export const cache: Dictionary<IAPIData> = {};

/**
 * Get the data of an API from an array of APIs.
 * @param apiName API name.
 * @param id Method/path id.
 */
export function getAPIData(apiName: string, id: string): IAPIData {
  const index = `${apiName}_${id}`;
  if (cache[index]) {
    // console.log('Cached!!!');
    return cache[index];
  }

  const api = _.find(apis, (api) => api.name === apiName);

  if (!api) throw new APIError(`API '${apiName}' not found.`);

  const url = api.url;
  const method = _.find(api.method, (path) => path.id === id);

  if (!method) throw new APIError(`Method id: '${id}' not found.`);

  // Cache the value and return it.
  return (cache[index] = { url, method });
}

/**
 * Get the url of an API from an array of APIs.
 * @param apiName API name.
 */
export function getAPIURL(apiName: string) {
  const api = _.find(apis, (api) => api.name === apiName);

  if (!api) throw new APIError(`API '${apiName}' not found.`);

  const url = api.url;

  return url;
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
