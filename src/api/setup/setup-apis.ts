import { buildBaseURL } from 'src/utils/api';
import { APIList } from './types';

// Ejemplo para consumir una API
// const { baseURL, resources } = apis['CAJA'];
// const { verb, path, headers } = resources['PREVIEW'];
export const apis: APIList = {
  CAJA: {
    baseURL: buildBaseURL('CAJA'),
    resources: {
      BUSCAR_CAJA: { path: 'buscarCaja', config: { verb: 'POST' } },
      CANTIDAD_CAJAS: { path: 'cantidadCajas', config: { verb: 'POST' } },
      CERRAR_CAJA: { path: 'cerrarCaja', config: { verb: 'POST' } },
      DETALLE_CAJA: { path: 'detalleCaja', config: { verb: 'POST' } },
      ELIMINAR_CAJA: { path: 'eliminarCaja', config: { verb: 'DELETE' } },
      GUARDAR_CAJA: { path: 'v2/guardarCaja', config: { verb: 'POST' } },
      INFO_CAJA: { path: 'infoCaja', config: { verb: 'POST' } },
      MODIFICAR_CAJA: { path: 'modificarCaja', config: { verb: 'POST' } },
      PREVIEW: { path: 'v2/preview', config: { verb: 'POST' } },
    },
  },
  CLIENTE_FILTRO: {
    baseURL: buildBaseURL('CLIENTE_FILTRO'),
    resources: { OBTENER_FILTROS: { path: 'obtenerFiltros', config: { verb: 'POST' } } },
  },
  CONSULTA_DOCUMENTO: {
    baseURL: buildBaseURL('CONSULTA_DOCUMENTO'),
    resources: {
      BUSCAR_DOCUMENTOS: { path: 'buscarDocumentos', config: { verb: 'POST' } },
      DETALLE_DOCUMENTO: { path: 'detalleDocumento', config: { verb: 'POST' } },
    },
  },
  CONSULTA_DOCUMENTO_CLIENTE: {
    baseURL: buildBaseURL('CONSULTA_DOCUMENTO_CLIENTE'),
    resources: {
      BUSCAR_DOCUMENTOS: { path: 'buscarDocumentosDeCliente', config: { verb: 'POST' } },
    },
  },
  CONSULTA_OPERACION: {
    baseURL: buildBaseURL('CONSULTA_OPERACION'),
    resources: {
      BUSCAR_DOCUMENTOS: { path: 'buscarDocumentosPorOperacion', config: { verb: 'POST' } },
      HISTORIAL_OPERACION: { path: 'historialOperacion', config: { verb: 'POST' } },
    },
  },
  CONSULTA_SOLICITUDES: {
    baseURL: buildBaseURL('CONSULTA_SOLICITUDES'),
    resources: {
      CONSULTA_SOLICITUDES: { path: 'consultaSolicitudes', config: { verb: 'POST' } },
      TOTAL_SOLICITUDES: { path: 'totalSolicitudes', config: { verb: 'POST' } },
    },
  },
  CONTENIDO_CAJA: {
    baseURL: buildBaseURL('CONTENIDO_CAJA'),
    resources: { GUARDAR_CONTENIDO: { path: 'guardarContenido', config: { verb: 'POST' } } },
  },
  DETALLE_CAJA: {
    baseURL: buildBaseURL('DETALLE_CAJA'),
    resources: {
      ACTUALIZAR_DETALLE: { path: 'actualizarDetalleCaja', config: { verb: 'POST' } },
      ELIMINAR_DETALLE: { path: 'eliminarDetalleCaja', config: { verb: 'POST' } },
      GUARDAR_DETALLE: { path: 'guardarDetalleCaja', config: { verb: 'POST' } },
    },
  },
  DETALLE_DOCUMENTO: {
    baseURL: buildBaseURL('DETALLE_DOCUMENTO'),
    resources: { DETALLE_DOCUMENTO: { path: 'detalleDocumento', config: { verb: 'POST' } } },
  },
  DOCUMENTO: {
    baseURL: buildBaseURL('DOCUMENTO'),
    resources: {
      ACTUALIZAR_DOCUMENTO: { path: 'actualizarDocumento', config: { verb: 'POST' } },
      CANTIDAD_DOCUMENTOS: { path: 'cantidadDeDocumentos', config: { verb: 'GET' } },
      DETALLE_DOCUMENTO: { path: 'detalleDocumento', config: { verb: 'POST' } },
      ELIMINAR_DOCUMENTO: { path: 'eliminarDocumento', config: { verb: 'POST' } },
      GUARDAR_DOCUMENTO: { path: 'guardarDocumento', config: { verb: 'POST' } },
      OBTENER_DOCUMENTO: { path: 'obtenerDocumentos', config: { verb: 'POST' } },
    },
  },
  DOCUMENTO_GD: {
    baseURL: buildBaseURL('DOCUMENTO_GD'),
    resources: { VISUALIZAR_DOCUMENTO: { path: 'visualizarDocumento', config: { verb: 'POST' } } },
  },
  ESTADO: { baseURL: buildBaseURL('ESTADO'), resources: { OBTENER_ESTADOS: { path: 'obtenerEstados', config: { verb: 'POST' } } } },
  ETIQUETAS_CAJA: {
    baseURL: buildBaseURL('ETIQUETAS_CAJA'),
    resources: { ACTUALIZAR_ETIQUETAS: { path: 'actualizarEtiquetas', config: { verb: 'POST' } } },
  },
  INFO_SESION: { baseURL: buildBaseURL('INFO_SESION'), resources: { INFO_SESION: { path: 'infoSesion', config: { verb: 'POST' } } } },
  PEDIDOS_PENDIENTES: {
    baseURL: buildBaseURL('PEDIDOS_PENDIENTES'),
    resources: {
      CANTIDAD_PEDIDOS: { path: 'cantidadPedidos', config: { verb: 'POST' } },
      PEDIDOS_PENDIENTES: { path: 'pedidosPendientes', config: { verb: 'POST' } },
    },
  },
  PLANTILLAS_SECTOR: {
    baseURL: buildBaseURL('PLANTILLAS_SECTOR'),
    resources: { PLANTILLAS_SECTOR: { path: 'plantillasPorSector', config: { verb: 'POST' } } },
  },
  PROCESO: { baseURL: buildBaseURL('PROCESO'), resources: { OBTENER_PROCESOS: { path: 'obtenerProcesos', config: { verb: 'POST' } } } },
  SECTOR: { baseURL: buildBaseURL('SECTOR'), resources: { OBTENER_SECTORES: { path: 'obtenerSectores', config: { verb: 'POST' } } } },
  SOLICITUD_ETAPA: {
    baseURL: buildBaseURL('SOLICITUD_ETAPA'),
    resources: { HISTORIAL_SOLICITUD: { path: 'historialSolicitud', config: { verb: 'POST' } } },
  },
  SUBPROCESO: {
    baseURL: buildBaseURL('SUBPROCESO'),
    resources: {
      OBTENER_SUBPROCESO_POR_PROCESO: { path: 'obtenerSubprocesosPorProceso', config: { verb: 'POST' } },
      GENERAR_URL_DIGITALIZACION: { path: 'generarUrlDeDigitalizacion', config: { verb: 'POST' } },
    },
  },
  TEMPORAL_CARRITO: {
    baseURL: buildBaseURL('TEMPORAL_CARRITO'),
    resources: {
      GUARDAR: { path: 'guardarEnCarrito', config: { verb: 'POST' } },
      TOTAL_PEDIDOS: { path: 'totalPedidosCarrito', config: { verb: 'POST' } },
    },
  },
  TIPOS_CAJA: {
    baseURL: buildBaseURL('TIPOS_CAJA'),
    resources: {
      TIPO_CAJA: { path: 'tipoCaja', config: { verb: 'GET' } },
      TIPO_CONTENIDO: { path: 'tipoDeContenido', config: { verb: 'POST' } },
      VENCIMIENTO_CAJA: { path: 'vencimientoCaja', config: { verb: 'POST' } },
    },
  },
};
