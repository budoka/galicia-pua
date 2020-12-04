import { ReactNode } from 'react';
import { IElement, Opcion } from 'src/types';

export interface EditarCajaSliceState {
  data: FetchedData;
  inputs: Inputs;
  info: Info;
  loading: Loading;
  error: string | null;
  ui: UIState;
}

// Modelo front

export type DataType = 'texto' | 'entero' | 'fecha' | 'boolean' | 'lista';

export interface Caja {
  id: number | null; // id
  idTipoCaja: number | null;
  tipoContenido: number | null; // se debe cambiar por idTipoContenido
  idPlantilla: number | null;
  estado: string | null;
  idUsuarioAlta: number | null;
  idSectorOrigen: number | null;
  restringida: number | null;
  legajo: string | null;
  nombre: string | null;
  //cliente: string | null;
  nombreSector: string | null;
  // nombreTipoCaja: string | null;
  descripcion: string | null;
  // descripcionContenido: string | null;
  // descripcionPlantilla: string | null;
  fechaGeneracion: string | null;
  fechaVencimiento: string | null;
  fechaUltimaTransicion: string | null;
  fechaDesde: string | null;
  fechaHasta: string | null;
  contenido: ContenidoCaja[]; // contenido
}

export type ContenidoCaja = CajaDocumento | CajaDetalle | CajaEtiqueta;

export interface CajaDocumento extends IElement {
  id: number | null;
  idTipoDocumento: number | null;
  tipoDocumental: string | null;
  numeroProducto: string | null;
  detalle: string | null;
  dniCuitTitular: number | null;
  nombreTitular: string | null;
  idSectorPropietario: number | null;
  claveExterna: number | null;
  fechaDocumental: string | null;
  fechaCierre: string | null;
  fechaDesde: string | null;
  fechaHasta: string | null;
}

export interface CajaDetalle extends IElement {
  id: number;
  columnas: CajaDetalleColumna[];
}

export interface CajaDetalleColumna {
  idColumna: number;
  valor: string;
}

export interface CajaEtiqueta extends IElement {
  // id: number; // Se va a quitar
  idEtiqueta: number;
}

export type Filtro = Opcion;

export type VistaPrevia = VistaPreviaCajaDocumento[] | VistaPreviaCajaDetalle[] | VistaPreviaCajaEtiqueta[];

export interface VistaPreviaCajaDocumento {
  id: number; // id tipo caja
  descripcion: string;
  inclusiones: InclusionCajaDocumento[];
}

export interface InclusionCajaDocumento {
  descripcion: string;
  tipoDato: DataType;
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

export type FechaContenido = (string | moment.Moment)[];

export interface FetchedData {
  caja?: Caja | null;
  tiposCaja?: TiposCaja;
  tiposContenido?: TiposContenido; // TODO Se debería cambiar el servicio tipoDeContenido (request y response)
  tiposPlantilla?: TiposPlantilla;
  vistaPrevia?: any;
  vistaContenido?: any;
  añosVencimiento?: AñosVencimiento | null; // TODO Se debería cambiar el servicio vencimientoCaja (request y response)
}

export interface Inputs {
  tipoCaja?: Filtro | null;
  tipoContenido?: Filtro | null;
  tipoPlantilla?: Filtro | null;
  fechaContenido?: FechaContenido | null;
  descripcion?: string | null;
  restringida?: number | null;
}

export interface Info {
  caja?: number | null;
  estado?: string | null;
  usuario?: { nombre: string | null; legajo: string | null } | null;
  sector?: { nombre: string | null; id: number | null } | null;
  fechaGeneracion?: string | null;
  fechaVencimiento?: string | null;
  fechaModificacion?: string | null;
}

export interface Loading {
  datos?: boolean;
  caja?: boolean;
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
  datePickerFechaContenido?: { visible: boolean };
  labelFechaVencimiento?: { visible: boolean };
  inputDescripcion?: { visible: boolean };
  checkboxRestringida?: { visible: boolean };
  vistaPrevia?: { visible: boolean };
  vistaContenido?: { visible: boolean };
  buttonCrear?: { visible: boolean };
  notFound?: { visible: boolean };
  unavailable?: { visible: boolean };
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

export interface InfoCajaRequestBody {
  idCaja: number;
}

export type InfoCajaResponseBody = Caja;

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

export interface ModificarCajaRequestBody {
  numero: number | null;
  idTipoCaja: number | null;
  tipoContenido: string | null;
  //idTipoContenido: number | null;
  idPlantilla: number | null;
  descripcion: string | null;
  restringida: number | null;
  fechaDesde: string | null;
  fechaHasta: string | null;
  fechaVencimiento: string | null;
}

export interface ModificarCajaResponseBody {
  numero: number;
}
