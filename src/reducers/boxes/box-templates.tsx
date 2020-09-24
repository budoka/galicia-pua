import { BoxTemplates, BoxTemplatesActionTypes, BoxTemplatesState } from 'src/actions/boxes/box-templates/types';

const initialState: BoxTemplatesState = {
  isFetching: false,
  template: { id: -1, columnsTemplate: [] },
};

export default function reducer(state = initialState, action: BoxTemplatesActionTypes): BoxTemplatesState {
  switch (action.type) {
    case BoxTemplates.FETCHING:
      return {
        ...state,
        isFetching: true,
      };

    case BoxTemplates.GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        template: action.payload,
      };

    case BoxTemplates.GET_FAILURE:
      return {
        ...state,
        isFetching: false,
        template: { id: -1, columnsTemplate: [] },
      };

    default:
      return state;
  }
}
