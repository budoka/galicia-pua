import { buildAPIUrl, IAPI } from 'src/utils/api';

export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ResourceAPI {
  verb: HttpVerb;
  path: string;
  params?: {
    [params: string]: string | number | boolean;
  };
  query?: {
    [query: string]: string | number | boolean;
  };
  headers?: {
    [header: string]: string | number | boolean;
  };
  data?: {
    [data: string]: string | number | boolean;
  };
  timeout?: number;
}

export interface AvailableAPIS {
  CAJA: {
    POST_ADD: ResourceAPI;
    GET_ADD: ResourceAPI;
  };
  CAJA2: {
    DELETE_REMOVE: ResourceAPI;
  };
}

const apisx: AvailableAPIS = {
  CAJA: {
    POST_ADD: {
      verb: 'POST',
      path: '/add',
    },
    GET_ADD: {
      verb: 'GET',
      path: '/all',
    },
  },
  CAJA2: {
    DELETE_REMOVE: {
      verb: 'DELETE',
      path: '/remove',
    },
  },
};

//apisx.CAJA.GET_ADD.data
//apis.find(a => a.name === API.CAJA)?.resources.find(r => r.id === 'detalle')?.data;
type APIz = { api: string; resources: ResourceAPI[] };

let map = new Map<string, ResourceAPI[]>();

let key = new Object();

map.set('CAJA', [
  {
    verb: 'DELETE',
    path: '/remove',
  },
]);
map.get('CAJA');

export enum API {
  CAJA = 'CAJA',
  DOCUMENTO = 'DOCUMENTO',
  ETIQUETAS_CAJA = 'ETIQUETAS_CAJA',
  PLANTILLAS_SECTOR = 'PLANTILLAS_SECTOR',
  TIPO_CAJA = 'TIPO_CAJA',
  INFO_SESION = 'INFO_SESION',
}

export const apis: IAPI[] = [
  {
    name: API.CAJA,
    url: buildAPIUrl(API.CAJA),
    resources: [
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
      },
      {
        id: 'guardarCaja',
        verb: 'POST',
        path: 'guardarCaja',
      },
      {
        id: 'cerrarCaja',
        verb: 'POST',
        path: 'cerrarCaja',
      },
      {
        id: 'eliminarCaja',
        verb: 'DELETE',
        path: 'eliminarCaja',
      },
      {
        id: 'infoCaja',
        verb: 'POST',
        path: 'infoCaja',
      },
    ],
  },
  {
    name: API.DOCUMENTO,
    url: buildAPIUrl(API.DOCUMENTO),
    resources: [
      {
        id: 'guardarDocumento',
        verb: 'POST',
        path: 'guardarDocumento',
      },
    ],
  },
  {
    name: API.PLANTILLAS_SECTOR,
    url: buildAPIUrl(API.PLANTILLAS_SECTOR),
    resources: [
      {
        id: 'plantillasPorSector',
        verb: 'POST',
        path: 'plantillasPorSector',
      },
    ],
  },
  {
    name: API.TIPO_CAJA,
    url: buildAPIUrl(API.TIPO_CAJA),
    resources: [
      {
        id: 'tipoCaja',
        verb: 'GET',
        path: 'tipoCaja',
      },
      {
        id: 'tipoDeContenido',
        verb: 'POST',
        path: 'tipoDeContenido',
      },
    ],
  },
  {
    name: API.INFO_SESION,
    url: buildAPIUrl(API.INFO_SESION),
    resources: [
      {
        id: 'infoSesion',
        verb: 'POST',
        path: 'infoSesion',
      },
    ],
  },
];
