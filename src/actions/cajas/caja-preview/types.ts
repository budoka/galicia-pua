import { RunnableState } from '../../interfaces';
import { PreviewCajaResponse } from './interfaces';

export enum PreviewCajaAction {
  RUNNING = 'PreviewCajas/RUNNING',

  GET_DATA_SUCCESS = 'PreviewCajas/GET_DATA_SUCCESS',
  GET_DATA_FAILURE = 'PreviewCajas/GET_DATA_FAILURE',

  CLEAR = 'PreviewCajas/CLEAR',
}

export interface PreviewCajaState extends RunnableState {
  preview: PreviewCajaResponse;
  //preview: PreviewCajaDocumentoResponse[] | PreviewCajaDetalleResponse[] | PreviewCajaEtiquetaResponse[]; //PreviewCajaResponse;
}

export interface RUNNING_PREVIEW {
  type: typeof PreviewCajaAction.RUNNING;
}

export interface GET_SUCCESS {
  type: typeof PreviewCajaAction.GET_DATA_SUCCESS;
  preview: PreviewCajaState['preview'];
}

export interface GET_FAILURE {
  type: typeof PreviewCajaAction.GET_DATA_FAILURE;
}

export interface CLEAR {
  type: typeof PreviewCajaAction.CLEAR;
}

export type PreviewCajaActionTypes = RUNNING_PREVIEW | GET_SUCCESS | GET_FAILURE | CLEAR;
