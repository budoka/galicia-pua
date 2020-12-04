import { buildBaseURL } from 'src/utils/api';
import { APIList } from './types';

// Ejemplo para consumir una API
// const { baseURL, resources } = apis['CAJA'];
// const { verb, path, headers } = resources['PREVIEW'];

export const apis: APIList = {
  CAJA: {
    baseURL: buildBaseURL('CAJA'),
    resources: {
      DETALLE_CAJA: { verb: 'POST', path: 'detalleCaja' },
      PREVIEW: { verb: 'POST', path: 'v2/preview' },
      GUARDAR_CAJA: { verb: 'POST', path: 'v2/guardarCaja' },
      MODIFICAR_CAJA: { verb: 'POST', path: 'modificarCaja' },
      CERRAR_CAJA: { verb: 'POST', path: 'cerrarCaja' },
      ELIMINAR_CAJA: { verb: 'DELETE', path: 'eliminarCaja' },
      INFO_CAJA: { verb: 'POST', path: 'infoCaja' },
      CANTIDAD_CAJAS: { verb: 'POST', path: 'cantidadCajas' },
    },
  },
  DOCUMENTO: {
    baseURL: buildBaseURL('DOCUMENTO'),
    resources: {
      GUARDAR_DOCUMENTO: { verb: 'POST', path: 'guardarDocumento' },
      DETALLE_DOCUMENTO: { verb: 'POST', path: 'detalleDocumento' },
      CANTIDAD_DOCUMENTOS: { verb: 'GET', path: 'cantidadDeDocumentos' },
    },
  },
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
  PEDIDOS_PENDIENTES: {
    baseURL: buildBaseURL('PEDIDOS_PENDIENTES'),
    resources: {
      PEDIDOS_PENDIENTES: { verb: 'POST', path: 'pedidosPendientes' },
      CANTIDAD_PEDIDOS: { verb: 'POST', path: 'cantidadPedidos' },
    },
  },
  CONSULTA_SOLICITUDES: {
    baseURL: buildBaseURL('CONSULTA_SOLICITUDES'),
    resources: {
      CONSULTA_SOLICITUDES: { verb: 'POST', path: 'consultaSolicitudes' },
      TOTAL_SOLICITUDES: { verb: 'POST', path: 'totalSolicitudes' },
    },
  },
};
