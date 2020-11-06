import axios, { AxiosRequestConfig } from 'axios';
import { ObjectLiteral, QueryParams } from 'src/interfaces';
import { ThunkResult } from 'src/actions';
import { PreviewCajaAction, PreviewCajaActionTypes, PreviewCajaState } from './types';
import { API, apis } from 'src/services/apis-data';
import { getAPIData } from 'src/utils/api';

import { FiltrosCajaState } from '../caja-filtros';
import { hashCode } from 'src/utils/string';
//import { IRequestCache } from 'src/actions/interfaces';
import {
  PreviewCajaRequest,
  PreviewCajaResponse,
  PreviewCajaDocumentoResponse,
  PreviewCajaDetalleResponse,
  PreviewCajaEtiquetaResponse,
} from './interfaces';
import _ from 'lodash';

/*
Example ...
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
})*/

//const reqCache: IRequestCache<any> = { cache: {} };

export const getPreviewCaja = (filtrosSeleccionados: FiltrosCajaState['seleccionado']): ThunkResult => async (dispatch, getState) => {
  const state = getState();
  const isRunning = state.cajas.preview.isRunning;

  if (isRunning) return;

  const apiName = API.CAJA;
  const idMethod = 'preview';
  const api = getAPIData(apiName, idMethod);

  const { url } = api;
  const { verb, path, headers } = api.method;

  const endpoint = `${url}/${path}`;

  const dataRequest: PreviewCajaRequest = {
    idCaja: +filtrosSeleccionados.tipoCaja?.id!,
    tipoContenido: filtrosSeleccionados.tipoContenidoCaja?.id! as string, // Se debe cambiar por number
    idPlantilla: +filtrosSeleccionados.tipoPlantilla?.id!,
  };

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: dataRequest };

  const index = hashCode(config);

  /*if (reqCache.cache[index]) {
    console.log('Cached preview!!!');
    const cachedData = reqCache.cache[index].data;
    dispatch(success(cachedData));
    return;
  }*/

  dispatch(running(true));

  return await axios
    .request<PreviewCajaResponse>(config)
    .then((response) => {
      let id = -1;

      // Type Guards # Cuando las response devuelvan el tipoContenido y idPlanilla, se debería corregir.
      if (!Array.isArray(response.data)) throw new Error('Unexpected response !!');

      if ('inclusiones' in response.data[0]) {
        const previewDocumento: PreviewCajaDocumentoResponse[] = response.data as PreviewCajaDocumentoResponse[];

        // reqCache.cache[index] = { data: previewDocumento };

        dispatch(success(previewDocumento));
      } else if ('idPlantilla' in response.data[0]) {
        const previewDetalle: PreviewCajaDetalleResponse[] = response.data as PreviewCajaDetalleResponse[];

        //  reqCache.cache[index] = { data: previewDetalle };

        dispatch(success(previewDetalle));
      } else if ('legacy' in response.data[0]) {
        const previewEtiqueta: PreviewCajaEtiquetaResponse[] = response.data as PreviewCajaEtiquetaResponse[];

        //   reqCache.cache[index] = { data: previewEtiqueta };

        dispatch(success(previewEtiqueta));
      } else {
        throw new Error('Unexpected result !!');
      }
    })
    .catch((error) => {
      console.log('response error');
      dispatch(failure());
    });

  function running(running: PreviewCajaState['isRunning']): PreviewCajaActionTypes {
    return { type: PreviewCajaAction.RUNNING_PREVIEW, payload: running };
  }

  function success(preview: PreviewCajaState['preview']): PreviewCajaActionTypes {
    console.log('preview');
    console.log(preview);
    return { type: PreviewCajaAction.GET_SUCCESS, preview };
  }

  function failure(): PreviewCajaActionTypes {
    return { type: PreviewCajaAction.GET_FAILURE };
  }
};

export const clearPreviewCaja = (): ThunkResult => (dispatch, getState) => {
  dispatch(success());

  function success(): PreviewCajaActionTypes {
    return { type: PreviewCajaAction.CLEAR };
  }
};
