import { Device, ScreenOrientation } from 'src/types';

export enum ConfiguracionAction {
  DEVICE_CHANGE = 'ConfiguracionAction/DEVICE_CHANGE',
  ORIENTATION_CHANGE = 'ConfiguracionAction/ORIENTATION_CHANGE',
  SIDER_COLLAPSED = 'ConfiguracionAction/SIDER_COLLAPSED',
  SIDER_FORCED_COLLAPSED = 'ConfiguracionAction/SIDER_FORCED_COLLAPSED',
  SIDER_BUTTON_VISIBILITY = 'ConfiguracionAction/SIDER_BUTTON_VISIBILITY',
  SIDER_OPEN_MENU = 'ConfiguracionAction/SIDER_OPEN_MENU',
}

export interface ConfiguracionState {
  device: Device;
  orientation: ScreenOrientation;
  collapsed: boolean;
  forcedCollapsed: boolean;
  buttonVisible: boolean;
  openMenu?: string;
}

export interface DEVICE_CHANGE {
  type: typeof ConfiguracionAction.DEVICE_CHANGE;
  device: ConfiguracionState['device'];
}

export interface ORIENTATION_CHANGE {
  type: typeof ConfiguracionAction.ORIENTATION_CHANGE;
  orientation: ConfiguracionState['orientation'];
}

export interface SIDER_COLLAPSED {
  type: typeof ConfiguracionAction.SIDER_COLLAPSED;
  collapsed: ConfiguracionState['collapsed'];
}

export interface SIDER_FORCED_COLLAPSED {
  type: typeof ConfiguracionAction.SIDER_FORCED_COLLAPSED;
  forcedCollapsed: ConfiguracionState['forcedCollapsed'];
}

export interface SIDER_BUTTON_VISIBLED {
  type: typeof ConfiguracionAction.SIDER_BUTTON_VISIBILITY;
  buttonVisible: ConfiguracionState['buttonVisible'];
}

export interface SIDER_OPEN_MENU {
  type: typeof ConfiguracionAction.SIDER_OPEN_MENU;
  openMenu: ConfiguracionState['openMenu'];
}

export type ConfiguracionActionTypes =
  | DEVICE_CHANGE
  | ORIENTATION_CHANGE
  | SIDER_COLLAPSED
  | SIDER_FORCED_COLLAPSED
  | SIDER_BUTTON_VISIBLED
  | SIDER_OPEN_MENU;
