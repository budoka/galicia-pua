import { ThunkResult } from 'src/actions';
import { FiltrosCajasPendientesAction, FiltrosCajasPendientesState } from '.';

export const setFiltrosCajasPendientes = (filtros: FiltrosCajasPendientesState): ThunkResult => (dispatch, getState) => {
  dispatch({ type: FiltrosCajasPendientesAction.SET_FILTROS, filtros });
};
