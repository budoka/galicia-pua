import { LabeledValue } from 'antd/lib/select';

/*export interface SelectValue {
  key?: string;
  value: string;
  label: React.ReactNode;
}*/

export interface BoxTypeFilter extends LabeledValue {
  // id: string;
  // description: string;
}

export interface BoxContentTypeFilter extends LabeledValue {
  //  id: string;
  //  description: string;
}

export interface DetailTemplateFilter extends LabeledValue {
  //  id: string;
  //  description: string;
}

///////////////////// Request /////////////////////
export interface BoxContentTypeFilterAPIRequest {
  tipoCaja: string;
}

export interface DetailTemplateFilterAPIRequest {
  idSector: number;
}

///////////////////// Response /////////////////////
export interface BoxTypeFilterAPIResponse {
  id: number;
  descripcion: string;
}

export type BoxContentTypeFilterAPIResponse = string;

export interface DetailTemplateFilterAPIResponse {
  id: number;
  descripcion: string;
}
