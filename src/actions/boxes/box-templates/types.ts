import { BoxTemplate } from './interfaces';
import { RunnableState } from '../../interfaces';

export enum BoxTemplates {
  RUNNING = 'BoxTemplates/RUNNING',

  GET_SUCCESS = 'BoxTemplates/GET_SUCCESS',
  GET_FAILURE = 'BoxTemplates/GET_FAILURE',
}

export interface BoxTemplatesState extends RunnableState {
  template: BoxTemplate;
}

export interface RUNNING {
  type: typeof BoxTemplates.RUNNING;
  payload: BoxTemplatesState['isRunning'];
}

export interface GET_SUCCESS {
  type: typeof BoxTemplates.GET_SUCCESS;
  payload: BoxTemplatesState['template'];
}

export interface GET_FAILURE {
  type: typeof BoxTemplates.GET_FAILURE;
}

export type BoxTemplatesActionTypes = RUNNING | GET_SUCCESS | GET_FAILURE;
