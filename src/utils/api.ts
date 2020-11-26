import dayjs from 'dayjs';
import _ from 'lodash';
import { APIError } from 'src/exceptions/api';
import { apis, ResourceAPI } from 'src/services/apis-data';
import { getVar } from './environment';

export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ResourceData {
  url: string;
  resource: ResourceAPI;
}

interface ICache<T> {
  [key: string]: T;
}

const cache: ICache<ResourceData> = {};

/**
 * Get the data of an API from an array of APIs.
 * @param apiId API id.
 * @param resourceId Resource id.
 */
export function getResourceData(apiId: string, resourceId: string): ResourceData {
  const index = `${apiId}_${resourceId}`;
  if (cache[index]) return cache[index];

  const api = apis.find((api) => api.id === apiId);

  if (!api) throw new APIError(`API '${apiId}' not found.`);

  const baseURL = api.baseURL;

  const resource = api.resources.find((resource) => resource.id === resourceId);

  if (!resource) throw new APIError(`Method id: '${resourceId}' not found.`);

  // Cache the value and return it.
  return (cache[index] = { url: baseURL, resource: resource });
}

/**
 * Get the url of an API from an array of APIs.
 * @param apiId API id.
 */
export function getBaseURL(apiId: string) {
  const api = apis.find((api) => api.id === apiId);

  if (!api) throw new APIError(`API '${apiId}' not found.`);

  return api.baseURL;
}

/**
 * Build the url of an API.
 * @param apiId API id.
 */
export function buildBaseURL(apiId: string) {
  const PREFIX_API = 'API_';
  const prefix = getVar(PREFIX_API + 'PREFIX');
  const suffix = getVar(PREFIX_API + 'SUFFIX');
  apiId = getVar(PREFIX_API + apiId);

  return prefix + apiId + suffix;
}

/**
 * Get expiration unix time
 * @param value value value *15*
 * @param unit default value *second*
 */
export function getExpirationTime(value: number = 15, unit: 'second' | 'minute' = 'second') {
  return dayjs().add(value, unit).unix();
}
