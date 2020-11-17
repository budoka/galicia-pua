// Action

import { FiltrosCajas } from 'src/views/cajas/cajas/filtros';

export enum FiltrosCajasPendientesAction {
  SET_FILTROS = 'FiltroCajasPendientesAction/SET_FILTERS',
}

// State

export type FiltrosCajasPendientesState = FiltrosCajas;

export interface SET_FILTROS {
  type: typeof FiltrosCajasPendientesAction.SET_FILTROS;
  filtros: FiltrosCajasPendientesState;
}

export type FiltrosCajasPendientesActionTypes = SET_FILTROS;
