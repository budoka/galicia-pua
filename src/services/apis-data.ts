
import { buildAPIUrl, IAPI } from 'src/utils/api';

export enum API {
  CAJA = 'CAJA',
  DOCUMENTO = 'DOCUMENTO',
  ETIQUETAS_CAJA = 'ETIQUETAS_CAJA',
  PLANTILLAS_SECTOR = 'PLANTILLAS_SECTOR',
  TIPO_CAJA = 'TIPO_CAJA',
}

export const apis: IAPI[] = [
  {
    name: API.CAJA,
    url: buildAPIUrl(API.CAJA),
    method: [
      {
        id: 'preview',
        verb: 'POST',
        path: 'preview',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          useQueryString: true,
        },
        data: {},
      },
      {
        id: 'guardarCaja',
        verb: 'POST',
        path: 'guardarCaja',
        headers: {
          accept: 'application/json',
          useQueryString: true,
        },
      },
      {
        id: 'cerrarCaja',
        verb: 'POST',
        path: 'cerrarCaja',
        headers: {
          accept: 'application/json',
          useQueryString: true,
        },
      },
      {
        id: 'eliminarCaja',
        verb: 'DELETE',
        path: 'eliminarCaja',
        headers: {
          accept: 'application/json',
          useQueryString: true,
        },
      },
      {
        id: 'infoCaja',
        verb: 'POST',
        path: 'infoCaja',
        headers: {
          accept: 'application/json',
          useQueryString: true,
        },
      },
    ],
  },
  {
    name: API.DOCUMENTO,
    url: buildAPIUrl(API.DOCUMENTO),
    method: [
      {
        id: 'guardarDocumento',
        verb: 'POST',
        path: 'guardarDocumento',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          useQueryString: true,
        },
        data: {},
      },
    ],
  },
  {
    name: API.PLANTILLAS_SECTOR,
    url: buildAPIUrl(API.PLANTILLAS_SECTOR),
    method: [
      {
        id: 'plantillasPorSector',
        verb: 'POST',
        path: 'plantillasPorSector',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          useQueryString: true,
        },
        data: {},
      },
    ],
  },
  {
    name: API.TIPO_CAJA,
    url: buildAPIUrl(API.TIPO_CAJA),
    method: [
      {
        id: 'tipoCaja',
        verb: 'GET',
        path: 'tipoCaja',
        headers: {
          accept: 'application/json',
          useQueryString: true,
        },
      },
      {
        id: 'tipoDeContenido',
        verb: 'POST',
        path: 'tipoDeContenido',
        headers: {
          accept: 'application/json',
          useQueryString: true,
        },
      },
    ],
  },
];
