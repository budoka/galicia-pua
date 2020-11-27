export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface API<ResourcesType> {
  baseURL: string;
  resources: ResourcesType;
}

export interface Resource {
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

// Para agregar una nueva API, se debe actualizar las interfaces en el siguiente orden:
// 1) Agregar una nueva interface 'Resource<Nombre>'.
// 2) Definir los recursos necesarios dentro de la interface creada.
// 3) Definir la api dentro de la interface 'APIs', proveyendo la interface creada en el paso 1.

export interface APIs {
  CAJA: API<ResourcesCaja>;
  DOCUMENTO: API<ResourcesDocumento>;
  ETIQUETAS_CAJA: API<ResourcesEtiquetasCaja>;
  INFO_SESION: API<ResourcesInfoSesion>;
  PLANTILLAS_SECTOR: API<ResourcesPlantillasSector>;
  TIPO_CAJA: API<ResourcesTipoCaja>;
}

export interface ResourcesCaja {
  DETALLE_CAJA: Resource;
  PREVIEW: Resource;
  GUARDAR_CAJA: Resource;
  CERRAR_CAJA: Resource;
  ELIMINAR_CAJA: Resource;
  INFO_CAJA: Resource;
}

export interface ResourcesDocumento {
  GUARDAR_DOCUMENTO: Resource;
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
