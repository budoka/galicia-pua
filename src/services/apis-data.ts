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
    methods: [
      {
        id: 'detalleCaja',
        verb: 'POST',
        path: 'detalleCaja',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        data: {},
      },
      {
        id: 'preview',
        verb: 'POST',
        path: 'preview',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        data: {},
      },
      {
        id: 'guardarCaja',
        verb: 'POST',
        path: 'guardarCaja',
        headers: {
          accept: 'application/json',
        },
      },
      {
        id: 'cerrarCaja',
        verb: 'POST',
        path: 'cerrarCaja',
        headers: {
          accept: 'application/json',
        },
      },
      {
        id: 'eliminarCaja',
        verb: 'DELETE',
        path: 'eliminarCaja',
        headers: {
          accept: 'application/json',
        },
      },
      {
        id: 'infoCaja',
        verb: 'POST',
        path: 'infoCaja',
        headers: {
          accept: 'application/json',
        },
      },
    ],
  },
  {
    name: API.DOCUMENTO,
    url: buildAPIUrl(API.DOCUMENTO),
    methods: [
      {
        id: 'guardarDocumento',
        verb: 'POST',
        path: 'guardarDocumento',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        data: {},
      },
    ],
  },
  {
    name: API.PLANTILLAS_SECTOR,
    url: buildAPIUrl(API.PLANTILLAS_SECTOR),
    methods: [
      {
        id: 'plantillasPorSector',
        verb: 'POST',
        path: 'plantillasPorSector',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        data: {},
      },
    ],
  },
  {
    name: API.TIPO_CAJA,
    url: buildAPIUrl(API.TIPO_CAJA),
    methods: [
      {
        id: 'tipoCaja',
        verb: 'GET',
        path: 'tipoCaja',
        headers: {
          accept: 'application/json',
        },
      },
      {
        id: 'tipoDeContenido',
        verb: 'POST',
        path: 'tipoDeContenido',
        headers: {
          accept: 'application/json',
        },
      },
    ],
  },
];
