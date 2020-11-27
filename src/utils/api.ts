import dayjs from 'dayjs';
import { getVar } from './environment';
import { apis } from 'src/api/setup-apis';
import { AxiosRequestConfig } from 'axios';
import { APIs, API, Resource } from 'src/api/types';

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

export function buildEndpoint(baseURL: string, path: string) {
  return `${baseURL}/${path}`;
}

/**
 * Build the axios request config.
 * @param api API
 * @param resource resource
 * @param data body request
 */
export function buildAxiosRequestConfig<ResourceType>(api: API<ResourceType>, resource: Resource, data?: any) {
  const { baseURL } = api;
  const { verb, path, headers } = resource;
  const endpoint = buildEndpoint(baseURL, path);

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data };

  return config;
}
