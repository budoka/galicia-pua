import { BoxContent, BoxContentType, IBoxDataSet, IBoxDocument } from './interfaces';
import { FetchableState } from 'src/actions/interfaces';

export enum BoxData {
  FETCHING = 'BoxData/FETCHING',

  GET_SUCCESS = 'BoxData/GET_SUCCESS',
  GET_FAILURE = 'BoxData/GET_FAILURE',

  CREATE = 'BoxData/CREATE',
  CLEAN = 'BoxData/CLEAN',

  ADD_SUCCESS = 'BoxData/ADD_SUCCESS',
  ADD_FAILURE = 'BoxData/ADD_FAILURE',

  UPDATE_SUCCESS = 'BoxData/UPDATE_SUCCESS',
  UPDATE_FAILURE = 'BoxData/UPDATE_FAILURE',

  REMOVE_SUCCESS = 'BoxData/REMOVE_SUCCESS',
  REMOVE_FAILURE = 'BoxData/REMOVE_FAILURE',
}

export interface BoxDataState extends FetchableState {
  dataSet: IBoxDataSet;
}

export interface FETCHING {
  type: typeof BoxData.FETCHING;
  payload: BoxDataState['isFetching'];
}

export interface GET_SUCCESS {
  type: typeof BoxData.GET_SUCCESS;
  payload: BoxDataState['dataSet'];
}

export interface GET_FAILURE {
  type: typeof BoxData.GET_FAILURE;
}

export interface CREATE {
  type: typeof BoxData.CREATE;
  payload: BoxContentType;
}

export interface CLEAN {
  type: typeof BoxData.CLEAN;
}

export interface ADD_SUCCESS {
  type: typeof BoxData.ADD_SUCCESS;
  payload: Exclude<BoxContentType, 'id'>;
}

export interface ADD_FAILURE {
  type: typeof BoxData.ADD_FAILURE;
}

export interface UPDATE_SUCCESS {
  type: typeof BoxData.UPDATE_SUCCESS;
  payload: BoxContentType;
}

export interface UPDATE_FAILURE {
  type: typeof BoxData.UPDATE_FAILURE;
}

export interface REMOVE_SUCCESS {
  type: typeof BoxData.REMOVE_SUCCESS;
  payload: BoxContentType['id'][];
}

export interface REMOVE_FAILURE {
  type: typeof BoxData.REMOVE_FAILURE;
}

export type BoxDataActionTypes =
  | FETCHING
  | GET_SUCCESS
  | GET_FAILURE
  | CREATE
  | CLEAN
  | ADD_SUCCESS
  | ADD_FAILURE
  | UPDATE_SUCCESS
  | UPDATE_FAILURE
  | REMOVE_SUCCESS
  | REMOVE_FAILURE;
