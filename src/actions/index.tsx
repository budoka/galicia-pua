import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from 'src/reducers';

export type ThunkResult<R = void> = ThunkAction<R, RootState, unknown, Action<string>>;
export type AsyncThunkResult<R = Promise<any>> = ThunkAction<R, RootState, unknown, Action<string>>;
export type AppDispatch = ThunkDispatch<RootState, unknown, Action>;
