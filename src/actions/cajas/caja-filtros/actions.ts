import axios, { AxiosRequestConfig } from 'axios';
/* import { ThunkResult } from 'src/actions';
import { Dictionary, QueryParams } from 'src/interfaces';

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


export const getTiposCaja = (queryParams?: QueryParams): ThunkResult => async (dispatch, getState) => {
  const isRunning = getState().cajas.filtros.isRunning;

  if (isRunning) return;

  const params: QueryParams = {
    order: { id: 'ASC' },
    ...queryParams,
  };

  const apiId = API.TIPO_CAJA;
  const resourceId = 'tipoCaja';
  const resourceData = getResourceData(apiId, resourceId);

  const { url } = resourceData;
  const { verb, path, headers } = resourceData.resource;

  const endpoint = `${url}/${path}`;

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers };

  const index = hashCode(config);

  dispatch(running(true));

  return await axios
    .request<FiltroTipoCajaResponse[]>(config)
    .then((response) => {
      const ff: FiltroTipoCajaResponse = { id: 1, descripcion: 'Documentos' };
      const data = response.data ?? ff;
      //  reqCache.cache[index] = { data };

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

  const apiId = API.TIPO_CAJA;
  const resourceId = 'tipoDeContenido';
  const resourceData = getResourceData(apiId, resourceId);

  const { url } = resourceData;
  const { verb, path, headers } = resourceData.resource;

  const endpoint = `${url}/${path}`;

  const dataRequest: FiltroTipoContenidoCajaRequest = {
    tipoCaja: tipoCaja?.descripcion as string,
  };

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: dataRequest };

  const index = hashCode(config);


  dispatch(running(true));

  return await axios
    .request<FiltroTipoContenidoCajaResponseV1[]>(config)
    .then((response) => {
      const data = response.data;
      // reqCache.cache[index] = { data };

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

export const getTiposPlantilla = (tipoContenidoCaja: FiltrosCajaState['seleccionado']['tipoContenido']): ThunkResult => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const isRunning = state.cajas.filtros.isRunning;

  if (isRunning) return;

  const apiId = API.PLANTILLAS_SECTOR;
  const resourceId = 'plantillasPorSector';
  const resourceData = getResourceData(apiId, resourceId);

  const { url } = resourceData;
  const { verb, path, headers } = resourceData.resource;

  const endpoint = `${url}/${path}`;

  const dataRequest = {
    //idSector: state.cajas.filters.selected.cajaContentType?.value as string,
    idSector: //state.user.idSector ??  1243,
  };

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: dataRequest };

  const index = hashCode(config);


  dispatch(running(true));

  return await axios
    .request<FiltroTipoPlantillaResponse[]>(config)
    .then((response) => {
      const data = response.data;
      //   reqCache.cache[index] = { data };

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

export const setTipoCajaSeleccionado = (idTipoCaja: FiltrosCajaState['seleccionado']['tipoCaja']): ThunkResult => (dispatch, getState) => {
  dispatch(success(idTipoCaja));

  function success(tipoCaja: FiltrosCajaState['seleccionado']['tipoCaja']): FiltrosCajaActionTypes {
    return { type: FiltrosCajaAction.SELECT_BOX_TYPE, tipoCaja };
  }
};

export const setTipoContenidoCajaSeleccionado = (idTipoContenido: FiltrosCajaState['seleccionado']['tipoContenido']): ThunkResult => (
  dispatch,
  getState,
) => {
  dispatch(success(idTipoContenido));

  function success(tipoContenidoCaja: FiltrosCajaState['seleccionado']['tipoContenido']): FiltrosCajaActionTypes {
    return { type: FiltrosCajaAction.SELECT_BOX_CONTENT_TYPE, tipoContenidoCaja };
  }
};

export const setTipoPlantillaSeleccionado = (idTipoPlantilla: FiltrosCajaState['seleccionado']['tipoPlantilla']): ThunkResult => (
  dispatch,
  getState,
) => {
  dispatch(success(idTipoPlantilla));

  function success(tipoPlantilla: FiltrosCajaState['seleccionado']['tipoPlantilla']): FiltrosCajaActionTypes {
    return { type: FiltrosCajaAction.SELECT_BOX_DETAIL_TEMPLATE, preview: tipoPlantilla };
  }
};
 */
