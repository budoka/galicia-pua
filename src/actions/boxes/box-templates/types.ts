import { BoxTemplate } from './interfaces';
import { FetchableState } from '../../interfaces';

export enum BoxTemplates {
  FETCHING = 'BoxTemplates/FETCHING',

  GET_SUCCESS = 'BoxTemplates/GET_SUCCESS',
  GET_FAILURE = 'BoxTemplates/GET_FAILURE',
}

export interface BoxTemplatesState extends FetchableState {
  template: BoxTemplate;
}

export interface FETCHING {
  type: typeof BoxTemplates.FETCHING;
  payload: BoxTemplatesState['isFetching'];
}

export interface GET_SUCCESS {
  type: typeof BoxTemplates.GET_SUCCESS;
  payload: BoxTemplatesState['template'];
}

export interface GET_FAILURE {
  type: typeof BoxTemplates.GET_FAILURE;
}

export type BoxTemplatesActionTypes = FETCHING | GET_SUCCESS | GET_FAILURE;
