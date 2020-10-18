import { Settings, SettingsActionTypes, SettingsState } from './types';

export const setDevice = (device: SettingsState['device']) => (dispatch: (arg: SettingsActionTypes) => SettingsActionTypes) => {
  dispatch({ type: Settings.DEVICE_CHANGE, device: device });
};

export const setOrientation = (orientation: SettingsState['orientation']) => (
  dispatch: (arg: SettingsActionTypes) => SettingsActionTypes,
) => {
  dispatch({ type: Settings.ORIENTATION_CHANGE, orientation });
};

export const setCollapsed = (collapsed?: SettingsState['collapsed']) => (dispatch: (arg: SettingsActionTypes) => SettingsActionTypes) => {
  dispatch(success());

  function success(): SettingsActionTypes {
    return { type: Settings.SIDER_COLLAPSED, collapsed };
  }
};

export const setForcedCollapsed = (forcedCollapsed: SettingsState['forcedCollapsed'], collapsed?: SettingsState['collapsed']) => (
  dispatch: (arg: SettingsActionTypes) => SettingsActionTypes,
) => {
  dispatch(success());

  function success(): SettingsActionTypes {
    return { type: Settings.SIDER_FORCED_COLLAPSED, payload: { forcedCollapsed, collapsed } };
  }
};

export const setButtonVisible = (buttonVisible: SettingsState['buttonVisible']) => (
  dispatch: (arg: SettingsActionTypes) => SettingsActionTypes,
) => {
  dispatch({ type: Settings.SIDER_BUTTON_VISIBILITY, buttonVisible });
};

export const setOpenMenu = (openMenu?: SettingsState['openMenu']) => (dispatch: (arg: SettingsActionTypes) => SettingsActionTypes) => {
  dispatch({ type: Settings.SIDER_OPEN_MENU, openMenu });
};
