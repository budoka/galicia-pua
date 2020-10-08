import {
  PreviewCajaDetalleResponse,
  PreviewCajaDocumentoResponse,
  PreviewCajaEtiquetaResponse,
  PreviewCajaRequest,
  PreviewCajaResponse,
} from './interfaces';
import { RunnableState } from '../../interfaces';

export enum PreviewCajaAction {
  RUNNING_PREVIEW = 'PreviewCajas/RUNNING_PREVIEW',

  GET_SUCCESS = 'PreviewCajas/GET_SUCCESS',
  GET_FAILURE = 'PreviewCajas/GET_FAILURE',

  CLEAR = 'PreviewCajas/CLEAR',
}

export interface PreviewCajaState extends RunnableState {
  preview: PreviewCajaResponse;
  //preview: PreviewCajaDocumentoResponse[] | PreviewCajaDetalleResponse[] | PreviewCajaEtiquetaResponse[]; //PreviewCajaResponse;
}

export interface RUNNING_PREVIEW {
  type: typeof PreviewCajaAction.RUNNING_PREVIEW;
  payload: PreviewCajaState['isRunning'];
}

export interface GET_SUCCESS {
  type: typeof PreviewCajaAction.GET_SUCCESS;
  preview: PreviewCajaState['preview'];
}

export interface GET_FAILURE {
  type: typeof PreviewCajaAction.GET_FAILURE;
}

export interface CLEAR {
  type: typeof PreviewCajaAction.CLEAR;
}

export type PreviewCajaActionTypes = RUNNING_PREVIEW | GET_SUCCESS | GET_FAILURE | CLEAR;
