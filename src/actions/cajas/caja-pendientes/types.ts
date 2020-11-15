import { RunnableState } from 'src/actions/interfaces';
import { IElement } from 'src/interfaces';

export interface DetalleCaja extends IElement {
  numero: number;
  descripcion: string;
  estado: string;
  fechaEmision: string;
  sector: number;
  usuario: string;
}

export interface CajasPendientes {
  detallesCaja: DetalleCaja[];
}

// Action

export enum CajasPendientesAction {
  RUNNING = 'CajasPendientesAction/RUNNING',
  CLEAR_DATA = 'CajasPendientesAction/CLEAR_DATA',
  GET_DATA_SUCCESS = 'CajasPendientesAction/GET_DATA_SUCCESS',
  GET_DATA_FAILURE = 'CajasPendientesAction/GET_DATA_FAILURE',
}

// State

export type CajasPendientesState = CajasPendientes & RunnableState;

export interface RUNNING {
  type: typeof CajasPendientesAction.RUNNING;
}

export interface CLEAR_DATA {
  type: typeof CajasPendientesAction.CLEAR_DATA;
}

export interface GET_SUCCESS {
  type: typeof CajasPendientesAction.GET_DATA_SUCCESS;
  detallesCaja: DetalleCaja[];
}

export interface GET_FAILURE {
  type: typeof CajasPendientesAction.GET_DATA_FAILURE;
}

export type CajasPendientesActionTypes = RUNNING | CLEAR_DATA | GET_SUCCESS | GET_FAILURE;
