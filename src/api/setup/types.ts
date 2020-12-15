// Para agregar una nueva API, se debe actualizar las interfaces en el siguiente orden:
// 1) Agregar una nueva interface 'Resource<Nombre>'.
// 2) Definir los recursos necesarios dentro de la interface creada.
// 3) Definir la api dentro de la interface 'APIs', proveyendo la interface creada en el paso 1.

import { API, Resource } from '../types';

export interface APIList {
  CAJA: API<ResourcesCaja>;
  DOCUMENTO: API<ResourcesDocumento>;
  ETIQUETAS_CAJA: API<ResourcesEtiquetasCaja>;
  INFO_SESION: API<ResourcesInfoSesion>;
  PLANTILLAS_SECTOR: API<ResourcesPlantillasSector>;
  TIPO_CAJA: API<ResourcesTipoCaja>;
  PEDIDOS_PENDIENTES: API<ResourcesPedidosPendientes>;
  CONSULTA_SOLICITUDES: API<ResourcesConsultaSolicitudes>;
}

export interface ResourcesCaja {
  DETALLE_CAJA: Resource;
  PREVIEW: Resource;
  GUARDAR_CAJA: Resource;
  MODIFICAR_CAJA: Resource;
  CERRAR_CAJA: Resource;
  ELIMINAR_CAJA: Resource;
  INFO_CAJA: Resource;
  CANTIDAD_CAJAS: Resource;
}

export interface ResourcesDocumento {
  GUARDAR_DOCUMENTO: Resource;
  DETALLE_DOCUMENTO: Resource;
  CANTIDAD_DOCUMENTOS: Resource;
}

export interface ResourcesEtiquetasCaja {
  //<RESOURCE>: IResource;
}

export interface ResourcesInfoSesion {
  INFO_SESION: Resource;
}

export interface ResourcesPlantillasSector {
  PLANTILLAS_SECTOR: Resource;
}

export interface ResourcesTipoCaja {
  TIPO_CAJA: Resource;
  TIPO_CONTENIDO: Resource;
  VENCIMIENTO_CAJA: Resource;
}

export interface ResourcesPedidosPendientes {
  PEDIDOS_PENDIENTES: Resource;
  CANTIDAD_PEDIDOS: Resource;
}

export interface ResourcesConsultaSolicitudes {
  CONSULTA_SOLICITUDES: Resource;
  TOTAL_SOLICITUDES: Resource;
}
