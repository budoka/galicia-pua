import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import cajas from 'src/reducers/cajas';
import configuracion from 'src/reducers/configuracion';
import sesion from 'src/reducers/sesion';

const reducers = {
  cajas,
  configuracion,
  sesion,
};

export const createRootReducer = (history: History) => {
  return combineReducers({
    ...reducers,
    router: connectRouter(history),
  });
};

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
