import { IElement } from 'src/interfaces';

export interface CajasPendientesSliceState {
  data: CajasPendientes;
  filters: FiltrosCajas;
  loading: boolean;
  error: string | null;
}

// Modelo front

export interface DetalleCaja extends IElement {
  numero: number;
  descripcion: string;
  estado: string;
  fechaEmision: string;
  sector: number;
  usuario: string;
}

export interface FiltrosCajas {
  estado?: string;
  fecha?: moment.Moment[];
  sector?: number;
  usuario?: string;
}

export type CajasPendientes = DetalleCaja[];

// Modelo back

export interface CajasPendientesRequestBody {
  idUsuario: number; // sacar
  roles: string[]; // sacar
  estado?: string;
  centroCosto?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  nombre?: string;
  // numeroPagina: number;
  // volumenPagina: number;
  // contarTotal: boolean;
}

interface DetalleCajaResponseBody {
  numero: number;
  estado: string;
  descripcion: string;
  fechaEmision: string;
  sector: number;
  usuario: string;
}

export type CajasPendientesResponseBody = DetalleCajaResponseBody[];
