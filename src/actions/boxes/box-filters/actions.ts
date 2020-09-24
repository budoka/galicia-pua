import axios from 'axios';
import { ThunkResult } from 'src/actions';
import { QueryParams } from 'src/interfaces';
import { API } from 'src/services/api-data';
import { getAPIData } from 'src/utils/api';
import { parseObject } from 'src/utils/parse';
import { BoxTypeFilter, BoxTypeFilterAPIResponse } from './interfaces';
import { BoxFilters, BoxFiltersActionTypes, BoxFiltersState } from './types';
// import { Option } from 'src/actions/boxes/box-filters/interfaces'

/*
Example ...
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
})*/

export const getBoxTypes = (queryParams?: QueryParams): ThunkResult => async (dispatch, getState) => {
  const isFetching = getState().boxes.filters.isFetching;

  if (isFetching) return;

  dispatch(fetching(true));

  const params: QueryParams = {
    order: { id: 'ASC' },
    ...queryParams,
  };

  const apiName = API.TIPO_CAJA;
  const methodName = 'tipoCaja';
  const api = getAPIData(apiName, methodName);

  const { url } = api;
  const { verb, path, headers } = api.method;

  const endpoint = `${url}/${path}`;

  console.log(url);
  console.log(path);
  console.log(endpoint);

  return await axios({ method: verb, url: endpoint, headers })
    .then((response) => {
      const rawData: BoxTypeFilterAPIResponse[] = response.data;
      const boxTypes: BoxTypeFilter[] = rawData.map((d) => {
        const t = {} as BoxTypeFilter;
        parseObject<BoxTypeFilterAPIResponse, BoxTypeFilter>(d);
        return {
          key: d.id.toString(),
          value: d.descripcion,
        } as BoxTypeFilter;
      });

      dispatch(success(boxTypes));
    })
    .catch((error) => {
      console.log('response error');
      console.log(error);
      dispatch(failure());
    });

  function fetching(fetch: BoxFiltersState['isFetching']): BoxFiltersActionTypes {
    return { type: BoxFilters.FETCHING, payload: fetch };
  }

  function success(boxTypes: BoxFiltersState['filter']['boxTypes']): BoxFiltersActionTypes {
    return { type: BoxFilters.GET_FILTER_BOX_TYPE_SUCCESS, payload: boxTypes };
  }

  function failure(): BoxFiltersActionTypes {
    return { type: BoxFilters.GET_FILTER_BOX_TYPE_FAILURE };
  }
};

export const selectOption = (option: BoxTypeFilter): ThunkResult => (dispatch, getState) => {
  dispatch(success(option));

  function success(value: BoxFiltersState['selected']['boxType']): BoxFiltersActionTypes {
    return { type: BoxFilters.SELECT_BOX_TYPE, payload: value };
  }
};
