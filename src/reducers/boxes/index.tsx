import { combineReducers } from 'redux';
import data from 'src/reducers/boxes/box-data';
import filters from 'src/reducers/boxes/box-filters';
import templates from 'src/reducers/boxes/box-templates';

const reducers = {
  filters,
  templates,
  data,
};

export default combineReducers({
  ...reducers,
});
