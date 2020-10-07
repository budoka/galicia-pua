import _ from 'lodash';
import { act } from 'react-dom/test-utils';
import { BoxData, BoxDataActionTypes, BoxDataState } from 'src/actions/boxes/box-data/types';

const initialState: BoxDataState = {
  isRunning: false,
  id: null,
  info: null,
  content: [],
};

export default function reducer(state = initialState, action: BoxDataActionTypes): BoxDataState {
  switch (action.type) {
    case BoxData.RUNNING:
      return {
        ...state,
        isRunning: true,
      };

    case BoxData.GET_BOX_SUCCESS:
      return {
        ...state,
        isRunning: false,
        info: { ...action.payload.info! },
        content: { ...action.payload.content },
      };

    case BoxData.GET_BOX_FAILURE:
      return {
        ...state,
        isRunning: false,
      };

    case BoxData.CREATE_BOX_SUCCESS:
      return {
        ...state,
        id: action.payload.id,
        info: action.payload.info,
      };

    case BoxData.CREATE_BOX_FAILURE:
      return {
        ...state,
      };

    case BoxData.CREATE_LOCAL_CONTENT:
      return {
        ...state,
        content: [...state.content, action.payload],
      };

    case BoxData.CLEAN_LOCAL_CONTENT:
      return {
        ...state,
        content: state.content.filter((e) => _.size(e) > 1),
      };

    case BoxData.ADD_CONTENT_SUCCESS:
      return {
        ...state,
        content: state.content.map((element, index, array) => {
          if (array.length - 1 === index) return action.payload;
          else return element;
        }),
      };

    case BoxData.ADD_CONTENT_FAILURE:
      return {
        ...state,
        content: state.content.slice(0, -1),
      };

    case BoxData.UPDATE_CONTENT_SUCCESS:
      return {
        ...state,
        content: state.content.map((element) => {
          if (element.id === action.payload.id) return action.payload;
          else return element;
        }),
      };

    case BoxData.REMOVE_CONTENT_SUCCESS:
      return {
        ...state,
        //content: _.reject(state.content, (e) => _.includes(action.payload, e.id)),
      };

    default:
      return state;
  }
}
