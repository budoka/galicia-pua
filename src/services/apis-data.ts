import { buildBaseURL } from 'src/utils/api';

export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface IAPI {
  id: string;
  baseURL: string;
  resources: ResourceAPI[];
}

export interface ResourceAPI {
  id: string;
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
    id: API.CAJA,
    baseURL: buildBaseURL(API.CAJA),
    resources: [
      {
        id: 'detalleCaja',
        verb: 'POST',
        path: 'detalleCaja',
      },
      {
        id: 'preview',
        verb: 'POST',
        path: 'v2/preview',
      },
      {
        id: 'guardarCaja',
        verb: 'POST',
        path: 'v2/guardarCaja',
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
    id: API.DOCUMENTO,
    baseURL: buildBaseURL(API.DOCUMENTO),
    resources: [
      {
        id: 'guardarDocumento',
        verb: 'POST',
        path: 'guardarDocumento',
      },
    ],
  },
  {
    id: API.PLANTILLAS_SECTOR,
    baseURL: buildBaseURL(API.PLANTILLAS_SECTOR),
    resources: [
      {
        id: 'plantillasPorSector',
        verb: 'POST',
        path: 'plantillasPorSector',
      },
    ],
  },
  {
    id: API.TIPO_CAJA,
    baseURL: buildBaseURL(API.TIPO_CAJA),
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
    id: API.INFO_SESION,
    baseURL: buildBaseURL(API.INFO_SESION),
    resources: [
      {
        id: 'infoSesion',
        verb: 'POST',
        path: 'infoSesion',
      },
    ],
  },
];
