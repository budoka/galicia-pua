import _ from 'lodash';
import { APIError } from 'src/exceptions';
import { Dictionary, IAPIMethod } from 'src/interfaces';
import { apis } from 'src/services/api-data';

export interface IAPIDataCache {
  cache: Dictionary<IAPIData>;
}

export interface IAPIData {
  url: string;
  method: IAPIMethod;
}

export const data: IAPIDataCache = {
  cache: {},
};

/**
 * Get the data of an API from an array of APIs.
 * @param apiName API name.
 * @param id Method/path id.
 */
export function getAPIData(apiName: string, id: string): IAPIData {
  const index = `${apiName}_${id}`;
  if (data.cache[index]) {
    // console.log('Cached!!!');
    return data.cache[index];
  }

  const api = _.find(apis, (api) => api.name === apiName);

  if (!api) throw new APIError(`API '${apiName}' not found.`);

  const url = api.url;
  const method = _.find(api.method, (path) => path.id === id);

  if (!method) throw new APIError(`Method id: '${id}' not found.`);

  // Cache the value and return it.
  return (data.cache[index] = { url, method });
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
