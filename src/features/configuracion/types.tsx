import { Device } from 'src/utils/mobile';
import { ScreenOrientation } from 'src/utils/screen';

export interface ConfiguracionSliceState {
  environment: string;
  device: Device;
  orientation: ScreenOrientation;
}

export type { Device, ScreenOrientation };
