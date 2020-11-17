import { RunnableState } from '../interfaces';

export interface InfoSesion {
  idUsuario?: number;
  idSector?: number;
  nombreUsuario?: string;
  nombreSector?: string;
  legajo?: string;
  perfil?: string;
}

export enum SesionAction {
  RUNNING = 'SesionAction/RUNNING',
  GET_DATA_SUCCESS = 'SesionAction/GET_DATA_SUCCESS',
  GET_DATA_FAILURE = 'SesionAction/GET_DATA_FAILURE',
}

export interface SesionState extends RunnableState {
  infoSesion?: InfoSesion;
}

//export type SesionState = Sesion & RunnableState & CacheableState;

export interface RUNNING {
  type: typeof SesionAction.RUNNING;
}

export interface GET_DATA_SUCCESS {
  type: typeof SesionAction.GET_DATA_SUCCESS;
  infoSesion: InfoSesion;
}

export interface GET_DATA_FAILURE {
  type: typeof SesionAction.GET_DATA_FAILURE;
}

export type SesionActionTypes = RUNNING | GET_DATA_SUCCESS | GET_DATA_FAILURE;
