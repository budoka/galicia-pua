import { LabeledValue, SelectValue } from 'antd/lib/select';

export interface BoxTypeFilter extends LabeledValue {
  // id: string;
  // description: string;
}

export interface BoxContentTypeFilter extends LabeledValue {
  //  id: string;
  //  description: string;
}

export interface BoxTypeFilterAPIResponse {
  id: number;
  descripcion: string;
}

export interface BoxContentTypeFilterAPIResponse {
  id: number;
  descripcion: string;
}
