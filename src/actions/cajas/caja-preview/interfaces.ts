///////////////////// Interfaces Back /////////////////////

// REQUEST - https://caja-puda-portalunificado-dev.devcloud.bancogalicia.com.ar/api/preview
export interface PreviewCajaRequest {
  idCaja: number; // Se va a cambiar por "idTipoCaja"
  tipoContenido: string; // Se va a cambiar por "idTipoContenidoCaja"
  idPlantilla?: number;
}

// RESPONSE - https://caja-puda-portalunificado-dev.devcloud.bancogalicia.com.ar/api/preview
export type PreviewCajaResponse = PreviewCajaDocumentoResponse[] | PreviewCajaDetalleResponse[] | PreviewCajaEtiquetaResponse[];

// RESPONSE - https://caja-puda-portalunificado-dev.devcloud.bancogalicia.com.ar/api/preview
export interface PreviewCajaDocumentoResponse {
  id: number; // id tipo caja
  descripcion: string;
  inclusiones: Inclusion[];
}

export interface Inclusion {
  descripcion: string;
  tipoDato: string;
  requerido: string;
}

// RESPONSE - https://caja-puda-portalunificado-dev.devcloud.bancogalicia.com.ar/api/preview
export interface PreviewCajaDetalleResponse {
  id: number;
  titulo: string;
  tipo: string;
  opcional: boolean;
  orden: number;
  longitud: number;
  idPlantilla: number;
  //version: number; // Sin usar
  //referencia: any; // A definir
}

// RESPONSE - https://caja-puda-portalunificado-dev.devcloud.bancogalicia.com.ar/api/preview
export interface PreviewCajaEtiquetaResponse {
  id: number;
  descripcion: string;
  legacy: number;
  version: number;
}
