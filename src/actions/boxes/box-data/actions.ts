import axios, { AxiosRequestConfig } from 'axios';
import { ThunkResult } from 'src/actions';
import { IRequestCache } from 'src/actions/interfaces';
import { API } from 'src/services/api-data';
import { getAPIData } from 'src/utils/api';
import { hashCode } from 'src/utils/string';
import { BoxData, BoxDataActionTypes, BoxDataState } from '../box-data';
import { Box, BoxAPIResponse, BoxInfoAPIRequest } from './interfaces';

const reqCache: IRequestCache<any> = { cache: {} };

export const saveBox = (data: BoxDataState['info']): ThunkResult => async (dispatch, getState) => {
  const isRunning = getState().boxes.filters.isRunning;

  if (isRunning || !data) return;

  const apiName = API.CAJA;
  const idMethod = 'guardarCaja';
  const api = getAPIData(apiName, idMethod);

  const { url } = api;
  const { verb, path, headers } = api.method;

  const endpoint = `${url}/${path}`;

  const dataRequest: BoxInfoAPIRequest = {
    descripcion: data.description,
    fechaDesde: data.fromDate.format('YYYY-MM-DD'),
    fechaHasta: data.toDate.format('YYYY-MM-DD HH:mm:ss.SSS'),
    fechaGeneracion: data.creationDate.format('YYYY-MM-DD'),
    fechaVencimiento: data.expirationDate.format('YYYY-MM-DD'),
    idPlantilla: data.templateId,
    idSectorOrigen: data.sectorId,
    idTipoCaja: data.boxTypeId,
    idUsuarioAlta: data.userId,
    restringida: data.restricted,
    tipoContenido: data.contentTypeName,
  };

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: dataRequest };

  const index = hashCode(config);

  if (reqCache.cache[index]) {
    console.log('Cached tipoCaja!!!');
    const cachedData = reqCache.cache[index].data;
    dispatch(success(cachedData));
    return;
  }

  dispatch(running(true));

  return await axios
    .request<BoxAPIResponse>(config)
    .then((response) => {
      console.log(response);
      const boxId = response.data.numero;
      const boxInfo = data;

      const box: Box = { id: boxId, info: boxInfo, content: [] };

      reqCache.cache[index] = { data: box };

      dispatch(success(box));
    })
    .catch((error) => {
      dispatch(failure());
    });

  function running(running: BoxDataState['isRunning']): BoxDataActionTypes {
    return { type: BoxData.RUNNING, payload: running };
  }

  function success(data: Box): BoxDataActionTypes {
    return { type: BoxData.CREATE_BOX_SUCCESS, payload: data }; // # Ver con Pablo. Debe retornar la caja completa y no solo el ID.
  }

  function failure(): BoxDataActionTypes {
    return { type: BoxData.CREATE_BOX_FAILURE };
  }
};
/*
export const getBox = (boxId: IBoxData['id']): ThunkResult => async (dispatch, getState) => {
  if (!boxId) return;

  const isRunning = getState().boxes.filters.isRunning;

  if (isRunning) return;

  const apiName = API.CAJA;
  const idMethod = 'infoCaja';
  const api = getAPIData(apiName, idMethod);

  const { url } = api;
  const { verb, path, headers } = api.method;

  const endpoint = `${url}/${path}`;

  const dataRequest: BoxAPIRequest = {
    idCaja: boxId,
  };

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: dataRequest };

  const index = hashCode(config);

  if (reqCache.cache[index]) {
    console.log('Cached tipoCaja!!!');
    const cachedData = reqCache.cache[index].data;
    dispatch(success(cachedData));
    return;
  }

  dispatch(running(true));

  return await axios.request<BoxAPIResponse>(config)
    .then((response) => {
      const boxId = response.data;

      reqCache.cache[index] = { data: boxId };

      //    const box = { numero: boxId,  } as BoxAPIResponse;

      //   dispatch(success(box));
    })
    .catch((error) => {
      dispatch(failure());
    });

  function running(running: BoxDataState['isRunning']): BoxDataActionTypes {
    return { type: BoxData.RUNNING, payload: running };
  }

  function success(data: IBoxData): BoxDataActionTypes {
    return { type: BoxData.CREATE_BOX_SUCCESS, payload: data };
  }

  function failure(): BoxDataActionTypes {
    return { type: BoxData.CREATE_BOX_FAILURE };
  }
};
*/
