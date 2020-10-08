import { LabeledValue, OptionProps, SelectValue } from 'antd/lib/select';

///////////////////// Interfaces Front /////////////////////

export interface Filtro {
  id: number | string;
  descripcion: string;
}

///////////////////// Interfaces Back /////////////////////

// RESPONSE - https://tipos-de-caja-puda-portalunificado-dev.devcloud.bancogalicia.com.ar/api/tipoCaja
export interface FiltroTipoCajaResponse extends Filtro {
  //id: number;
  // descripcion: string;
}

// REQUEST - https://tipos-de-caja-puda-portalunificado-dev.devcloud.bancogalicia.com.ar/api/tipoDeContenido
export interface FiltroTipoContenidoCajaRequest {
  tipoCaja: string;
}

// RESPONSE - https://tipos-de-caja-puda-portalunificado-dev.devcloud.bancogalicia.com.ar/api/tipoDeContenido
export type FiltroTipoContenidoCajaResponseV1 = string;
export interface FiltroTipoContenidoCajaResponse extends Filtro {
  //id: number;
  // descripcion: string;
}

// REQUEST - https://plantillas-por-sector-puda-portalunificado-dev.devcloud.bancogalicia.com.ar/api/plantillasPorSector
export interface FiltroPlantillaRequest {
  idSector: number;
}

// RESPONSE - https://plantillas-por-sector-puda-portalunificado-dev.devcloud.bancogalicia.com.ar/api/plantillasPorSector
export interface FiltroTipoPlantillaResponse {
  id: number;
  descripcion: string;
}

//export type FiltroCaja = FiltroTipoCajaResponse | FiltroTipoContenidoCajaResponse | FiltroPlantillaRequest extends SelectValue

// export type FiltroCaja = FiltroTipoCajaResponse | FiltroTipoContenidoCajaResponse | FiltroPlantillaRequest extends SelectValue;

declare module 'antd/lib/select' {
  export interface OptionProps extends Filtro {}
  // export interface OptionProps extends FiltroTipoCajaResponse, FiltroTipoContenidoCajaResponse, FiltroPlantillaRequest
}
