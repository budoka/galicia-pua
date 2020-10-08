import _ from 'lodash';
import { FiltrosCajaAction, FiltrosCajaState, FiltrosCajaActionTypes } from 'src/actions/cajas/caja-filtros/types';

const initialState: FiltrosCajaState = {
  isRunning: false,
  filtro: { tiposCaja: [], tiposContenidoCaja: [], tiposPlantilla: [] },
  seleccionado: { tipoCaja: null, tipoContenidoCaja: null, tipoPlantilla: null },
};

export default function reducer(state = initialState, action: FiltrosCajaActionTypes): FiltrosCajaState {
  switch (action.type) {
    case FiltrosCajaAction.RUNNING_FILTER:
      return {
        ...state,
        isRunning: true,
      };

    case FiltrosCajaAction.GET_FILTER_BOX_TYPE_SUCCESS:
      return {
        ...state,
        isRunning: false,
        filtro: { ...state.filtro, tiposCaja: action.tiposCaja },
      };

    case FiltrosCajaAction.GET_FILTER_BOX_TYPE_FAILURE:
      return {
        ...state,
        isRunning: false,
      };

    case FiltrosCajaAction.GET_FILTER_BOX_CONTENT_TYPE_SUCCESS:
      return {
        ...state,
        isRunning: false,
        filtro: { ...state.filtro, tiposContenidoCaja: action.tiposContenidoCaja },
      };

    case FiltrosCajaAction.GET_FILTER_BOX_CONTENT_TYPE_FAILURE:
      return {
        ...state,
        isRunning: false,
      };

    case FiltrosCajaAction.GET_FILTER_DETAIL_TEMPLATE_SUCCESS:
      return {
        ...state,
        isRunning: false,
        filtro: { ...state.filtro, tiposPlantilla: action.previews },
      };

    case FiltrosCajaAction.GET_FILTER_DETAIL_TEMPLATE_FAILURE:
      return {
        ...state,
        isRunning: false,
      };

    case FiltrosCajaAction.SELECT_BOX_TYPE:
      return {
        ...state,
        seleccionado: { ...state.seleccionado, tipoCaja: action.tipoCaja, tipoContenidoCaja: null, tipoPlantilla: null },
      };

    case FiltrosCajaAction.SELECT_BOX_CONTENT_TYPE:
      return {
        ...state,
        seleccionado: { ...state.seleccionado, tipoContenidoCaja: action.tipoContenidoCaja, tipoPlantilla: null },
      };

    case FiltrosCajaAction.SELECT_DETAIL_TEMPLATE:
      return {
        ...state,
        seleccionado: { ...state.seleccionado, tipoPlantilla: action.preview },
      };

    default:
      return state;
  }
}
