import axios, { AxiosRequestConfig } from 'axios';
import { ThunkResult } from 'src/actions';

import { API } from 'src/services/apis-data';
import { getResourceData } from 'src/utils/api';
import { goTo } from 'src/utils/history';
import { hashCode } from 'src/utils/string';
import { InfoCajaAction, InfoCajaState, InfoCajaActionTypes } from '../caja-info';
import { Caja, InfoCaja, ContenidoCaja, GuardarCajaBodyRequest } from '../interfaces';

export const saveCaja = (data: GuardarCajaBodyRequest): ThunkResult => async (dispatch, getState) => {
  const isRunning = getState().cajas.info.isRunning;

  if (isRunning || !data) return;

  const apiName = API.CAJA;
  const idMethod = 'guardarCaja';
  const api = getResourceData(apiName, idMethod);

  const { url } = api;
  const { verb, path, headers } = api.resource;

  const endpoint = `${url}/${path}`;

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data };

  const index = hashCode(config);

  /*if (reqCache.cache[index]) {
    console.log('Cached tipoCaja!!!');
    const cachedData = reqCache.cache[index].data;
    dispatch(success(cachedData));
    return;
  }*/

  dispatch(running());

  return await axios
    .request(/* <Caja> */ config)
    .then((response) => {
      console.log(response);
      // No se usa
      const idCaja = response.data.id;
      const infoCaja = response.data.info;
      const caja: Caja = { id: idCaja, info: infoCaja, contenido: [] };
      //  reqCache.cache[index] = { data: caja };
      // EOF - No se usa

      goTo(`/editar-caja/${response.data.numero}`);

      dispatch(success(caja));
    })
    .catch((error) => {
      dispatch(failure());
    });

  function running(): InfoCajaActionTypes {
    return { type: InfoCajaAction.RUNNING };
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
  const api = getResourceData(apiName, idMethod);

  const { url } = api;
  const { verb, path, headers } = api.resource;

  const endpoint = `${url}/${path}`;

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: { idCaja } };

  const index = hashCode(config);

  /* if (reqCache.cache[index]) {
    console.log('Cached tipoCaja!!!');
    const cachedData = reqCache.cache[index].data;
    dispatch(success(cachedData));
    return;
  }*/

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
