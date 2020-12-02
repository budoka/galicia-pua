import { combineReducers } from '@reduxjs/toolkit';

import cajasPendientesReducer from 'src/features/cajas/cajas-pendientes/cajas-pendientes.slice';
import ingresarCajasReducer from 'src/features/cajas/ingresar-caja/ingresar-caja.slice';
import editarCajasReducer from 'src/features/cajas/editar-caja/editar-caja.slice';

const reducers = {
  pendientes: cajasPendientesReducer,
  creacion: ingresarCajasReducer,
  edicion: editarCajasReducer,
};

export default combineReducers({
  ...reducers,
});
