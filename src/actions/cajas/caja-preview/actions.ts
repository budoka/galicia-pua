import axios, { AxiosRequestConfig } from 'axios';
/*
import { ObjectLiteral, QueryParams } from 'src/interfaces';
import { ThunkResult } from 'src/actions';
import { PreviewCajaAction, PreviewCajaActionTypes, PreviewCajaState } from './types';


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

export const getPreviewCaja = (filtrosSeleccionados: FiltrosCajaState['seleccionado']): ThunkResult => async (dispatch, getState) => {
  const state = getState();
  const isRunning = state.cajas.preview.isRunning;

  if (isRunning) return;

  const apiId = API.CAJA;
  const resourceId = 'preview';
  const resourceData = getResourceData(apiId, resourceId);

  const { url } = resourceData;
  const { verb, path, headers } = resourceData.resource;

  const endpoint = `${url}/${path}`;

  const dataRequest: PreviewCajaRequest = {
    idTipoCaja: +filtrosSeleccionados.tipoCaja?.id!,
    idTipoContenido: +filtrosSeleccionados.tipoContenido?.id!,
    idPlantilla: +filtrosSeleccionados.tipoPlantilla?.id!,
  };

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: dataRequest };

  const index = hashCode(config);


  dispatch(running());

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

  function running(): PreviewCajaActionTypes {
    return { type: PreviewCajaAction.RUNNING };
  }

  function success(preview: PreviewCajaState['preview']): PreviewCajaActionTypes {

    return { type: PreviewCajaAction.GET_DATA_SUCCESS, preview };
  }

  function failure(): PreviewCajaActionTypes {
    return { type: PreviewCajaAction.GET_DATA_FAILURE };
  }
};

export const clearPreviewCaja = (): ThunkResult => (dispatch, getState) => {
  dispatch(success());

  function success(): PreviewCajaActionTypes {
    return { type: PreviewCajaAction.CLEAR };
  }
};
 */
