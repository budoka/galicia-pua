///////////////////// Interfaces Front /////////////////////

export interface Caja {
  id: number | null; // id
  info: InfoCaja | null; // demás propiedades
  contenido: ContenidoCaja[]; // contenido
}

export interface InfoCaja {
  idTipoCaja: number | null;
  tipoContenido: number | null;
  idPlantilla: number | null;
  stateId: string | null;
  idUsuarioAlta: number | null;
  idSectorOrigen: number | null;
  restringida: number | null;
  legajo: string | null;
  nombre: string | null;
  nombreSector: string | null;
  nombreTipoCaja: string | null;
  descripcion: string | null;
  descripcionContenido: string | null;
  descripcionPlantilla: string | null;
  fechaGeneracion: string | null;
  fechaVencimiento: string | null;
  fechaUltimaTransicion: string | null;
  fechaDocumentacionDesde: string | null;
  fechaDocumentacionHasta: string | null;
}

export type ContenidoCaja = CajaDocumento | CajaDetalle | CajaEtiqueta;

export interface CajaDocumento {
  id: number | null;
  idTipoDocumento: number | null;
  tipoDocumental: string | null;
  numeroProducto: string | null;
  detalle: string | null;
  dniCuitTitular: number | null;
  nombreTitular: string | null;
  idSectorPropietario: number | null;
  claveExterna: number | null;
  fechaDocumental: string | null;
  fechaCierre: string | null;
  fechaDesde: string | null;
  fechaHasta: string | null;
}

export interface CajaDetalle {
  id: number;
  detalle: CajaDetalleColumna[];
}

export interface CajaDetalleColumna {
  idColumna: number;
  valor: string;
}

export interface CajaEtiqueta {
  id: number; // Se va a quitar
  idEtiqueta: number;
}

///////////////////// Interfaces Back /////////////////////
