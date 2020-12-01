import { Opcion } from 'src/types';

export interface IngresarCajaSliceState {
  data: FetchedData;
  inputs: Inputs;
  loading: Loading;
  error: string | null;
  ui: UIState;
}

// Modelo front

export type Filtro = Opcion;
/* export interface Filtro {
  id: number | string;
  descripcion: string;
} */

export type VistaPrevia = VistaPreviaCajaDocumento[] | VistaPreviaCajaDetalle[] | VistaPreviaCajaEtiqueta[];

export interface VistaPreviaCajaDocumento {
  id: number; // id tipo caja
  descripcion: string;
  inclusiones: InclusionCajaDocumento[];
}

export interface InclusionCajaDocumento {
  descripcion: string;
  tipoDato: string;
  requerido: string;
}

export interface VistaPreviaCajaDetalle {
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

export interface VistaPreviaCajaEtiqueta {
  id: number;
  descripcion: string;
  legacy: number;
  version: number;
}

export type FechaVigencia = string[];

export interface FetchedData {
  tiposCaja?: TiposCaja;
  tiposContenido?: TiposContenido; // TODO Se debería cambiar el servicio tipoDeContenido (request y response)
  tiposPlantilla?: TiposPlantilla;
  vistaPrevia?: any;
  añosVencimiento?: AñosVencimiento | null; // TODO Se debería cambiar el servicio vencimientoCaja (request y response)
}

export interface Inputs {
  tipoCaja?: Filtro | null;
  tipoContenido?: Filtro | null;
  tipoPlantilla?: Filtro | null;
  fechaVigencia?: FechaVigencia | null;
  descripcion?: string | null;
  restringida?: number | null;
}

export interface Loading {
  tiposCaja?: boolean;
  tiposContenido?: boolean;
  tiposPlantilla?: boolean;
  añosVencimiento?: boolean;
  vistaPrevia?: boolean;
  guardandoCaja?: boolean;
}

export interface UIState {
  selectTipoContenido?: { visible: boolean };
  selectTipoPlantilla?: { visible: boolean };
  datePickerFechaVigencia?: { visible: boolean };
  labelFechaVencimiento?: { visible: boolean };
  inputDescripcion?: { visible: boolean };
  checkboxRestringida?: { visible: boolean };
  vistaPrevia?: { visible: boolean };
  buttonCrear?: { visible: boolean };
}

export type TiposCaja = Filtro[];
export type TiposContenido = Filtro[];
export type TiposPlantilla = Filtro[];
export type AñosVencimiento = number;

// Modelo back

export interface FiltroResponseBody {
  id: number | string;
  descripcion: string;
}

export type TiposCajaResponseBody = FiltroResponseBody[];

export interface TiposContenidoRequestBody {
  tipoCaja: string;
}
export type TiposContenidoResponseBody = string[]; // TODO Se debería cambiar el servicio tipoDeContenido (request y response)

export interface TiposPlantillaRequestBody {
  idSector: number;
}
export type TiposPlantillaResponseBody = FiltroResponseBody[];

export interface VistaPreviaRequestBody {
  idTipoCaja: number;
  idTipoContenido: number;
  idPlantilla?: number;
}
export type VistaPreviaResponseBody = VistaPrevia;

export interface VencimientoCajaRequestBody {
  idTipoCaja: number;
  tipoContenido: string;
}
export type VencimientoCajaResponseBody = AñosVencimiento;

export interface GuardarCajaRequestBody {
  idTipoCaja: number | null;
  idTipoContenido: number | null;
  idPlantilla: number | null;
  idUsuarioAlta: number | null;
  idSectorOrigen: number | null;
  descripcion: string | null;
  restringida: number | null;
  fechaGeneracion: string | null;
  fechaDesde: string | null;
  fechaHasta: string | null;
  fechaVencimiento: string | null;
}

export interface GuardarCajaResponseBody {
  numero: number;
}
