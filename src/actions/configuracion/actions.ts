import { ConfiguracionAction, ConfiguracionActionTypes, ConfiguracionState } from './types';

export const setDevice = (device: ConfiguracionState['device']) => (
  dispatch: (arg: ConfiguracionActionTypes) => ConfiguracionActionTypes,
) => {
  dispatch({ type: ConfiguracionAction.DEVICE_CHANGE, device: device });
};

export const setOrientation = (orientation: ConfiguracionState['orientation']) => (
  dispatch: (arg: ConfiguracionActionTypes) => ConfiguracionActionTypes,
) => {
  dispatch({ type: ConfiguracionAction.ORIENTATION_CHANGE, orientation });
};

export const setCollapsed = (collapsed: ConfiguracionState['collapsed']) => (
  dispatch: (arg: ConfiguracionActionTypes) => ConfiguracionActionTypes,
) => {
  dispatch(success());

  function success(): ConfiguracionActionTypes {
    return { type: ConfiguracionAction.SIDER_COLLAPSED, collapsed };
  }
};

export const setForcedCollapsed = (forcedCollapsed: ConfiguracionState['forcedCollapsed']) => (
  dispatch: (arg: ConfiguracionActionTypes) => ConfiguracionActionTypes,
) => {
  dispatch(success());

  function success(): ConfiguracionActionTypes {
    return { type: ConfiguracionAction.SIDER_FORCED_COLLAPSED, forcedCollapsed };
  }
};

export const setButtonVisible = (buttonVisible: ConfiguracionState['buttonVisible']) => (
  dispatch: (arg: ConfiguracionActionTypes) => ConfiguracionActionTypes,
) => {
  dispatch({ type: ConfiguracionAction.SIDER_BUTTON_VISIBILITY, buttonVisible });
};

export const setOpenMenu = (openMenu?: ConfiguracionState['openMenu']) => (
  dispatch: (arg: ConfiguracionActionTypes) => ConfiguracionActionTypes,
) => {
  dispatch({ type: ConfiguracionAction.SIDER_OPEN_MENU, openMenu });
};
