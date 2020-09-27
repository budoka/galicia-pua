import { Settings, SettingsActionTypes, SettingsState } from 'src/actions/settings/types';
import { getDeviceType, isMobile } from 'src/utils/mobile';
import { getScreenOrientation } from 'src/utils/screen';

const initialState: SettingsState = {
  device: getDeviceType(),
  orientation: getScreenOrientation({ width: window.innerWidth, height: window.innerHeight }),
  collapsed: false,
  forcedCollapsed: false,
  buttonVisible: true,
};

export default function reducer(state = initialState, action: SettingsActionTypes): SettingsState {
  switch (action.type) {
    case Settings.DEVICE_CHANGE:
      return {
        ...state,
        device: action.payload,
      };
    case Settings.ORIENTATION_CHANGE:
      return {
        ...state,
        orientation: action.payload,
      };
    case Settings.SIDER_COLLAPSED:
      return {
        ...state,
        collapsed: action.payload || !state.collapsed,
      };
    case Settings.SIDER_FORCED_COLLAPSED:
      return {
        ...state,
        collapsed: action.payload.collapsed ?? true,
        forcedCollapsed: action.payload.forcedCollapsed,
      };
    case Settings.SIDER_BUTTON_VISIBILITY:
      return {
        ...state,
        buttonVisible: action.payload,
      };
    default:
      return state;
  }
}
