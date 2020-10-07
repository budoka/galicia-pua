import axios, { AxiosRequestConfig } from 'axios';
import { ThunkResult } from 'src/actions';
import { IRequestCache } from 'src/actions/interfaces';
import { Dictionary, QueryParams } from 'src/interfaces';
import { API } from 'src/services/api-data';
import { getAPIData, IAPIData } from 'src/utils/api';
import { parseObject } from 'src/utils/parse';
import { hashCode } from 'src/utils/string';
import {
  BoxContentTypeFilter,
  BoxContentTypeFilterAPIRequest,
  BoxContentTypeFilterAPIResponse,
  BoxTypeFilter,
  BoxTypeFilterAPIResponse,
  DetailTemplateFilter,
  DetailTemplateFilterAPIRequest,
  DetailTemplateFilterAPIResponse,
} from './interfaces';
import { BoxFilters, BoxFiltersActionTypes, BoxFiltersState } from './types';
// import { Option } from 'src/actions/boxes/box-filters/interfaces'

/*
Example ...
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
})*/

const reqCache: IRequestCache<any> = { cache: {} };

export const getBoxTypes = (queryParams?: QueryParams): ThunkResult => async (dispatch, getState) => {
  const isRunning = getState().boxes.filters.isRunning;

  if (isRunning) return;

  const params: QueryParams = {
    order: { id: 'ASC' },
    ...queryParams,
  };

  const apiName = API.TIPO_CAJA;
  const idMethod = 'tipoCaja';
  const api = getAPIData(apiName, idMethod);

  const { url } = api;
  const { verb, path, headers } = api.method;

  const endpoint = `${url}/${path}`;

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers };

  const index = hashCode(config);

  if (reqCache.cache[index]) {
    console.log('Cached tipoCaja!!!');
    const cachedData = reqCache.cache[index].data;
    dispatch(success(cachedData));
    return;
  }

  dispatch(running(true));

  return await axios(config)
    .then((response) => {
      const rawData: BoxTypeFilterAPIResponse[] = response.data;
      const boxTypes: BoxTypeFilter[] = rawData.map((d) => {
        return {
          key: d.id.toString(),
          value: d.descripcion,
        } as BoxTypeFilter;
      });

      reqCache.cache[index] = { data: boxTypes };

      dispatch(success(boxTypes));
    })
    .catch((error) => {
      dispatch(failure());
    });

  function running(running: BoxFiltersState['isRunning']): BoxFiltersActionTypes {
    return { type: BoxFilters.RUNNING, payload: running };
  }

  function success(boxTypes: BoxFiltersState['filter']['boxTypes']): BoxFiltersActionTypes {
    return { type: BoxFilters.GET_FILTER_BOX_TYPE_SUCCESS, payload: boxTypes };
  }

  function failure(): BoxFiltersActionTypes {
    return { type: BoxFilters.GET_FILTER_BOX_TYPE_FAILURE };
  }
};

export const getBoxContentTypes = (data: BoxTypeFilter): ThunkResult => async (dispatch, getState) => {
  const state = getState();
  const isRunning = state.boxes.filters.isRunning;

  if (isRunning) return;

  const apiName = API.TIPO_CAJA;
  const idMethod = 'tipoDeContenido';
  const api = getAPIData(apiName, idMethod);

  const { url } = api;
  const { verb, path, headers } = api.method;

  const endpoint = `${url}/${path}`;

  const dataRequest: BoxContentTypeFilterAPIRequest = {
    tipoCaja: data.value as string,
  };

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: dataRequest };

  const index = hashCode(config);

  if (reqCache.cache[index]) {
    console.log('Cached tipoDeContenido!!!');
    const cachedData = reqCache.cache[index].data;
    dispatch(success(cachedData));
    return;
  }

  dispatch(running(true));

  return await axios(config)
    .then((response) => {
      const rawData: BoxContentTypeFilterAPIResponse[] = response.data;
      const boxContentTypes: BoxContentTypeFilter[] = rawData.map((d) => {
        return {
          key: d,
          value: d,
        } as BoxContentTypeFilter;
      });

      reqCache.cache[index] = { data: boxContentTypes };

      dispatch(success(boxContentTypes));
    })
    .catch((error) => {
      dispatch(failure());
    });

  function running(running: BoxFiltersState['isRunning']): BoxFiltersActionTypes {
    return { type: BoxFilters.RUNNING, payload: running };
  }

  function success(boxContentTypes: BoxFiltersState['filter']['boxContentTypes']): BoxFiltersActionTypes {
    return { type: BoxFilters.GET_FILTER_BOX_CONTENT_TYPE_SUCCESS, payload: boxContentTypes };
  }

  function failure(): BoxFiltersActionTypes {
    return { type: BoxFilters.GET_FILTER_BOX_CONTENT_TYPE_FAILURE };
  }
};

export const getDetailTemplateTypes = (data: DetailTemplateFilter): ThunkResult => async (dispatch, getState) => {
  const state = getState();
  const isRunning = state.boxes.filters.isRunning;

  if (isRunning) return;

  const apiName = API.PLANTILLAS;
  const idMethod = 'plantillasPorSector';
  const api = getAPIData(apiName, idMethod);

  const { url } = api;
  const { verb, path, headers } = api.method;

  const endpoint = `${url}/${path}`;

  const dataRequest: DetailTemplateFilterAPIRequest = {
    //idSector: state.boxes.filters.selected.boxContentType?.value as string,
    idSector: 1243 /* data */,
  };

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: dataRequest };

  const index = hashCode(config);

  if (reqCache.cache[index]) {
    console.log('Cached plantillasPorSector!!!');
    const cachedData = reqCache.cache[index].data;
    dispatch(success(cachedData));
    return;
  }

  dispatch(running(true));

  return await axios(config)
    .then((response) => {
      const rawData: DetailTemplateFilterAPIResponse[] = response.data;
      const detailTemplates: DetailTemplateFilter[] = rawData.map((d) => {
        return {
          key: d.id.toString(),
          value: d.descripcion,
        } as DetailTemplateFilter;
      });

      reqCache.cache[index] = { data: detailTemplates };

      dispatch(success(detailTemplates));
    })
    .catch((error) => {
      dispatch(failure());
    });

  function running(running: BoxFiltersState['isRunning']): BoxFiltersActionTypes {
    return { type: BoxFilters.RUNNING, payload: running };
  }

  function success(detailTemplates: BoxFiltersState['filter']['detailTemplates']): BoxFiltersActionTypes {
    return { type: BoxFilters.GET_FILTER_DETAIL_TEMPLATE_SUCCESS, payload: detailTemplates };
  }

  function failure(): BoxFiltersActionTypes {
    return { type: BoxFilters.GET_FILTER_DETAIL_TEMPLATE_FAILURE };
  }
};

export const selectBoxType = (option: BoxTypeFilter): ThunkResult => (dispatch, getState) => {
  dispatch(success(option));

  function success(value: BoxFiltersState['selected']['boxType']): BoxFiltersActionTypes {
    return { type: BoxFilters.SELECT_BOX_TYPE, payload: value };
  }
};

export const selectBoxContentType = (option: BoxContentTypeFilter): ThunkResult => (dispatch, getState) => {
  dispatch(success(option));

  function success(value: BoxFiltersState['selected']['boxContentType']): BoxFiltersActionTypes {
    return { type: BoxFilters.SELECT_BOX_CONTENT_TYPE, payload: value };
  }
};

export const selectDetailTemplate = (option: DetailTemplateFilter): ThunkResult => (dispatch, getState) => {
  dispatch(success(option));

  function success(value: BoxFiltersState['selected']['detailTemplate']): BoxFiltersActionTypes {
    return { type: BoxFilters.SELECT_DETAIL_TEMPLATE, payload: value };
  }
};
