import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from '@reduxjs/toolkit';
import cajas from 'src/reducers/cajas';
import configuracionReducer from 'src/features/configuracion/configuracion.slice';
import cajasPendientesReducer from 'src/features/cajas-pendientes/cajas-pendientes.slice';
import sesionReducer from 'src/features/sesion/sesion.slice';

const reducers = {
  cajas,
  configuracion: configuracionReducer,
  sesion: sesionReducer,
  cajasPendientes: cajasPendientesReducer,
};

export const createRootReducer = (history: History) => {
  return combineReducers({
    ...reducers,
    router: connectRouter(history),
  });
};

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
//export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
