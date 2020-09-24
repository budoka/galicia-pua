import { FetchableState } from 'src/actions/interfaces';
import { BoxContentTypeFilter, BoxTypeFilter } from './interfaces';

export enum BoxFilters {
  FETCHING = 'BoxFilters/FETCHING',

  GET_FILTER_BOX_TYPE_SUCCESS = 'BoxFilters/GET_FILTER_BOX_TYPE_SUCCESS',
  GET_FILTER_BOX_TYPE_FAILURE = 'BoxFilters/GET_FILTER_BOX_TYPE_FAILURE',

  GET_FILTER_BOX_CONTENT_TYPE_SUCCESS = 'BoxFilters/GET_FILTER_BOX_CONTENT_TYPE_SUCCESS',
  GET_FILTER_BOX_CONTENT_TYPE_FAILURE = 'BoxFilters/GET_FILTER_BOX_CONTENT_TYPE_FAILURE',

  SELECT_BOX_TYPE = 'BoxFilters/SELECT_BOX_TYPE',
  SELECT_BOX_CONTENT_TYPE = 'BoxFilters/SELECT_BOX_CONTENT_TYPE',
}

export interface BoxFiltersState extends FetchableState {
  filter: {
    boxTypes: BoxTypeFilter[];
    boxContentTypes: BoxContentTypeFilter[];
  };
  selected: {
    boxType: BoxTypeFilter | null;
    boxContentType: BoxContentTypeFilter | null;
  };
}

export interface FETCHING {
  type: typeof BoxFilters.FETCHING;
  payload: BoxFiltersState['isFetching'];
}

export interface GET_FILTER_BOX_TYPE_SUCCESS {
  type: typeof BoxFilters.GET_FILTER_BOX_TYPE_SUCCESS;
  payload: BoxFiltersState['filter']['boxTypes'];
}

export interface GET_FILTER_BOX_TYPE_FAILURE {
  type: typeof BoxFilters.GET_FILTER_BOX_TYPE_FAILURE;
}

export interface GET_FILTER_BOX_CONTENT_TYPE_SUCCESS {
  type: typeof BoxFilters.GET_FILTER_BOX_CONTENT_TYPE_SUCCESS;
  payload: BoxFiltersState['filter']['boxContentTypes'];
}

export interface GET_FILTER_BOX_CONTENT_TYPE_FAILURE {
  type: typeof BoxFilters.GET_FILTER_BOX_CONTENT_TYPE_FAILURE;
}

export interface SELECT_BOX_TYPE {
  type: typeof BoxFilters.SELECT_BOX_TYPE;
  payload: BoxFiltersState['selected']['boxType'];
}

export interface SELECT_BOX_CONTENT_TYPE {
  type: typeof BoxFilters.SELECT_BOX_CONTENT_TYPE;
  payload: BoxFiltersState['selected']['boxContentType'];
}

export type BoxFiltersActionTypes =
  | FETCHING
  | GET_FILTER_BOX_TYPE_SUCCESS
  | GET_FILTER_BOX_TYPE_FAILURE
  | GET_FILTER_BOX_CONTENT_TYPE_SUCCESS
  | GET_FILTER_BOX_CONTENT_TYPE_FAILURE
  | SELECT_BOX_TYPE
  | SELECT_BOX_CONTENT_TYPE;
