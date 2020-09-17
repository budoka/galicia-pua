import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';

import settings from './settings/reducer';

const reducers = {
  settings,
};

export const createRootReducer = (history: History) => {
  return combineReducers({
    ...reducers,
    router: connectRouter(history),
  });
};

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
