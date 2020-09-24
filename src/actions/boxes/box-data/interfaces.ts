export interface IBoxDataSet {
  [key: string]: string | number | BoxContent | null;
  content: BoxContent;
}

export interface IBoxDocument {
  id: number;
  [key: string]: string | number | null;
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

export type BoxContentType = IBoxDocument | IBoxTemplate | IBoxLabel;
export type BoxContent = BoxContentType[];
