import { Dayjs } from 'dayjs';

export interface IBox extends IBoxDataSet {
  id: number;
}

export interface IBoxDataSet {
  info: BoxInfo;
  content: BoxContentType[];
}

export interface BoxInfo {
  [key: string]: string | number | boolean | null;
}

export type BoxContentType = IBoxDocument | IBoxTemplate | IBoxLabel;

export interface IBoxDocument {
  id: number;
  [key: string]: string | number | boolean | null;
}

export interface IBoxTemplate {
  id: number;
  detail: IBoxDetail[];
}

export interface IBoxDetail {
  id: number;
  value: string;
  columnId: number;
}

export interface IBoxLabel {
  id: number;
  labelId: number;
}

///////////////////////////////

export interface BoxDetailAPIRequest {
  idUsuarioAlta: number;
  idSectorOrigen: number;
  idTipoCaja: number;
  tipoContenido: string;
  idPlantilla: number;
  descripcion: string;
  fechaDesde: string;
  fechaHasta: string;
  fechaGeneracion: string;
  fechaVencimiento: string;
  restringida: number;
}
