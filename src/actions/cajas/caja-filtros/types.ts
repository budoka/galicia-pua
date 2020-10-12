import { RunnableState } from 'src/actions/interfaces';
import { FiltroTipoPlantillaResponse, FiltroTipoCajaResponse, FiltroTipoContenidoCajaResponse, Elemento } from './interfaces';

export enum FiltrosCajaAction {
  RUNNING_FILTER = 'FiltrosCajaAction/RUNNING_FILTER',

  GET_FILTER_BOX_TYPE_SUCCESS = 'FiltrosCajaAction/GET_FILTER_BOX_TYPE_SUCCESS',
  GET_FILTER_BOX_TYPE_FAILURE = 'FiltrosCajaAction/GET_FILTER_BOX_TYPE_FAILURE',

  GET_FILTER_BOX_CONTENT_TYPE_SUCCESS = 'FiltrosCajaAction/GET_FILTER_BOX_CONTENT_TYPE_SUCCESS',
  GET_FILTER_BOX_CONTENT_TYPE_FAILURE = 'FiltrosCajaAction/GET_FILTER_BOX_CONTENT_TYPE_FAILURE',

  GET_FILTER_DETAIL_TEMPLATE_SUCCESS = 'FiltrosCajaAction/GET_FILTER_DETAIL_TEMPLATE_SUCCESS',
  GET_FILTER_DETAIL_TEMPLATE_FAILURE = 'FiltrosCajaAction/GET_FILTER_DETAIL_TEMPLATE_FAILURE',

  SELECT_BOX_TYPE = 'FiltrosCajaAction/SELECT_BOX_TYPE',
  SELECT_BOX_CONTENT_TYPE = 'FiltrosCajaAction/SELECT_BOX_CONTENT_TYPE',
  SELECT_DETAIL_TEMPLATE = 'FiltrosCajaAction/SELECT_DETAIL_TEMPLATE',
}

export interface FiltrosCajaState extends RunnableState {
  filtro: {
    /* tiposCaja: FiltroTipoCajaResponse[];
    tiposContenidoCaja: FiltroTipoContenidoCajaResponse[];
    tiposPlantilla: FiltroTipoPlantillaResponse[];*/
    tiposCaja: Elemento[];
    tiposContenidoCaja: Elemento[];
    tiposPlantilla: Elemento[];
  };
  seleccionado: {
    tipoCaja: Elemento | null;
    tipoContenidoCaja: Elemento | null;
    tipoPlantilla: Elemento | null;
    /* tipoCaja: FiltroTipoCajaResponse | null;
    tipoContenidoCaja: FiltroTipoContenidoCajaResponse | null;
    tipoPlantilla: FiltroTipoPlantillaResponse | null;*/
  };
}

export interface RUNNING_FILTER {
  type: typeof FiltrosCajaAction.RUNNING_FILTER;
  isRunning: FiltrosCajaState['isRunning'];
}

export interface GET_FILTER_BOX_TYPE_SUCCESS {
  type: typeof FiltrosCajaAction.GET_FILTER_BOX_TYPE_SUCCESS;
  tiposCaja: FiltrosCajaState['filtro']['tiposCaja'];
}

export interface GET_FILTER_BOX_TYPE_FAILURE {
  type: typeof FiltrosCajaAction.GET_FILTER_BOX_TYPE_FAILURE;
}

export interface GET_FILTER_BOX_CONTENT_TYPE_SUCCESS {
  type: typeof FiltrosCajaAction.GET_FILTER_BOX_CONTENT_TYPE_SUCCESS;
  tiposContenidoCaja: FiltrosCajaState['filtro']['tiposContenidoCaja'];
}

export interface GET_FILTER_BOX_CONTENT_TYPE_FAILURE {
  type: typeof FiltrosCajaAction.GET_FILTER_BOX_CONTENT_TYPE_FAILURE;
}

export interface GET_FILTER_DETAIL_TEMPLATE_SUCCESS {
  type: typeof FiltrosCajaAction.GET_FILTER_DETAIL_TEMPLATE_SUCCESS;
  previews: FiltrosCajaState['filtro']['tiposPlantilla'];
}

export interface GET_FILTER_DETAIL_TEMPLATE_FAILURE {
  type: typeof FiltrosCajaAction.GET_FILTER_DETAIL_TEMPLATE_FAILURE;
}

export interface SELECT_BOX_TYPE {
  type: typeof FiltrosCajaAction.SELECT_BOX_TYPE;
  tipoCaja: FiltrosCajaState['seleccionado']['tipoCaja'];
}

export interface SELECT_BOX_CONTENT_TYPE {
  type: typeof FiltrosCajaAction.SELECT_BOX_CONTENT_TYPE;
  tipoContenidoCaja: FiltrosCajaState['seleccionado']['tipoContenidoCaja'];
}

export interface SELECT_DETAIL_TEMPLATE {
  type: typeof FiltrosCajaAction.SELECT_DETAIL_TEMPLATE;
  preview: FiltrosCajaState['seleccionado']['tipoPlantilla'];
}

export type FiltrosCajaActionTypes =
  | RUNNING_FILTER
  | GET_FILTER_BOX_TYPE_SUCCESS
  | GET_FILTER_BOX_TYPE_FAILURE
  | GET_FILTER_BOX_CONTENT_TYPE_SUCCESS
  | GET_FILTER_BOX_CONTENT_TYPE_FAILURE
  | GET_FILTER_DETAIL_TEMPLATE_SUCCESS
  | GET_FILTER_DETAIL_TEMPLATE_FAILURE
  | SELECT_BOX_TYPE
  | SELECT_BOX_CONTENT_TYPE
  | SELECT_DETAIL_TEMPLATE;
