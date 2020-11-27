import { message } from 'antd';
/*import axios, { AxiosRequestConfig } from 'axios';
import { Message } from 'src/constants/messages';
import { RequestOptions } from 'src/interfaces';

import { CacheMemory } from 'src/utils/cache';
import { hashCode } from 'src/utils/string';
import { ThunkResult } from '..';
import { InfoSesion, SesionAction, SesionActionTypes, SesionState } from './types';

type SesionBodyRequest = InfoSesion;

interface SesionBodyResponse {
  descripcionSector: string;
  idSector: number;
  idUsuario: number;
  roles: { id: number; descripcion: string; nombre: string }[];
}

const cache: CacheMemory<InfoSesion> = new CacheMemory('Sesión');

export const getInfoSesion = (data: SesionBodyRequest, options?: RequestOptions): ThunkResult => async (dispatch, getState) => {
  if (!data) return;

  const { expiration, force } = options || {};

  const isRunning = getState().sesion.isRunning;

  if (isRunning) return;

  const apiId = API.INFO_SESION;
  const resourceId = 'infoSesion';
  const resourceData = getResourceData(apiId, resourceId);

  const { url } = resourceData;
  const { verb, path, timeout, headers } = resourceData.resource;

  const endpoint = `${url}/${path}`;

  const config: AxiosRequestConfig = {
    method: verb,
    url: endpoint,
    timeout,
    headers,
    data: { legajo: data.legajo },
  };

  const key = hashCode(config);

  // Validar si el resultado está cacheado.
  const value = cache.get(key);

  if (value && !force) {
    dispatch(success(value));
    return;
  }

  dispatch(running());

  // Consultar servicio.
  return await axios
    .request<SesionBodyResponse>(config)
    .then((response) => {
      const dataResponse = response.data;
      console.log(dataResponse);
      const infoSesion: InfoSesion = {
        ...data,
        idUsuario: dataResponse.idUsuario,
        idSector: dataResponse.idSector,
        nombreSector: dataResponse.descripcionSector,
        perfil: dataResponse.roles && dataResponse.roles.length > 0 ? dataResponse.roles[0].descripcion : undefined,
      };

      // Guardar en caché.
      cache.save(key, infoSesion, expiration);
      dispatch(success(infoSesion));
    })
    .catch((error) => {
      console.log(error);
      dispatch(failure());
    });

  function running(): SesionActionTypes {
    return { type: SesionAction.RUNNING };
  }

  function success(infoSesion: InfoSesion): SesionActionTypes {
    return { type: SesionAction.GET_DATA_SUCCESS, infoSesion };
  }

  function failure(): SesionActionTypes {
    message.error(Message.GET_DATA_FAILURE);
    return { type: SesionAction.GET_DATA_FAILURE };
  }
};
 */
