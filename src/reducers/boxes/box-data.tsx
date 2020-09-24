import _ from 'lodash';
import { BoxData, BoxDataActionTypes, BoxDataState } from 'src/actions/boxes/box-data/types';

const initialState: BoxDataState = {
  isFetching: false,
  dataSet: { content: [] },
};

export default function reducer(state = initialState, action: BoxDataActionTypes): BoxDataState {
  switch (action.type) {
    case BoxData.FETCHING:
      return {
        ...state,
        isFetching: true,
      };

    case BoxData.GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        dataSet: { ...action.payload },
      };

    case BoxData.GET_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case BoxData.CREATE:
      return {
        ...state,
        dataSet: { content: [...state.dataSet.content, action.payload] },
      };

    case BoxData.CLEAN:
      return {
        ...state,
        dataSet: { content: state.dataSet.content.filter((e) => _.size(e) > 1) },
      };

    case BoxData.ADD_SUCCESS:
      return {
        ...state,
        dataSet: {
          content: state.dataSet.content.map((element, index, array) => {
            if (array.length - 1 === index) return action.payload;
            else return element;
          }),
        },
      };

    case BoxData.ADD_FAILURE:
      return {
        ...state,
        dataSet: { content: state.dataSet.content.slice(0, -1) },
      };

    case BoxData.UPDATE_SUCCESS:
      return {
        ...state,
        dataSet: {
          content: state.dataSet.content.map((element) => {
            if (element.id === action.payload.id) return action.payload;
            else return element;
          }),
        },
      };

    case BoxData.REMOVE_SUCCESS:
      return {
        ...state,
        dataSet: { content: _.reject(state.dataSet.content, (e) => _.includes(action.payload, e.id)) },
      };

    default:
      return state;
  }
}
