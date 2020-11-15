import { PreviewCajaAction, PreviewCajaState, PreviewCajaActionTypes } from 'src/actions/cajas/caja-preview/types';

const initialState: PreviewCajaState = {
  isRunning: false,
  preview: [],
  //  id: null,
  //  columnsTemplate: []
};

export default function reducer(state = initialState, action: PreviewCajaActionTypes): PreviewCajaState {
  switch (action.type) {
    case PreviewCajaAction.RUNNING:
      return {
        ...state,
        isRunning: true,
      };

    case PreviewCajaAction.GET_DATA_SUCCESS:
      return {
        ...state,
        isRunning: false,
        preview: action.preview,
      };

    case PreviewCajaAction.GET_DATA_FAILURE:
      return {
        ...state,
        isRunning: false,
      };

    case PreviewCajaAction.CLEAR:
      return {
        ...state,
        isRunning: false,
        preview: [],
      };

    default:
      return state;
  }
}
