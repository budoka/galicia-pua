import { RunnableState } from 'src/actions/interfaces';
import { BoxContentTypeFilter, BoxTypeFilter, DetailTemplateFilter } from './interfaces';

export enum BoxFilters {
  RUNNING = 'BoxFilters/RUNNING',

  GET_FILTER_BOX_TYPE_SUCCESS = 'BoxFilters/GET_FILTER_BOX_TYPE_SUCCESS',
  GET_FILTER_BOX_TYPE_FAILURE = 'BoxFilters/GET_FILTER_BOX_TYPE_FAILURE',

  GET_FILTER_BOX_CONTENT_TYPE_SUCCESS = 'BoxFilters/GET_FILTER_BOX_CONTENT_TYPE_SUCCESS',
  GET_FILTER_BOX_CONTENT_TYPE_FAILURE = 'BoxFilters/GET_FILTER_BOX_CONTENT_TYPE_FAILURE',

  GET_FILTER_DETAIL_TEMPLATE_SUCCESS = 'BoxFilters/GET_FILTER_DETAIL_TEMPLATE_SUCCESS',
  GET_FILTER_DETAIL_TEMPLATE_FAILURE = 'BoxFilters/GET_FILTER_DETAIL_TEMPLATE_FAILURE',

  SELECT_BOX_TYPE = 'BoxFilters/SELECT_BOX_TYPE',
  SELECT_BOX_CONTENT_TYPE = 'BoxFilters/SELECT_BOX_CONTENT_TYPE',
  SELECT_DETAIL_TEMPLATE = 'BoxFilters/SELECT_DETAIL_TEMPLATE',
}

export interface BoxFiltersState extends RunnableState {
  filter: {
    boxTypes: BoxTypeFilter[];
    boxContentTypes: BoxContentTypeFilter[];
    detailTemplates: DetailTemplateFilter[];
  };
  selected: {
    boxType: BoxTypeFilter | null;
    boxContentType: BoxContentTypeFilter | null;
    detailTemplate: DetailTemplateFilter | null;
  };
}

export interface RUNNING {
  type: typeof BoxFilters.RUNNING;
  payload: BoxFiltersState['isRunning'];
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

export interface GET_FILTER_DETAIL_TEMPLATE_SUCCESS {
  type: typeof BoxFilters.GET_FILTER_DETAIL_TEMPLATE_SUCCESS;
  payload: BoxFiltersState['filter']['detailTemplates'];
}

export interface GET_FILTER_DETAIL_TEMPLATE_FAILURE {
  type: typeof BoxFilters.GET_FILTER_DETAIL_TEMPLATE_FAILURE;
}

export interface SELECT_BOX_TYPE {
  type: typeof BoxFilters.SELECT_BOX_TYPE;
  payload: BoxFiltersState['selected']['boxType'];
}

export interface SELECT_BOX_CONTENT_TYPE {
  type: typeof BoxFilters.SELECT_BOX_CONTENT_TYPE;
  payload: BoxFiltersState['selected']['boxContentType'];
}

export interface SELECT_DETAIL_TEMPLATE {
  type: typeof BoxFilters.SELECT_DETAIL_TEMPLATE;
  payload: BoxFiltersState['selected']['detailTemplate'];
}

export type BoxFiltersActionTypes =
  | RUNNING
  | GET_FILTER_BOX_TYPE_SUCCESS
  | GET_FILTER_BOX_TYPE_FAILURE
  | GET_FILTER_BOX_CONTENT_TYPE_SUCCESS
  | GET_FILTER_BOX_CONTENT_TYPE_FAILURE
  | GET_FILTER_DETAIL_TEMPLATE_SUCCESS
  | GET_FILTER_DETAIL_TEMPLATE_FAILURE
  | SELECT_BOX_TYPE
  | SELECT_BOX_CONTENT_TYPE
  | SELECT_DETAIL_TEMPLATE;
