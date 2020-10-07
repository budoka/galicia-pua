import _ from 'lodash';
import { BoxFilters, BoxFiltersActionTypes, BoxFiltersState } from 'src/actions/boxes/box-filters/types';

const initialState: BoxFiltersState = {
  isRunning: false,
  filter: { boxTypes: [], boxContentTypes: [], detailTemplates: [] },
  selected: { boxType: null, boxContentType: null, detailTemplate: null },
};

export default function reducer(state = initialState, action: BoxFiltersActionTypes): BoxFiltersState {
  switch (action.type) {
    case BoxFilters.RUNNING:
      return {
        ...state,
        isRunning: true,
      };

    case BoxFilters.GET_FILTER_BOX_TYPE_SUCCESS:
      return {
        ...state,
        isRunning: false,
        filter: { ...state.filter, boxTypes: action.payload },
      };

    case BoxFilters.GET_FILTER_BOX_TYPE_FAILURE:
      return {
        ...state,
        isRunning: false,
      };

    case BoxFilters.GET_FILTER_BOX_CONTENT_TYPE_SUCCESS:
      return {
        ...state,
        isRunning: false,
        filter: { ...state.filter, boxContentTypes: action.payload },
      };

    case BoxFilters.GET_FILTER_BOX_CONTENT_TYPE_FAILURE:
      return {
        ...state,
        isRunning: false,
      };

    case BoxFilters.GET_FILTER_DETAIL_TEMPLATE_SUCCESS:
      return {
        ...state,
        isRunning: false,
        filter: { ...state.filter, detailTemplates: action.payload },
      };

    case BoxFilters.GET_FILTER_DETAIL_TEMPLATE_FAILURE:
      return {
        ...state,
        isRunning: false,
      };

    case BoxFilters.SELECT_BOX_TYPE:
      return {
        ...state,
        selected: { ...state.selected, boxType: action.payload, boxContentType: null, detailTemplate: null },
      };

    case BoxFilters.SELECT_BOX_CONTENT_TYPE:
      return {
        ...state,
        selected: { ...state.selected, boxContentType: action.payload, detailTemplate: null },
      };

    case BoxFilters.SELECT_DETAIL_TEMPLATE:
      return {
        ...state,
        selected: { ...state.selected, detailTemplate: action.payload },
      };

    default:
      return state;
  }
}
