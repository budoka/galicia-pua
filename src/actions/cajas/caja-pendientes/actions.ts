import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';
import { ThunkResult } from 'src/actions';
import { API } from 'src/services/apis-data';
import { getAPIData } from 'src/utils/api';
import { CacheMemory } from 'src/utils/cache';
import { hashCode } from 'src/utils/string';
import { InfoCajaAction, InfoCajaState, InfoCajaActionTypes } from '../caja-info';
import { Caja, InfoCaja, ContenidoCaja } from '../interfaces';
import { CajasPendientes, CajasPendientesAction, CajasPendientesActionTypes, CajasPendientesState, DetalleCaja } from './types';

interface CajasPendientesBodyRequest {
  idUsuario: number;
  centroCosto: number;
  roles: string[];
  estado: string;
}

interface DetalleCajaBodyResponse {
  numero: number;
  descripcion: string;
  estado: string;
  fechaEmision: string;
  sector: number;
  usuario: string;
}

type CajasPendientesBodyResponse = DetalleCajaBodyResponse[];

const cache: CacheMemory<CajasPendientes> = new CacheMemory('Cajas Pendientes');

console.log(cache);

export const getCajasPendientes = (data: CajasPendientesBodyRequest, expiration?: number): ThunkResult => async (dispatch, getState) => {
  if (!data) return;

  const isRunning = getState().cajas.pendientes.isRunning;

  if (isRunning) return;

  const apiName = API.CAJA;
  const idMethod = 'detalleCaja';
  const api = getAPIData(apiName, idMethod);

  const { url } = api;
  const { verb, path, headers } = api.method;

  const endpoint = `${url}/${path}`;

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data };

  const key = hashCode(config);

  // Validar si el resultado está cacheado.
  if (!cache.isKeyInvalidOrExpired(key)) {
    dispatch(success(cache.get(key)!));
    return;
  }

  dispatch(running(true));

  // Consultar servicio.
  return await axios
    .request<CajasPendientesBodyResponse>(config)
    .then((response) => {
      const cajas: CajasPendientes = {
        detallesCaja: response.data.map((caja) => {
          return {
            numero: caja.numero,
            descripcion: caja.descripcion,
            estado: caja.estado,
            fechaEmision: moment(caja.fechaEmision).format('DD/MM/YYYY'),
            sector: caja.sector,
            usuario: caja.usuario,
          } as DetalleCaja;
        }),
      };

      // Guardar en caché.
      cache.save(key, cajas, expiration);
      dispatch(success(cajas));
    })
    .catch((error) => {
      console.log(error);
      dispatch(failure());
    });

  function running(isRunning: CajasPendientesState['isRunning']): CajasPendientesActionTypes {
    return { type: CajasPendientesAction.RUNNING, isRunning };
  }

  function success(cajas: CajasPendientes): CajasPendientesActionTypes {
    return { type: CajasPendientesAction.GET_SUCCESS, detallesCaja: cajas.detallesCaja };
  }

  function failure(): CajasPendientesActionTypes {
    return { type: CajasPendientesAction.GET_FAILURE };
  }
};
