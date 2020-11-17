import { combineReducers } from 'redux';
//import contenido from 'src/reducers/cajas/caja-contenido.tsx_';
import filtros from 'src/reducers/cajas/caja-filtros';
import info from 'src/reducers/cajas/caja-info';
import preview from 'src/reducers/cajas/caja-preview';
import pendientes from 'src/reducers/cajas/caja-pendientes';
import filtrosPendientes from 'src/reducers/cajas/caja-pendientes-filtros';

const reducers = {
  //contenido,
  filtrosPendientes,
  pendientes,
  filtros,
  info,
  preview,
};

export default combineReducers({
  ...reducers,
});
