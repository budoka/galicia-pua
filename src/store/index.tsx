import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
// import { applyMiddleware, createStore } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { FLUSH, PAUSE, PERSIST, PersistConfig, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
//import thunk from 'redux-thunk';
import { createRootReducer, RootState } from 'src/reducers';
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { useDispatch } from 'react-redux';

export const history = createBrowserHistory();

const persistConfig = {
  key: 'AppStore',
  storage,
  blacklist: ['cajas', 'ingresarCajas'],
} as PersistConfig<RootState>;

const persistedReducer = persistReducer(persistConfig, createRootReducer(history));

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([/* logger,  */ routerMiddleware(history)]),
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
