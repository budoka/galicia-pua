import _ from 'lodash';
import { act } from 'react-dom/test-utils';
import { InfoCajaAction, InfoCajaState, InfoCajaActionTypes } from 'src/actions/cajas/caja-info/types';

const initialState: InfoCajaState = {
  isRunning: false,
  id: null,
  info: null,
  contenido: [],
};

export default function reducer(state = initialState, action: InfoCajaActionTypes): InfoCajaState {
  switch (action.type) {
    case InfoCajaAction.RUNNING:
      return {
        ...state,
        isRunning: true,
      };

    case InfoCajaAction.GET_BOX_SUCCESS:
      return {
        ...state,
        isRunning: false,
        info: { ...action.caja.info! },
        contenido: { ...action.caja.contenido },
      };

    case InfoCajaAction.GET_BOX_FAILURE:
      return {
        ...state,
        isRunning: false,
      };

    case InfoCajaAction.CREATE_BOX_SUCCESS:
      return {
        ...state,
        id: action.caja.id,
        info: action.caja.info,
      };

    case InfoCajaAction.CREATE_BOX_FAILURE:
      return {
        ...state,
      };

    case InfoCajaAction.CREATE_LOCAL_CONTENT:
      return {
        ...state,
        contenido: [...state.contenido, action.contenido],
      };

    case InfoCajaAction.CLEAN_LOCAL_CONTENT:
      return {
        ...state,
        contenido: state.contenido.filter((e) => _.size(e) > 1),
      };

    case InfoCajaAction.ADD_CONTENT_SUCCESS:
      return {
        ...state,
        contenido: state.contenido.map((element, index, array) => {
          if (array.length - 1 === index) return action.contenido;
          else return element;
        }),
      };

    case InfoCajaAction.ADD_CONTENT_FAILURE:
      return {
        ...state,
        contenido: state.contenido.slice(0, -1),
      };

    case InfoCajaAction.UPDATE_CONTENT_SUCCESS:
      return {
        ...state,
        contenido: state.contenido.map((element) => {
          if (element.id === action.contenido.id) return action.contenido;
          else return element;
        }),
      };

    case InfoCajaAction.REMOVE_CONTENT_SUCCESS:
      return {
        ...state,
        // contenido: _.reject(state.contenido, (e) => _.includes(action.payload, e.id)),
      };

    default:
      return state;
  }
}
