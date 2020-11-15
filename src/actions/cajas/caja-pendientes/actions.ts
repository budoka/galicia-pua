import { message } from 'antd';
import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';
import { ThunkResult } from 'src/actions';
import { Message } from 'src/constants/messages';
import { RequestOptions } from 'src/interfaces';
import { API } from 'src/services/apis-data';
import { getAPIData } from 'src/utils/api';
import { CacheMemory } from 'src/utils/cache';
import { hashCode, splitStringByWords } from 'src/utils/string';
import { InfoCajaAction, InfoCajaState, InfoCajaActionTypes } from '../caja-info';
import { Caja, InfoCaja, ContenidoCaja } from '../interfaces';
import { CajasPendientes, CajasPendientesAction, CajasPendientesActionTypes, CajasPendientesState, DetalleCaja } from './types';

interface CajasPendientesBodyRequest {
  idUsuario: number; // sacar
  roles: string[]; // sacar
  estado?: string;
  centroCosto?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  nombre?: string;
  // numeroPagina: number;
  // volumenPagina: number;
  // contarTotal: boolean;
}

interface DetalleCajaBodyResponse {
  numero: number;
  estado: string;
  descripcion: string;
  fechaEmision: string;
  sector: number;
  usuario: string;
}

type CajasPendientesBodyResponse = DetalleCajaBodyResponse[];

const cache: CacheMemory<CajasPendientes> = new CacheMemory('Cajas Pendientes');

console.log(cache);

export const clearCajasPendientes = (): ThunkResult => (dispatch, getState) => {
  dispatch({ type: CajasPendientesAction.CLEAR_DATA });
};

export const getCajasPendientes = (data: CajasPendientesBodyRequest, options?: RequestOptions): ThunkResult => async (
  dispatch,
  getState,
) => {
  if (!data) return;

  const { expiration, force } = options || {};

  dispatch(clearCajasPendientes());

  const isRunning = getState().cajas.pendientes.isRunning;

  if (isRunning) return;

  const apiName = API.CAJA;
  const idMethod = 'detalleCaja';
  const api = getAPIData(apiName, idMethod);

  const { url } = api;
  const { verb, path, timeout, headers } = api.method;

  const endpoint = `${url}/${path}`;

  const config: AxiosRequestConfig = {
    method: verb,
    url: endpoint,
    timeout,
    headers,
    data,
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
    .request<CajasPendientesBodyResponse>(config)
    .then((response) => {
      const cajas: CajasPendientes = {
        detallesCaja: response.data.map((caja) => {
          return {
            numero: caja.numero,
            descripcion: caja.descripcion,
            estado: splitStringByWords(caja.estado)?.join(' '),
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

  function running(): CajasPendientesActionTypes {
    return { type: CajasPendientesAction.RUNNING };
  }

  function success(cajas: CajasPendientes): CajasPendientesActionTypes {
    return { type: CajasPendientesAction.GET_DATA_SUCCESS, detallesCaja: cajas.detallesCaja };
  }

  function failure(): CajasPendientesActionTypes {
    message.error(Message.GET_DATA_FAILURE);
    return { type: CajasPendientesAction.GET_DATA_FAILURE };
  }
};
