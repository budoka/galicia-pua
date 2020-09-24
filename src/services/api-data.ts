import { IAPI } from 'src/interfaces';
import { getVar } from 'src/utils/environment';

export enum API {
  TIPO_CAJA = 'tipoCaja',
  CAJA = 'caja',
}

export const apis: IAPI[] = [
  {
    name: 'tipoCaja',
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
        verb: 'GET',
        path: 'tipoDeContenido',
        headers: {
          accept: 'application/json',
          useQueryString: true,
        },
      },
    ],
  },
  {
    name: 'caja',
    url: getVar('CAJA_API_URL'),
    method: [
      {
        id: 'preview', // url/api/preview
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
        id: 'infoCaja',
        verb: 'GET',
        path: 'infoCaja',
        headers: {
          accept: 'application/json',
          useQueryString: true,
        },
      },
    ],
  },
];
