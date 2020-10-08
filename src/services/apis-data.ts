import { IAPI } from 'src/interfaces';
import { getVar } from 'src/utils/environment';

export enum API {
  TIPO_CAJA = 'tipoCaja',
  CAJA = 'caja',
  PLANTILLAS = 'plantillas',
  DOCUMENTO = 'documento',
}

export const apis: IAPI[] = [
  {
    name: API.TIPO_CAJA,
    url: getVar('TIPO_CAJA_API_URL'),
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
  {
    name: API.CAJA,
    url: getVar('CAJA_API_URL'),
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
    name: API.PLANTILLAS,
    url: getVar('PLANTILLAS_API_URL'),
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
    name: API.DOCUMENTO,
    url: getVar('DOCUMENTO_API_URL'),
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
];
