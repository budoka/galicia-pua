import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
// import { applyMiddleware, createStore } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
//import thunk from 'redux-thunk';
import { createRootReducer } from 'src/reducers';
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { useDispatch } from 'react-redux';

export const history = createBrowserHistory();

const persistConfig = {
  key: 'AppStore',
  storage,
  blacklist: ['cajas'],
} as PersistConfig<any>;

const persistedReducer = persistReducer(persistConfig, createRootReducer(history));

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([logger, routerMiddleware(history)]),
  devTools: process.env.NODE_ENV !== 'production',
  // middleware: [logger, thunk, routerMiddleware(history)]
});

/* 

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

 */
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
/* 
const dispatch = useAppDispatch();
dispatch() */
