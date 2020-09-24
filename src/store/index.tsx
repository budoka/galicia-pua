import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { createRootReducer } from 'src/reducers';

export const history = createBrowserHistory();

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['boxes', 'settings'],
};

const persistedReducer = persistReducer(persistConfig, createRootReducer(history));

const composeEnhancers = composeWithDevTools({});

export const store = createStore(
  persistedReducer, // root reducer with router state
  composeEnhancers(
    applyMiddleware(
      thunk,
      routerMiddleware(history), // for dispatching history actions
      // ... other middlewares ...
    ),
  ),
);

export const persistor = persistStore(store);
