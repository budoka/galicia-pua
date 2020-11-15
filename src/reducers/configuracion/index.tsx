import { ConfiguracionAction, ConfiguracionActionTypes, ConfiguracionState } from 'src/actions/configuracion/types';
import { getDeviceType, isMobile } from 'src/utils/mobile';
import { getScreenOrientation } from 'src/utils/screen';

const initialState: ConfiguracionState = {
  device: getDeviceType(),
  orientation: getScreenOrientation({ width: window.innerWidth, height: window.innerHeight }),
  collapsed: false,
  forcedCollapsed: false,
  buttonVisible: true,
  openMenu: undefined,
};

export default function reducer(state = initialState, action: ConfiguracionActionTypes): ConfiguracionState {
  switch (action.type) {
    case ConfiguracionAction.DEVICE_CHANGE:
      return {
        ...state,
        device: action.device,
      };
    case ConfiguracionAction.ORIENTATION_CHANGE:
      return {
        ...state,
        orientation: action.orientation,
      };
    case ConfiguracionAction.SIDER_COLLAPSED:
      return {
        ...state,
        collapsed: action.collapsed,
      };
    case ConfiguracionAction.SIDER_FORCED_COLLAPSED:
      return {
        ...state,
        // collapsed: action.forcedCollapsed,
        forcedCollapsed: action.forcedCollapsed,
      };
    case ConfiguracionAction.SIDER_BUTTON_VISIBILITY:
      return {
        ...state,
        buttonVisible: action.buttonVisible,
      };
    case ConfiguracionAction.SIDER_OPEN_MENU:
      return {
        ...state,
        openMenu: action.openMenu,
      };
    default:
      return state;
  }
}
