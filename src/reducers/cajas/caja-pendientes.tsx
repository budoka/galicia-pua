import { CajasPendientesAction, CajasPendientesActionTypes, CajasPendientesState } from 'src/actions/cajas/caja-pendientes/types';

const initialState: CajasPendientesState = {
  isRunning: false,
  detallesCaja: [],
};

export default function reducer(state = initialState, action: CajasPendientesActionTypes): CajasPendientesState {
  switch (action.type) {
    case CajasPendientesAction.RUNNING:
      return {
        ...state,
        isRunning: true,
      };

    case CajasPendientesAction.CLEAR_DATA:
      return {
        ...state,
        detallesCaja: [],
      };

    case CajasPendientesAction.GET_DATA_SUCCESS:
      return {
        ...state,
        isRunning: false,
        detallesCaja: action.detallesCaja,
      };

    case CajasPendientesAction.GET_DATA_FAILURE:
      return {
        ...state,
        isRunning: false,
        detallesCaja: [],
      };

    default:
      return state;
  }
}
