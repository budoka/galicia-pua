import { RunnableState } from 'src/actions/interfaces';

export interface DetalleCaja {
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

  GET_SUCCESS = 'CajasPendientesAction/GET_SUCCESS',
  GET_FAILURE = 'CajasPendientesAction/GET_FAILURE',
}

// State

export type CajasPendientesState = CajasPendientes & RunnableState;

export interface RUNNING {
  type: typeof CajasPendientesAction.RUNNING;
  isRunning: CajasPendientesState['isRunning'];
}

export interface GET_SUCCESS {
  type: typeof CajasPendientesAction.GET_SUCCESS;
  detallesCaja: DetalleCaja[];
}

export interface GET_FAILURE {
  type: typeof CajasPendientesAction.GET_FAILURE;
}

export type CajasPendientesActionTypes = RUNNING | GET_SUCCESS | GET_FAILURE;
