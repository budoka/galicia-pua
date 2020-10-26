import axios, { AxiosRequestConfig } from 'axios';
import { ThunkResult } from 'src/actions';
import { IRequestCache } from 'src/actions/interfaces';
import { Dictionary, QueryParams } from 'src/interfaces';
import { API } from 'src/services/apis-data';
import { getAPIData, IAPIData } from 'src/utils/api';
import { parseObject } from 'src/utils/parse';
import { hashCode } from 'src/utils/string';
import {
  FiltroTipoContenidoCajaRequest,
  FiltroTipoContenidoCajaResponse,
  FiltroTipoCajaResponse,
  FiltroPlantillaRequest,
  FiltroTipoPlantillaResponse,
  FiltroTipoContenidoCajaResponseV1,
} from './interfaces';
import { FiltrosCajaAction, FiltrosCajaActionTypes, FiltrosCajaState } from './types';
// import { Option } from 'src/actions/cajas/caja-filters/interfaces'

/*
Example ...
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
})*/

const reqCache: IRequestCache<any> = { cache: {} };

export const getTiposCaja = (queryParams?: QueryParams): ThunkResult => async (dispatch, getState) => {
  const isRunning = getState().cajas.filtros.isRunning;

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

  return await axios
    .request<FiltroTipoCajaResponse[]>(config)
    .then((response) => {
      const data = response.data;
      reqCache.cache[index] = { data };

      dispatch(success(data));
    })
    .catch((error) => {
      dispatch(failure());
    });

  function running(isRunning: FiltrosCajaState['isRunning']): FiltrosCajaActionTypes {
    return { type: FiltrosCajaAction.RUNNING_FILTER, isRunning };
  }

  function success(tiposCaja: FiltrosCajaState['filtro']['tiposCaja']): FiltrosCajaActionTypes {
    return { type: FiltrosCajaAction.GET_FILTER_BOX_TYPE_SUCCESS, tiposCaja };
  }

  function failure(): FiltrosCajaActionTypes {
    return { type: FiltrosCajaAction.GET_FILTER_BOX_TYPE_FAILURE };
  }
};

export const getTiposContenidoCaja = (tipoCaja: FiltrosCajaState['seleccionado']['tipoCaja']): ThunkResult => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const isRunning = state.cajas.filtros.isRunning;

  if (isRunning) return;

  const apiName = API.TIPO_CAJA;
  const idMethod = 'tipoDeContenido';
  const api = getAPIData(apiName, idMethod);

  const { url } = api;
  const { verb, path, headers } = api.method;

  const endpoint = `${url}/${path}`;

  const dataRequest: FiltroTipoContenidoCajaRequest = {
    tipoCaja: tipoCaja?.descripcion as string,
  };

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: dataRequest /*tipoCaja*/ };

  const index = hashCode(config);

  // Desactivado hasta que se arregle la request
  /*if (reqCache.cache[index]) {
    console.log('Cached tipoDeContenido!!!');
    const cachedData = reqCache.cache[index].data;
    console.log(cachedData);

    dispatch(success(cachedData));
    return;
  }*/

  dispatch(running(true));

  return await axios
    .request<FiltroTipoContenidoCajaResponseV1[]>(config)
    .then((response) => {
      const data = response.data;
      reqCache.cache[index] = { data };

      const dataFixed: FiltroTipoContenidoCajaResponse[] = data.map((d) => {
        return { id: d, descripcion: d };
      });

      dispatch(success(dataFixed));
    })
    .catch((error) => {
      dispatch(failure());
    });

  function running(isRunning: FiltrosCajaState['isRunning']): FiltrosCajaActionTypes {
    return { type: FiltrosCajaAction.RUNNING_FILTER, isRunning };
  }

  function success(tiposContenidoCaja: FiltrosCajaState['filtro']['tiposContenidoCaja']): FiltrosCajaActionTypes {
    return { type: FiltrosCajaAction.GET_FILTER_BOX_CONTENT_TYPE_SUCCESS, tiposContenidoCaja };
  }

  function failure(): FiltrosCajaActionTypes {
    return { type: FiltrosCajaAction.GET_FILTER_BOX_CONTENT_TYPE_FAILURE };
  }
};

export const getTiposPlantilla = (tipoContenidoCaja: FiltrosCajaState['seleccionado']['tipoContenidoCaja']): ThunkResult => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const isRunning = state.cajas.filtros.isRunning;

  if (isRunning) return;

  const apiName = API.PLANTILLAS_SECTOR;
  const idMethod = 'plantillasPorSector';
  const api = getAPIData(apiName, idMethod);

  const { url } = api;
  const { verb, path, headers } = api.method;

  const endpoint = `${url}/${path}`;

  const dataRequest = {
    //idSector: state.cajas.filters.selected.cajaContentType?.value as string,
    idSector: /*state.user.idSector ?? */ 1243,
  };

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: dataRequest /*tipoContenidoCaja*/ };

  const index = hashCode(config);

  if (reqCache.cache[index]) {
    console.log('Cached plantillasPorSector!!!');
    const cachedData = reqCache.cache[index].data;
    dispatch(success(cachedData));
    return;
  }

  dispatch(running(true));

  return await axios
    .request<FiltroTipoPlantillaResponse[]>(config)
    .then((response) => {
      const data = response.data;
      reqCache.cache[index] = { data };

      dispatch(success(data));
    })
    .catch((error) => {
      dispatch(failure());
    });

  function running(isRunning: FiltrosCajaState['isRunning']): FiltrosCajaActionTypes {
    return { type: FiltrosCajaAction.RUNNING_FILTER, isRunning };
  }

  function success(tiposPlantilla: FiltrosCajaState['filtro']['tiposPlantilla']): FiltrosCajaActionTypes {
    return { type: FiltrosCajaAction.GET_FILTER_DETAIL_TEMPLATE_SUCCESS, previews: tiposPlantilla };
  }

  function failure(): FiltrosCajaActionTypes {
    return { type: FiltrosCajaAction.GET_FILTER_DETAIL_TEMPLATE_FAILURE };
  }
};

export const setTipoCajaSeleccionado = (tipoCaja: FiltrosCajaState['seleccionado']['tipoCaja']): ThunkResult => (dispatch, getState) => {
  dispatch(success(tipoCaja));

  function success(tipoCaja: FiltrosCajaState['seleccionado']['tipoCaja']): FiltrosCajaActionTypes {
    return { type: FiltrosCajaAction.SELECT_BOX_TYPE, tipoCaja };
  }
};

export const setTipoContenidoCajaSeleccionado = (tipoContenidoCaja: FiltrosCajaState['seleccionado']['tipoContenidoCaja']): ThunkResult => (
  dispatch,
  getState,
) => {
  dispatch(success(tipoContenidoCaja));

  function success(tipoContenidoCaja: FiltrosCajaState['seleccionado']['tipoContenidoCaja']): FiltrosCajaActionTypes {
    return { type: FiltrosCajaAction.SELECT_BOX_CONTENT_TYPE, tipoContenidoCaja };
  }
};

export const setTipoPlantillaSeleccionado = (tipoPlantilla: FiltrosCajaState['seleccionado']['tipoPlantilla']): ThunkResult => (
  dispatch,
  getState,
) => {
  dispatch(success(tipoPlantilla));

  function success(tipoPlantilla: FiltrosCajaState['seleccionado']['tipoPlantilla']): FiltrosCajaActionTypes {
    return { type: FiltrosCajaAction.SELECT_DETAIL_TEMPLATE, preview: tipoPlantilla };
  }
};
