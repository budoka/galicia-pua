import { buildBaseURL } from 'src/utils/api';
import { APIs } from './types';

// Ejemplo para consumir una API
// const { baseURL, resources } = apis['CAJA'];
// const { verb, path, headers } = resources['PREVIEW'];

export const apis: APIs = {
  CAJA: {
    baseURL: buildBaseURL('CAJA'),
    resources: {
      DETALLE_CAJA: { verb: 'POST', path: 'detalleCaja' },
      PREVIEW: { verb: 'POST', path: 'v2/preview' },
      GUARDAR_CAJA: { verb: 'POST', path: 'guardarCaja' },
      CERRAR_CAJA: { verb: 'POST', path: 'cerrarCaja' },
      ELIMINAR_CAJA: { verb: 'DELETE', path: 'eliminarCaja' },
      INFO_CAJA: { verb: 'POST', path: 'infoCaja' },
    },
  },
  DOCUMENTO: { baseURL: buildBaseURL('DOCUMENTO'), resources: { GUARDAR_DOCUMENTO: { verb: 'POST', path: 'guardarDocumento' } } },
  ETIQUETAS_CAJA: {
    baseURL: buildBaseURL('ETIQUETAS_CAJA'),
    resources: {},
  },
  INFO_SESION: { baseURL: buildBaseURL('INFO_SESION'), resources: { INFO_SESION: { verb: 'POST', path: 'infoSesion' } } },
  PLANTILLAS_SECTOR: {
    baseURL: buildBaseURL('PLANTILLAS_SECTOR'),
    resources: { PLANTILLAS_SECTOR: { verb: 'POST', path: 'plantillasPorSector' } },
  },
  TIPO_CAJA: {
    baseURL: buildBaseURL('TIPO_CAJA'),
    resources: {
      TIPO_CAJA: { verb: 'GET', path: 'tipoCaja' },
      TIPO_CONTENIDO: { verb: 'POST', path: 'tipoDeContenido' },
      VENCIMIENTO_CAJA: { verb: 'POST', path: 'vencimientoCaja' },
    },
  },
};
