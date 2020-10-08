import { RunnableState } from 'src/actions/interfaces';
import { Caja, ContenidoCaja } from '../interfaces';

export enum ContenidoCajaAction {
  RUNNING_CONTENT = 'ContenidoCajaAction/RUNNING_CONTENT',

  CREATE_LOCAL_CONTENT = 'ContenidoCajaAction/CREATE_LOCAL_CONTENT',
  CLEAN_LOCAL_CONTENT = 'ContenidoCajaAction/CLEAN_LOCAL_CONTENT',

  ADD_CONTENT_SUCCESS = 'ContenidoCajaAction/ADD_CONTENT_SUCCESS',
  ADD_CONTENT_FAILURE = 'ContenidoCajaAction/ADD_CONTENT_FAILURE',

  UPDATE_CONTENT_SUCCESS = 'ContenidoCajaAction/UPDATE_CONTENT_SUCCESS',
  UPDATE_CONTENT_FAILURE = 'ContenidoCajaAction/UPDATE_CONTENT_FAILURE',

  REMOVE_CONTENT_SUCCESS = 'ContenidoCajaAction/REMOVE_CONTENT_SUCCESS',
  REMOVE_CONTENT_FAILURE = 'ContenidoCajaAction/REMOVE_CONTENT_FAILURE',
}

export type ContenidoCajaState = Pick<Caja, 'contenido'> & RunnableState;

export interface RUNNING_CONTENT {
  type: typeof ContenidoCajaAction.RUNNING_CONTENT;
  payload: ContenidoCajaState['isRunning'];
}

export interface CREATE_LOCAL_CONTENT {
  type: typeof ContenidoCajaAction.CREATE_LOCAL_CONTENT;
  payload: ContenidoCaja;
}

export interface CLEAN_LOCAL_CONTENT {
  type: typeof ContenidoCajaAction.CLEAN_LOCAL_CONTENT;
}

export interface ADD_CONTENT_SUCCESS {
  type: typeof ContenidoCajaAction.ADD_CONTENT_SUCCESS;
  payload: Exclude<ContenidoCaja, 'id'>;
}

export interface ADD_CONTENT_FAILURE {
  type: typeof ContenidoCajaAction.ADD_CONTENT_FAILURE;
}

export interface UPDATE_CONTENT_SUCCESS {
  type: typeof ContenidoCajaAction.UPDATE_CONTENT_SUCCESS;
  payload: ContenidoCaja;
}

export interface UPDATE_CONTENT_FAILURE {
  type: typeof ContenidoCajaAction.UPDATE_CONTENT_FAILURE;
}

export interface REMOVE_CONTENT_SUCCESS {
  type: typeof ContenidoCajaAction.REMOVE_CONTENT_SUCCESS;
  payload: ContenidoCaja['id'];
}

export interface REMOVE_CONTENT_FAILURE {
  type: typeof ContenidoCajaAction.REMOVE_CONTENT_FAILURE;
}

export type ContenidoCajaActionTypes =
  | RUNNING_CONTENT
  | CREATE_LOCAL_CONTENT
  | CLEAN_LOCAL_CONTENT
  | ADD_CONTENT_SUCCESS
  | ADD_CONTENT_FAILURE
  | UPDATE_CONTENT_SUCCESS
  | UPDATE_CONTENT_FAILURE
  | REMOVE_CONTENT_SUCCESS
  | REMOVE_CONTENT_FAILURE;
