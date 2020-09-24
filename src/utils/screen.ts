import { Size } from 'src/interfaces';
import { ScreenOrientation } from 'src/types';

export function getScreenOrientation(size: Size) {
  let orientation: ScreenOrientation = 'portrait';
  if (size.width > size.height) orientation = 'landscape';
  return orientation;
}
