import { RunnableState } from 'src/actions/interfaces';
import { Box, BoxContent } from './interfaces';

export enum BoxData {
  RUNNING = 'BoxData/RUNNING',

  GET_BOX_SUCCESS = 'BoxData/GET_BOX_SUCCESS',
  GET_BOX_FAILURE = 'BoxData/GET_BOX_FAILURE',

  CREATE_BOX_SUCCESS = 'BoxData/CREATE_BOX_SUCCESS',
  CREATE_BOX_FAILURE = 'BoxData/CREATE_BOX_FAILURE',

  CLOSE_BOX_SUCCESS = 'BoxData/CLOSE_BOX_SUCCESS',
  CLOSE_BOX_FAILURE = 'BoxData/CLOSE_BOX_FAILURE',

  REMOVE_BOX_SUCCESS = 'BoxData/REMOVE_BOX_SUCCESS',
  REMOVE_BOX_FAILURE = 'BoxData/REMOVE_BOX_FAILURE',

  CREATE_LOCAL_CONTENT = 'BoxData/CREATE_LOCAL_CONTENT',
  CLEAN_LOCAL_CONTENT = 'BoxData/CLEAN_LOCAL_CONTENT',

  ADD_CONTENT_SUCCESS = 'BoxData/ADD_CONTENT_SUCCESS',
  ADD_CONTENT_FAILURE = 'BoxData/ADD_CONTENT_FAILURE',

  UPDATE_CONTENT_SUCCESS = 'BoxData/UPDATE_CONTENT_SUCCESS',
  UPDATE_CONTENT_FAILURE = 'BoxData/UPDATE_CONTENT_FAILURE',

  REMOVE_CONTENT_SUCCESS = 'BoxData/REMOVE_CONTENT_SUCCESS',
  REMOVE_CONTENT_FAILURE = 'BoxData/REMOVE_CONTENT_FAILURE',
}

export type BoxDataState = Box & RunnableState;

export interface RUNNING {
  type: typeof BoxData.RUNNING;
  payload: BoxDataState['isRunning'];
}

export interface GET_BOX_SUCCESS {
  type: typeof BoxData.GET_BOX_SUCCESS;
  payload: BoxDataState;
}

export interface GET_BOX_FAILURE {
  type: typeof BoxData.GET_BOX_FAILURE;
}

export interface CREATE_BOX_SUCCESS {
  type: typeof BoxData.CREATE_BOX_SUCCESS;
  payload: Box;
}

export interface CREATE_BOX_FAILURE {
  type: typeof BoxData.CREATE_BOX_FAILURE;
}

export interface CLOSE_BOX_SUCCESS {
  type: typeof BoxData.CLOSE_BOX_SUCCESS;
}

export interface CLOSE_BOX_FAILURE {
  type: typeof BoxData.CLOSE_BOX_FAILURE;
}

export interface REMOVE_BOX_SUCCESS {
  type: typeof BoxData.REMOVE_BOX_SUCCESS;
  payload: BoxDataState['id'];
}

export interface REMOVE_BOX_FAILURE {
  type: typeof BoxData.REMOVE_BOX_FAILURE;
}

export interface CREATE_LOCAL_CONTENT {
  type: typeof BoxData.CREATE_LOCAL_CONTENT;
  payload: BoxContent;
}

export interface CLEAN_LOCAL_CONTENT {
  type: typeof BoxData.CLEAN_LOCAL_CONTENT;
}

export interface ADD_CONTENT_SUCCESS {
  type: typeof BoxData.ADD_CONTENT_SUCCESS;
  payload: Exclude<BoxContent, 'id'>;
}

export interface ADD_CONTENT_FAILURE {
  type: typeof BoxData.ADD_CONTENT_FAILURE;
}

export interface UPDATE_CONTENT_SUCCESS {
  type: typeof BoxData.UPDATE_CONTENT_SUCCESS;
  payload: BoxContent;
}

export interface UPDATE_CONTENT_FAILURE {
  type: typeof BoxData.UPDATE_CONTENT_FAILURE;
}

export interface REMOVE_CONTENT_SUCCESS {
  type: typeof BoxData.REMOVE_CONTENT_SUCCESS;
  payload: BoxContent['id'];
}

export interface REMOVE_CONTENT_FAILURE {
  type: typeof BoxData.REMOVE_CONTENT_FAILURE;
}

export type BoxDataActionTypes =
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
