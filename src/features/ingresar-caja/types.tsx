export interface IngresarCajaSliceState {
  filters: Filtros;
  selected: Seleccionados;
  info: Info;
  loading: Loading;
  error: string | null;
}

// Modelo front

export interface Filtro {
  id: number | string;
  descripcion: string;
}

export interface Filtros {
  tiposCaja?: TiposCaja;
  tiposContenido?: TiposContenido; // TODO Se debería cambiar el servicio tipoDeContenido (request y response)
  tiposPlantilla?: TiposPlantilla;
}

export interface Seleccionados {
  tipoCaja?: Filtro | null;
  tipoContenido?: Filtro | null;
  tipoPlantilla?: Filtro | null;
}

export interface Info {
  añosVencimiento?: AñosVencimiento | null; // TODO Se debería cambiar el servicio vencimientoCaja (request y response)
}

export interface Loading {
  tiposCaja?: boolean;
  tiposContenido?: boolean;
  tipoPlantilla?: boolean;
  añosVencimiento?: boolean;
}

export type TiposCaja = Filtro[];
export type TiposContenido = Filtro[];
export type TiposPlantilla = Filtro[];
export type AñosVencimiento = number;

// Modelo back

export type TiposCajaResponseBody = TiposCaja;

export interface TiposContenidoRequestBody {
  tipoCaja: string;
}

export type TiposContenidoResponseBody = string[]; // TODO Se debería cambiar el servicio tipoDeContenido (request y response)

export interface TiposPlantillaRequestBody {
  idSector: number;
}

export type TiposPlantillaResponseBody = TiposPlantilla;

export interface VencimientoCajaRequestBody {
  idTipoCaja: number;
  tipoContenido: string;
}

export type VencimientoCajaResponseBody = AñosVencimiento;
