import { Settings, SettingsActionTypes, SettingsState } from 'src/actions/settings/types';
import { getDeviceType, isMobile } from 'src/utils/mobile';
import { getScreenOrientation } from 'src/utils/screen';

const initialState: SettingsState = {
  device: getDeviceType(),
  orientation: getScreenOrientation({ width: window.innerWidth, height: window.innerHeight }),
  collapsed: false,
  forcedCollapsed: false,
  buttonVisible: true,
  openMenu: undefined,
};

export default function reducer(state = initialState, action: SettingsActionTypes): SettingsState {
  switch (action.type) {
    case Settings.DEVICE_CHANGE:
      return {
        ...state,
        device: action.device,
      };
    case Settings.ORIENTATION_CHANGE:
      return {
        ...state,
        orientation: action.orientation,
      };
    case Settings.SIDER_COLLAPSED:
      return {
        ...state,
        collapsed: action.collapsed,
      };
    case Settings.SIDER_FORCED_COLLAPSED:
      return {
        ...state,
        // collapsed: action.forcedCollapsed,
        forcedCollapsed: action.forcedCollapsed,
      };
    case Settings.SIDER_BUTTON_VISIBILITY:
      return {
        ...state,
        buttonVisible: action.buttonVisible,
      };
    case Settings.SIDER_OPEN_MENU:
      return {
        ...state,
        openMenu: action.openMenu,
      };
    default:
      return state;
  }
}
