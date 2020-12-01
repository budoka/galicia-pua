import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from '@reduxjs/toolkit';
import cajas from 'src/reducers/cajas';
import configuracionReducer from 'src/features/configuracion/configuracion.slice';
import menuReducer from 'src/features/menu/menu.slice';
import cajasPendientesReducer from 'src/features/cajas/cajas-pendientes/cajas-pendientes.slice';
import ingresarCajasReducer from 'src/features/cajas/ingresar-caja/ingresar-caja.slice';
import editarCajasReducer from 'src/features/cajas/editar-caja/editar-caja.slice';
import sesionReducer from 'src/features/sesion/sesion.slice';

const reducers = {
  cajas,
  configuracion: configuracionReducer,
  menu: menuReducer,
  sesion: sesionReducer,
  cajasPendientes: cajasPendientesReducer,
  ingresarCajas: ingresarCajasReducer,
  editarCajas: editarCajasReducer,
};

export const createRootReducer = (history: History) => {
  return combineReducers({
    ...reducers,
    router: connectRouter(history),
  });
};

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
//export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
