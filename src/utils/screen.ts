import { Size } from 'src/types';

export type ScreenOrientation = 'portrait' | 'landscape';

export function getScreenOrientation(size: Size) {
  let orientation: ScreenOrientation = 'portrait';
  if (size.width > size.height) orientation = 'landscape';
  return orientation;
}
