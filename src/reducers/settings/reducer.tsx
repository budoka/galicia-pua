import { Settings, SettingsActionTypes, SettingsState } from 'src/actions/settings/types';

const initialState: SettingsState = {
  collapsed: false,
  forcedCollapsed: false,
  orientation: undefined,
};

export default function reducer(state = initialState, action: SettingsActionTypes): SettingsState {
  switch (action.type) {
    case Settings.SIDER_COLLAPSED:
      return {
        ...state,
        collapsed: action.payload || state.collapsed,
      };

    case Settings.SIDER_FORCE_COLLAPSED:
      return {
        ...state,
        collapsed: action.payload,
        forcedCollapsed: action.payload,
      };

    case Settings.ORIENTATION_CHANGE:
      return {
        ...state,
        orientation: action.payload,
      };

    default:
      return state;
  }
}
