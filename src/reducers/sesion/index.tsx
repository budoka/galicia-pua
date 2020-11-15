import { SesionAction, SesionActionTypes, SesionState } from 'src/actions/sesion/types';

const initialState: SesionState = { isRunning: false };

export default function reducer(state = initialState, action: SesionActionTypes): SesionState {
  switch (action.type) {
    case SesionAction.RUNNING:
      return {
        ...state,
        isRunning: true,
      };

    case SesionAction.GET_DATA_SUCCESS:
      return {
        ...state,
        isRunning: false,
        infoSesion: action.infoSesion,
      };

    case SesionAction.GET_DATA_FAILURE:
      return {
        ...state,
        isRunning: false,
        infoSesion: undefined,
      };
    default:
      return state;
  }
}
