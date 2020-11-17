import {
  FiltrosCajasPendientesAction,
  FiltrosCajasPendientesActionTypes,
  FiltrosCajasPendientesState,
} from 'src/actions/cajas/caja-pendientes-filtros';

const initialState: FiltrosCajasPendientesState = {};

export default function reducer(state = initialState, action: FiltrosCajasPendientesActionTypes): FiltrosCajasPendientesState {
  switch (action.type) {
    case FiltrosCajasPendientesAction.SET_FILTROS:
      return {
        ...state,
        ...action.filtros,
      };

    default:
      return state;
  }
}
