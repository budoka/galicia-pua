import dayjs, { Dayjs } from 'dayjs';
import { ObjectLiteral } from 'src/interfaces';

export interface BoxTemplate {
  id: number;
  columnsTemplate: BoxColumnTemplate[];
}

export interface BoxDocumentColumnTemplate {
  id: number;
  title: string;
  dataType: string;
  required: boolean;
  templateId: number;
}

export interface BoxDetailColumnTemplate {
  id: number;
  title: string;
  dataType: string;
  required: boolean;
  order: number;
  length: number;
  templateId: number;
}

export interface BoxLabelTemplate {
  id: number;
  title: string;
}

export type BoxColumnTemplate = BoxDocumentColumnTemplate | BoxDetailColumnTemplate;

///////////////////// Request /////////////////////
export interface BoxTemplateAPIRequest {
  idCaja: number;
  tipoContenido: string;
  idPlantilla?: number;
}

///////////////////// Response /////////////////////
export interface BoxDocumentTemplateAPIResponse {
  id: number;
  descripcion: string;
  inclusiones: BoxDocumentColumnTemplateAPIResponse[];
}

export interface BoxDetailTemplateAPIResponse {
  id: number;
  descripcion: string;
  inclusiones: BoxDocumentColumnTemplateAPIResponse[];
}

export interface BoxLabelTemplateAPIResponse {
  id: number;
  descripcion: string;
}

export interface BoxDocumentColumnTemplateAPIResponse {
  id: number;
  titulo: string;
  tipo: string;
  opcional: boolean;
  orden: number;
  longitud: number;
  idPlantilla: number;
}

export interface BoxDetailColumnTemplateAPIResponse {
  id: number;
  titulo: string;
  tipo: string;
  opcional: boolean;
  orden: number;
  longitud: number;
  idPlantilla: number;
}

/// DATA
export interface BoxDocumentDataAPIResponse {
  id: number;
  idTipoDocumento: number;
  dniCuitTitular: number;
  nombreTitular: string;
  numeroProducto: null;
  detalle: string;
  fechaDocumental: Dayjs;
  fechaCierre: Dayjs;
  claveExterna: string;
  fechaDesde: Dayjs;
  fechaHasta: Dayjs;
  idSectorPropietario: number;
  tipoDocumental: string;
}

/*export interface BoxColumnDocumentTemplateAPIResponse {
  id: number;
  descripcion: string;
  inclusiones: [];
}*/
