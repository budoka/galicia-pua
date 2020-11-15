import { RunnableState } from 'src/actions/interfaces';
import { Caja, ContenidoCaja } from '../interfaces';

export enum InfoCajaAction {
  RUNNING = 'InfoCajaAction/RUNNING',

  GET_BOX_SUCCESS = 'InfoCajaAction/GET_BOX_SUCCESS',
  GET_BOX_FAILURE = 'InfoCajaAction/GET_BOX_FAILURE',

  CREATE_BOX_SUCCESS = 'InfoCajaAction/CREATE_BOX_SUCCESS',
  CREATE_BOX_FAILURE = 'InfoCajaAction/CREATE_BOX_FAILURE',

  CLOSE_BOX_SUCCESS = 'InfoCajaAction/CLOSE_BOX_SUCCESS',
  CLOSE_BOX_FAILURE = 'InfoCajaAction/CLOSE_BOX_FAILURE',

  REMOVE_BOX_SUCCESS = 'InfoCajaAction/REMOVE_BOX_SUCCESS',
  REMOVE_BOX_FAILURE = 'InfoCajaAction/REMOVE_BOX_FAILURE',

  CREATE_LOCAL_CONTENT = 'InfoCajaAction/CREATE_LOCAL_CONTENT',
  CLEAN_LOCAL_CONTENT = 'InfoCajaAction/CLEAN_LOCAL_CONTENT',

  ADD_CONTENT_SUCCESS = 'InfoCajaAction/ADD_CONTENT_SUCCESS',
  ADD_CONTENT_FAILURE = 'InfoCajaAction/ADD_CONTENT_FAILURE',

  UPDATE_CONTENT_SUCCESS = 'InfoCajaAction/UPDATE_CONTENT_SUCCESS',
  UPDATE_CONTENT_FAILURE = 'InfoCajaAction/UPDATE_CONTENT_FAILURE',

  REMOVE_CONTENT_SUCCESS = 'InfoCajaAction/REMOVE_CONTENT_SUCCESS',
  REMOVE_CONTENT_FAILURE = 'InfoCajaAction/REMOVE_CONTENT_FAILURE',
}

export type InfoCajaState = Caja & RunnableState;

export interface RUNNING {
  type: typeof InfoCajaAction.RUNNING;
}

export interface GET_BOX_SUCCESS {
  type: typeof InfoCajaAction.GET_BOX_SUCCESS;
  caja: Caja;
}

export interface GET_BOX_FAILURE {
  type: typeof InfoCajaAction.GET_BOX_FAILURE;
}

export interface CREATE_BOX_SUCCESS {
  type: typeof InfoCajaAction.CREATE_BOX_SUCCESS;
  caja: Caja;
}

export interface CREATE_BOX_FAILURE {
  type: typeof InfoCajaAction.CREATE_BOX_FAILURE;
}

export interface CLOSE_BOX_SUCCESS {
  type: typeof InfoCajaAction.CLOSE_BOX_SUCCESS;
}

export interface CLOSE_BOX_FAILURE {
  type: typeof InfoCajaAction.CLOSE_BOX_FAILURE;
}

export interface REMOVE_BOX_SUCCESS {
  type: typeof InfoCajaAction.REMOVE_BOX_SUCCESS;
  id: InfoCajaState['id'];
}

export interface REMOVE_BOX_FAILURE {
  type: typeof InfoCajaAction.REMOVE_BOX_FAILURE;
}

export interface CREATE_LOCAL_CONTENT {
  type: typeof InfoCajaAction.CREATE_LOCAL_CONTENT;
  contenido: ContenidoCaja;
}

export interface CLEAN_LOCAL_CONTENT {
  type: typeof InfoCajaAction.CLEAN_LOCAL_CONTENT;
}

export interface ADD_CONTENT_SUCCESS {
  type: typeof InfoCajaAction.ADD_CONTENT_SUCCESS;
  contenido: Exclude<ContenidoCaja, 'id'>;
}

export interface ADD_CONTENT_FAILURE {
  type: typeof InfoCajaAction.ADD_CONTENT_FAILURE;
}

export interface UPDATE_CONTENT_SUCCESS {
  type: typeof InfoCajaAction.UPDATE_CONTENT_SUCCESS;
  contenido: ContenidoCaja;
}

export interface UPDATE_CONTENT_FAILURE {
  type: typeof InfoCajaAction.UPDATE_CONTENT_FAILURE;
}

export interface REMOVE_CONTENT_SUCCESS {
  type: typeof InfoCajaAction.REMOVE_CONTENT_SUCCESS;
  contenido: ContenidoCaja['id'];
}

export interface REMOVE_CONTENT_FAILURE {
  type: typeof InfoCajaAction.REMOVE_CONTENT_FAILURE;
}

export type InfoCajaActionTypes =
  | RUNNING
  | GET_BOX_SUCCESS
  | GET_BOX_FAILURE
  | CREATE_BOX_SUCCESS
  | CREATE_BOX_FAILURE
  | CLOSE_BOX_SUCCESS
  | CLOSE_BOX_FAILURE
  | REMOVE_BOX_SUCCESS
  | REMOVE_BOX_FAILURE
  | CREATE_LOCAL_CONTENT
  | CLEAN_LOCAL_CONTENT
  | ADD_CONTENT_SUCCESS
  | ADD_CONTENT_FAILURE
  | UPDATE_CONTENT_SUCCESS
  | UPDATE_CONTENT_FAILURE
  | REMOVE_CONTENT_SUCCESS
  | REMOVE_CONTENT_FAILURE;
