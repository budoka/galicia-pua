import { BoxTemplates, BoxTemplatesActionTypes, BoxTemplatesState } from 'src/actions/boxes/box-templates/types';

const initialState: BoxTemplatesState = {
  isRunning: false,
  template: { id: undefined, columnsTemplate: [] },
};

export default function reducer(state = initialState, action: BoxTemplatesActionTypes): BoxTemplatesState {
  switch (action.type) {
    case BoxTemplates.RUNNING:
      return {
        ...state,
        isRunning: true,
      };

    case BoxTemplates.GET_SUCCESS:
      return {
        ...state,
        isRunning: false,
        template: action.payload,
      };

    case BoxTemplates.GET_FAILURE:
      return {
        ...state,
        isRunning: false,
      };

    case BoxTemplates.CLEAR:
      return {
        ...state,
        isRunning: false,
        template: { id: undefined, columnsTemplate: [] },
      };

    default:
      return state;
  }
}
