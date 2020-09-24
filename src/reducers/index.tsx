import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import boxes from 'src/reducers/boxes';
import settings from 'src/reducers/settings';

const reducers = {
  boxes,
  settings,
};

export const createRootReducer = (history: History) => {
  return combineReducers({
    ...reducers,
    router: connectRouter(history),
  });
};

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>;
