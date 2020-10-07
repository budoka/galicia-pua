import { LabeledValue } from 'antd/lib/select';

///////////////////// Interfaces Front /////////////////////

export interface BoxTypeFilter extends LabeledValue {
  // id: string;
  // description: string;
}

export interface BoxContentTypeFilter extends LabeledValue {
  //  id: string;
  //  description: string;
}

export interface DetailTemplateFilter extends LabeledValue {
  //  id: string;
  //  description: string;
}

///////////////////// Interfaces Back /////////////////////

// RESPONSE - https://tipos-de-caja-puda-portalunificado-dev.devcloud.bancogalicia.com.ar/api/tipoCaja
export interface BoxTypeFilterAPIResponse {
  id: number;
  descripcion: string;
}

// REQUEST - https://tipos-de-caja-puda-portalunificado-dev.devcloud.bancogalicia.com.ar/api/tipoDeContenido
export interface BoxContentTypeFilterAPIRequest {
  tipoCaja: string;
}

// RESPONSE - https://tipos-de-caja-puda-portalunificado-dev.devcloud.bancogalicia.com.ar/api/tipoDeContenido
export type BoxContentTypeFilterAPIResponse = string;

// REQUEST - https://plantillas-por-sector-puda-portalunificado-dev.devcloud.bancogalicia.com.ar/api/plantillasPorSector
export interface DetailTemplateFilterAPIRequest {
  idSector: number;
}

// RESPONSE - https://plantillas-por-sector-puda-portalunificado-dev.devcloud.bancogalicia.com.ar/api/plantillasPorSector
export interface DetailTemplateFilterAPIResponse {
  id: number;
  descripcion: string;
}
