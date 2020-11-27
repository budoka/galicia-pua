export interface SesionSliceState {
  data: InfoSesion;
  loading: boolean;
  error: string | null;
}

// Modelo front

export interface InfoSesion {
  idUsuario?: number;
  idSector?: number;
  nombreUsuario?: string;
  nombreSector?: string;
  legajo?: string;
  perfil?: string;
}

export type InfoAzure = Pick<InfoSesion, 'legajo' | 'nombreUsuario'>;

// Modelo back

export type SesionRequestBody = string;

export interface SesionResponseBody {
  descripcionSector: string;
  idSector: number;
  idUsuario: number;
  roles: { id: number; descripcion: string; nombre: string }[];
}
