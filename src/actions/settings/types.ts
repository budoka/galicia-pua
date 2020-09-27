import { Device, ScreenOrientation } from 'src/types';

export enum Settings {
  DEVICE_CHANGE = 'Site/DEVICE_CHANGE',
  ORIENTATION_CHANGE = 'Site/ORIENTATION_CHANGE',
  SIDER_COLLAPSED = 'Site/SIDER_COLLAPSED',
  SIDER_FORCED_COLLAPSED = 'Site/SIDER_FORCED_COLLAPSED',
  SIDER_BUTTON_VISIBILITY = 'Site/SIDER_BUTTON_VISIBILITY',
}

export interface SettingsState {
  device: Device;
  orientation: ScreenOrientation;
  collapsed: boolean;
  forcedCollapsed: boolean;
  buttonVisible: boolean;
}

export interface DEVICE_CHANGE {
  type: typeof Settings.DEVICE_CHANGE;
  payload: SettingsState['device'];
}

export interface ORIENTATION_CHANGE {
  type: typeof Settings.ORIENTATION_CHANGE;
  payload: SettingsState['orientation'];
}

export interface SIDER_COLLAPSED {
  type: typeof Settings.SIDER_COLLAPSED;
  payload?: SettingsState['collapsed'];
}

export interface SIDER_FORCED_COLLAPSED {
  type: typeof Settings.SIDER_FORCED_COLLAPSED;
  payload: {
    forcedCollapsed: SettingsState['forcedCollapsed'];
    collapsed?: SettingsState['collapsed'];
  };
}

export interface SIDER_BUTTON_VISIBLED {
  type: typeof Settings.SIDER_BUTTON_VISIBILITY;
  payload: SettingsState['buttonVisible'];
}

export type SettingsActionTypes = DEVICE_CHANGE | ORIENTATION_CHANGE | SIDER_COLLAPSED | SIDER_FORCED_COLLAPSED | SIDER_BUTTON_VISIBLED;
