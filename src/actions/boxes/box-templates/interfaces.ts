import { ObjectLiteral } from 'src/interfaces';

export interface BoxTemplate {
  id: number;
  columnsTemplate: BoxColumnTemplate[];
}

export interface BoxColumnTemplate {
  id: number;
  title: string;
  dataType: string;
  required: boolean;
  order: number;
  length: number;
  templateId: number;
}

export interface BoxColumnTemplateAPIResponse {
  idPlantilla: number;
  id: number;
  titulo: string;
  tipo: string;
  opcional: boolean;
  orden: number;
  longitud: number;
}
