import { Device } from 'src/types';

export function getDeviceType() {
  let device: Device = 'desktop';
  if (isMobile()) device = 'mobile';
  return device;
}

export function isMobile() {
  return /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
