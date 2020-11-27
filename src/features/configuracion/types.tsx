import { Device } from 'src/utils/mobile';
import { ScreenOrientation } from 'src/utils/screen';

export interface ConfiguracionSliceState {
  device: Device;
  orientation: ScreenOrientation;
  collapsed: boolean;
  forcedCollapsed: boolean;
  buttonVisible: boolean;
  openMenu?: string;
}

export type { Device, ScreenOrientation };
/* 
export type Device = 'desktop' | 'mobile' | undefined;
export type ScreenOrientation = 'portrait' | 'landscape';
 */
