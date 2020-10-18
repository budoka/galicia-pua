import { Device, ScreenOrientation } from 'src/types';

export enum Settings {
  DEVICE_CHANGE = 'Site/DEVICE_CHANGE',
  ORIENTATION_CHANGE = 'Site/ORIENTATION_CHANGE',
  SIDER_COLLAPSED = 'Site/SIDER_COLLAPSED',
  SIDER_FORCED_COLLAPSED = 'Site/SIDER_FORCED_COLLAPSED',
  SIDER_BUTTON_VISIBILITY = 'Site/SIDER_BUTTON_VISIBILITY',
  SIDER_OPEN_MENU = 'Site/SIDER_OPEN_MENU',
}

export interface SettingsState {
  device: Device;
  orientation: ScreenOrientation;
  collapsed: boolean;
  forcedCollapsed: boolean;
  buttonVisible: boolean;
  openMenu?: string;
}

export interface DEVICE_CHANGE {
  type: typeof Settings.DEVICE_CHANGE;
  device: SettingsState['device'];
}

export interface ORIENTATION_CHANGE {
  type: typeof Settings.ORIENTATION_CHANGE;
  orientation: SettingsState['orientation'];
}

export interface SIDER_COLLAPSED {
  type: typeof Settings.SIDER_COLLAPSED;
  collapsed?: SettingsState['collapsed'];
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
  buttonVisible: SettingsState['buttonVisible'];
}

export interface SIDER_OPEN_MENU {
  type: typeof Settings.SIDER_OPEN_MENU;
  openMenu: SettingsState['openMenu'];
}

export type SettingsActionTypes =
  | DEVICE_CHANGE
  | ORIENTATION_CHANGE
  | SIDER_COLLAPSED
  | SIDER_FORCED_COLLAPSED
  | SIDER_BUTTON_VISIBLED
  | SIDER_OPEN_MENU;
