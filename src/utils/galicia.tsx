import { DataType } from 'src/features/cajas/editar-caja/types';

export function getLegajo(email: string) {
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
    default:
      return 'text';
  }
}
