import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import { ThunkResult } from 'src/actions';
import { IRequestCache } from 'src/actions/interfaces';
import { API } from 'src/services/api-data';
import { getAPIData } from 'src/utils/api';
import { hashCode } from 'src/utils/string';
import { BoxData, BoxDataActionTypes, BoxDataState } from '../box-data';

import { BoxDetailAPIRequest } from './interfaces';

const reqCache: IRequestCache<any> = { cache: {} };

export const saveBox = (data: BoxDataState['info']): ThunkResult => async (dispatch, getState) => {
  const isRunning = getState().boxes.filters.isRunning;

  if (isRunning) return;

  const apiName = API.CAJA;
  const idMethod = 'guardarCaja';
  const api = getAPIData(apiName, idMethod);

  const { url } = api;
  const { verb, path, headers } = api.method;

  const endpoint = `${url}/${path}`;

  const dataParsed: BoxDetailAPIRequest = {
    idUsuarioAlta: +data.userId!,
    idSectorOrigen: +data.sectorId!,
    idTipoCaja: +data.boxTypeId!,
    idPlantilla: +data.templateId!,
    tipoContenido: data.contentType!.toString(),
    descripcion: data.description!.toString(),
    fechaDesde: data.fromDate!.toString(),
    fechaHasta: data.toDate!.toString(),
    fechaGeneracion: data.creationDate!.toString(),
    fechaVencimiento: data.expirationDate!.toString(),
    restringida: +data.restricted!,
  };

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: dataParsed };

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
      const boxId = response.data;

      reqCache.cache[index] = { data: boxId };

      // const box = {id: boxId, ...data}

      dispatch(success(boxId));
    })
    .catch((error) => {
      dispatch(failure());
    });

  function running(fetch: BoxDataState['isRunning']): BoxDataActionTypes {
    return { type: BoxData.RUNNING, payload: fetch };
  }

  function success(id: BoxDataState['info']['id']): BoxDataActionTypes {
    return { type: BoxData.CREATE_BOX_SUCCESS, payload: id };
  }

  function failure(): BoxDataActionTypes {
    return { type: BoxData.CREATE_BOX_FAILURE };
  }
};
