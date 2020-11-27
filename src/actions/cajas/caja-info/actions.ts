import axios, { AxiosRequestConfig } from 'axios';
import { ThunkResult } from 'src/actions';

import { goTo } from 'src/utils/history';
import { hashCode } from 'src/utils/string';
import { InfoCajaAction, InfoCajaState, InfoCajaActionTypes } from '../caja-info';
import { Caja, InfoCaja, ContenidoCaja, GuardarCajaBodyRequest } from '../interfaces';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { apis } from 'src/api/setup-apis';
import { buildEndpoint, buildAxiosRequestConfig } from 'src/utils/api';
import { useDispatch } from 'react-redux';

export interface VencimientoCajaRequestBody {
  idTipoCaja: number;
  tipoContenido: string;
}

export type VencimientoCajaResponseBody = number;

export const getVencimientoCaja = createAsyncThunk('cajas/getVencimientoCaja', async (data: VencimientoCajaRequestBody, thunkApi) => {
  const { dispatch, getState } = thunkApi;

  const api = apis['TIPO_CAJA'];
  const resource = api.resources['VENCIMIENTO_CAJA'];
  const config: AxiosRequestConfig = buildAxiosRequestConfig(api, resource, data);

  const response = await axios.request<VencimientoCajaResponseBody>(config);
  return response.data;
});

export interface GuardarCajaRequestBody {
  idTipoCaja: number | null;
  idTipoContenido: number | null;
  idPlantilla: number | null;
  idUsuarioAlta: number | null;
  idSectorOrigen: number | null;
  descripcion: string | null;
  restringida: number | null;
  fechaGeneracion: string | null;
  fechaVencimiento: string | null;
  fechaDesde: string | null;
  fechaHasta: string | null;
}

export interface GuardarCajaResponseBody {
  numero: number;
}

export const saveCaja = createAsyncThunk('cajas/saveCaja', async (data: GuardarCajaRequestBody, thunkApi) => {
  const { dispatch, getState } = thunkApi;

  const api = apis['CAJA'];
  const resource = api.resources['GUARDAR_CAJA'];
  const config: AxiosRequestConfig = buildAxiosRequestConfig(api, resource, data);

  const response = await axios.request<GuardarCajaResponseBody>(config);
  const responseData = response.data;
  goTo(`/editar-caja/${responseData.numero}`);
  return responseData;
});

export const getCaja = createAsyncThunk('cajas/saveCaja', async (data: VencimientoCajaRequestBody, thunkApi) => {
  const { dispatch, getState } = thunkApi;

  const api = apis['CAJA'];
  const resource = api.resources['GUARDAR_CAJA'];
  const config: AxiosRequestConfig = buildAxiosRequestConfig(api, resource, data);

  const response = await axios.request<VencimientoCajaResponseBody>(config);
  const responseData = response.data;
  goTo(`/editar-caja/${responseData}`);
  return responseData;
});

/* 
export const getCaja = (idCaja: Caja['id']): ThunkResult => async (dispatch, getState) => {
  if (!idCaja) return;

  const isRunning = getState().cajas.info.isRunning;

  if (isRunning) return;

  const apiId = API.CAJA;
  const resourceId = 'infoCaja';
  const resourceData = getResourceData(apiId, resourceId);

  const { url } = resourceData;
  const { verb, path, headers } = resourceData.resource;

  const endpoint = `${url}/${path}`;

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: { idCaja } };

  const index = hashCode(config);

  dispatch(running());

  return await axios
    .request<Caja>(config)
    .then((response) => {
      const caja = response.data;

      //  reqCache.cache[index] = { data: caja };

      // const caja = { numero: cajaId } as Caja;

      dispatch(success(caja));
    })
    .catch((error) => {
      dispatch(failure());
    });

  function running(): InfoCajaActionTypes {
    return { type: InfoCajaAction.RUNNING };
  }

  function success(caja: Caja): InfoCajaActionTypes {
    return { type: InfoCajaAction.CREATE_BOX_SUCCESS, caja };
  }

  function failure(): InfoCajaActionTypes {
    return { type: InfoCajaAction.CREATE_BOX_FAILURE };
  }
};

export const getVencimientoCaja2 = (data: VencimientoCajaRequestBody): ThunkResult => async (dispatch, getState) => {
  const isRunning = getState().cajas.info.isRunning;

  if (isRunning) return;

  const endpoint = `${url}/${path}`;

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data };

  const index = hashCode(config);

  dispatch(running());

  return await axios
    .request<Caja>(config)
    .then((response) => {
      const caja = response.data;

      //  reqCache.cache[index] = { data: caja };

      // const caja = { numero: cajaId } as Caja;

      dispatch(success(caja));
    })
    .catch((error) => {
      dispatch(failure());
    });

  function running(): InfoCajaActionTypes {
    return { type: InfoCajaAction.RUNNING };
  }

  function success(caja: Caja): InfoCajaActionTypes {
    return { type: InfoCajaAction.CREATE_BOX_SUCCESS, caja };
  }

  function failure(): InfoCajaActionTypes {
    return { type: InfoCajaAction.CREATE_BOX_FAILURE };
  }
};
 */
