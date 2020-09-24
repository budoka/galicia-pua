import _ from 'lodash';
import { BoxFilters, BoxFiltersActionTypes, BoxFiltersState } from 'src/actions/boxes/box-filters/types';

const initialState: BoxFiltersState = {
  isFetching: false,
  filter: { boxTypes: [], boxContentTypes: [] },
  selected: { boxType: null, boxContentType: null },
};

export default function reducer(state = initialState, action: BoxFiltersActionTypes): BoxFiltersState {
  switch (action.type) {
    case BoxFilters.FETCHING:
      return {
        ...state,
        isFetching: true,
      };

    case BoxFilters.GET_FILTER_BOX_TYPE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        filter: { ...state.filter, boxTypes: action.payload },
      };

    case BoxFilters.GET_FILTER_BOX_TYPE_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case BoxFilters.GET_FILTER_BOX_CONTENT_TYPE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        filter: { ...state.filter, boxContentTypes: action.payload },
      };

    case BoxFilters.GET_FILTER_BOX_CONTENT_TYPE_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case BoxFilters.SELECT_BOX_TYPE:
      return {
        ...state,
        selected: { ...state.selected, boxType: action.payload },
      };

    case BoxFilters.SELECT_BOX_CONTENT_TYPE:
      return {
        ...state,
        selected: { ...state.selected, boxContentType: action.payload },
      };

    default:
      return state;
  }
}
