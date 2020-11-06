import axios, { AxiosRequestConfig } from 'axios';
import { ThunkResult } from 'src/actions';

import { API } from 'src/services/apis-data';
import { getAPIData } from 'src/utils/api';
import { hashCode } from 'src/utils/string';
import { InfoCajaAction, InfoCajaState, InfoCajaActionTypes } from '../caja-info';
import { Caja, InfoCaja, ContenidoCaja } from '../interfaces';

export const saveCaja = (info: InfoCajaState['info']): ThunkResult => async (dispatch, getState) => {
  const isRunning = getState().cajas.info.isRunning;

  if (isRunning || !info) return;

  const apiName = API.CAJA;
  const idMethod = 'guardarCaja';
  const api = getAPIData(apiName, idMethod);

  const { url } = api;
  const { verb, path, headers } = api.method;

  const endpoint = `${url}/${path}`;

  const dataRequest: InfoCaja = {
    ...info,
    /* fechaDocumentacionDesde: info.fechaDocumentacionDesde.format('YYYY-MM-DD'),
    fechaDocumentacionHasta: info.fechaDocumentacionHasta.format('YYYY-MM-DD HH:mm:ss.SSS'),
    fechaGeneracion: info.fechaGeneracion.format('YYYY-MM-DD'),
    fechaVencimiento: info.fechaVencimiento.format('YYYY-MM-DD'),*/
  };

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: dataRequest };

  const index = hashCode(config);

  /*if (reqCache.cache[index]) {
    console.log('Cached tipoCaja!!!');
    const cachedData = reqCache.cache[index].data;
    dispatch(success(cachedData));
    return;
  }*/

  dispatch(running(true));

  return await axios
    .request<Caja>(config)
    .then((response) => {
      console.log(response);
      const idCaja = response.data.id;
      const infoCaja = info;

      const caja: Caja = { id: idCaja, info: infoCaja, contenido: [] };

      //  reqCache.cache[index] = { data: caja };

      dispatch(success(caja));
    })
    .catch((error) => {
      dispatch(failure());
    });

  function running(isRunning: InfoCajaState['isRunning']): InfoCajaActionTypes {
    return { type: InfoCajaAction.RUNNING_INFO, isRunning };
  }

  function success(data: Caja): InfoCajaActionTypes {
    return { type: InfoCajaAction.CREATE_BOX_SUCCESS, caja: data }; // # Ver con Pablo. Debe retornar la caja completa y no solo el ID.
  }

  function failure(): InfoCajaActionTypes {
    return { type: InfoCajaAction.CREATE_BOX_FAILURE };
  }
};

export const getCaja = (idCaja: Caja['id']): ThunkResult => async (dispatch, getState) => {
  if (!idCaja) return;

  const isRunning = getState().cajas.info.isRunning;

  if (isRunning) return;

  const apiName = API.CAJA;
  const idMethod = 'infoCaja';
  const api = getAPIData(apiName, idMethod);

  const { url } = api;
  const { verb, path, headers } = api.method;

  const endpoint = `${url}/${path}`;

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: { idCaja } };

  const index = hashCode(config);

  /* if (reqCache.cache[index]) {
    console.log('Cached tipoCaja!!!');
    const cachedData = reqCache.cache[index].data;
    dispatch(success(cachedData));
    return;
  }*/

  dispatch(running(true));

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

  function running(isRunning: InfoCajaState['isRunning']): InfoCajaActionTypes {
    return { type: InfoCajaAction.RUNNING_INFO, isRunning };
  }

  function success(caja: Caja): InfoCajaActionTypes {
    return { type: InfoCajaAction.CREATE_BOX_SUCCESS, caja };
  }

  function failure(): InfoCajaActionTypes {
    return { type: InfoCajaAction.CREATE_BOX_FAILURE };
  }
};
