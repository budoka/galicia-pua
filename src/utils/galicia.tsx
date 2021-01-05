import { Pattern } from 'src/constants/constants';
import { DataType } from 'src/features/cajas/editar-caja/types';

export function getLegajoFromMail(email: string) {
  if (!email) return;
  const legajo = email.split('@')[0].toUpperCase();
  return legajo;
}

export function inferType(dataType: DataType) {
  switch (dataType) {
    case 'lista':
      return 'select';
    case 'fecha':
      return 'date';
    case 'boolean':
      return 'checkbox';
    case 'texto':
    case 'entero':
    default:
      return 'text';
  }
}

export function inferPattern(dataType: DataType) {
  switch (dataType) {
    case 'texto':
      return Pattern.ONLY_WORDS;
    case 'entero':
      return Pattern.ONLY_NUMBERS;
    default:
      return Pattern.ANY;
  }
}
