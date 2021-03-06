import { createAsyncThunk, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import axios from 'axios';
import dayjs from 'dayjs';
import { apis } from 'src/api/setup/setup-apis';
import { RequestConfig } from 'src/api/types';
import { CAJA_ETIQUETA, CAJA_DETALLE, CAJA_DOCUMENTO } from 'src/constants/constants';
import { RootState } from 'src/reducers';
import { buildAxiosRequestConfig } from 'src/utils/api';
import {
  AñosVencimiento,
  ModificarCajaRequestBody,
  ModificarCajaResponseBody,
  EditarCajaSliceState,
  Inputs,
  TiposCaja,
  TiposCajaResponseBody,
  TiposContenido,
  TiposContenidoRequestBody,
  TiposContenidoResponseBody,
  TiposPlantilla,
  TiposPlantillaRequestBody,
  TiposPlantillaResponseBody,
  UIState,
  VencimientoCajaRequestBody,
  VencimientoCajaResponseBody,
  VistaPrevia,
  VistaPreviaCajaDetalle,
  VistaPreviaCajaDocumento,
  VistaPreviaCajaEtiqueta,
  VistaPreviaRequestBody,
  VistaPreviaResponseBody,
  InfoCajaRequestBody,
  InfoCajaResponseBody,
  Caja,
  FiltroResponseBody,
  Filtro,
  Info,
} from './types';

const FEATURE_NAME = 'editarCaja';

// Async actions

const fetchInfoCaja = createAsyncThunk<Caja, RequestConfig<string | number>, { state: RootState }>(
  FEATURE_NAME + '/fetchInfoCaja',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const data = options.data!;

    // Mapeo de la solicitud
    const requestData: InfoCajaRequestBody = {
      idCaja: +data,
    };

    // Configuracion del servicio
    const api = apis['CAJA'];
    const resource = api.resources['INFO_CAJA'];
    const config = buildAxiosRequestConfig(api, resource, { ...options, data: requestData });

    // Respuesta del servicio
    const response = await axios.request<InfoCajaResponseBody>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const infoCaja = responseData;

    return infoCaja;
  },
);

const fetchTiposCaja = createAsyncThunk<TiposCaja, RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchTiposCaja',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Configuracion del servicio
    const api = apis['TIPOS_CAJA'];
    const resource = api.resources['TIPO_CAJA'];
    const config = buildAxiosRequestConfig(api, resource, options);

    // Respuesta del servicio
    const response = await axios.request<TiposCajaResponseBody>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const tiposCaja = responseData.map((tipoCaja) => {
      return {
        key: tipoCaja.id,
        value: tipoCaja.id,
        label: tipoCaja.descripcion,
      };
    }) as TiposCaja;

    return tiposCaja;
  },
);

const fetchTiposContenido = createAsyncThunk<TiposContenido, RequestConfig<Filtro>, { state: RootState }>(
  FEATURE_NAME + '/fetchTiposContenido',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const data = options.data!;

    // Mapeo de la solicitud
    const requestData: TiposContenidoRequestBody = {
      tipoCaja: data.label?.toString()!, //|| getState().editarCajas.inputs.tipoCaja?.label?.toString()!,
    };

    // Configuracion del servicio
    const api = apis['TIPOS_CAJA'];
    const resource = api.resources['TIPO_CONTENIDO'];
    const config = buildAxiosRequestConfig(api, resource, { ...options, data: requestData });

    // Respuesta del servicio
    const response = await axios.request<TiposContenidoResponseBody>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const tiposContenido = responseData.map((tipoContenido) => {
      // Se debe cambiar el servicio tipoDeContenido para que devuelva un objeto {id: number, descripcion: string}
      let value = -1;
      if (tipoContenido === CAJA_ETIQUETA) value = 0;
      else if (tipoContenido === CAJA_DETALLE) value = 1;
      else if (tipoContenido === CAJA_DOCUMENTO) value = 2;
      return {
        key: tipoContenido,
        value,
        label: tipoContenido,
      };
    }) as TiposContenido;

    return tiposContenido;
  },
);

const fetchTiposPlantilla = createAsyncThunk<TiposContenido, RequestConfig | undefined, { state: RootState }>(
  FEATURE_NAME + '/fetchTiposPlantilla',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Mapeo de la solicitud
    const requestData: TiposPlantillaRequestBody = {
      idSector: getState().sesion.data.idSector!,
    };

    // Configuracion del servicio
    const api = apis['PLANTILLAS_SECTOR'];
    const resource = api.resources['PLANTILLAS_SECTOR'];
    const config = buildAxiosRequestConfig(api, resource, { ...options, data: requestData });

    // Respuesta del servicio
    const response = await axios.request<TiposPlantillaResponseBody>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const tiposPlantilla = responseData.map((tipoPlantilla) => {
      return {
        key: tipoPlantilla.id,
        value: tipoPlantilla.id,
        label: tipoPlantilla.descripcion,
      };
    }) as TiposPlantilla;

    return tiposPlantilla;
  },
);

const fetchVistaPrevia = createAsyncThunk<
  VistaPrevia,
  RequestConfig<Pick<Inputs, 'tipoCaja' | 'tipoContenido' | 'tipoPlantilla'>>,
  { state: RootState }
>(FEATURE_NAME + '/fetchVistaPrevia', async (options, thunkApi) => {
  const { dispatch, getState, rejectWithValue } = thunkApi;
  const data = options.data!;

  // Mapeo de la solicitud
  const requestData: VistaPreviaRequestBody = {
    /*   idTipoCaja: +getState().editarCajas.inputs.tipoCaja?.value!,
      idTipoContenido: +getState().editarCajas.inputs.tipoContenido?.value!,
      idPlantilla: +getState().editarCajas.inputs.tipoPlantilla?.value!, */
    idTipoCaja: +data.tipoCaja?.value!,
    idTipoContenido: +data.tipoContenido?.value!,
    idPlantilla: +data.tipoPlantilla?.value!,
  };

  // Configuracion del servicio
  const api = apis['CAJA'];
  const resource = api.resources['PREVIEW'];
  const config = buildAxiosRequestConfig(api, resource, { ...options, data: requestData });

  // Respuesta del servicio
  const response = await axios.request<VistaPreviaResponseBody>(config);
  const responseData = response.data;

  // Mapeo de la respuesta
  // Type Guards # Cuando las response devuelvan el tipoContenido y idPlanilla, se debería corregir.

  if (!responseData || !Array.isArray(responseData) || responseData.length === 0) {
  } else if ('inclusiones' in responseData[0]) {
    const vistaPreviaDocumento: VistaPreviaCajaDocumento[] = responseData as VistaPreviaCajaDocumento[];
    return vistaPreviaDocumento;
  } else if ('idPlantilla' in responseData[0]) {
    const vistaPreviaDetalle: VistaPreviaCajaDetalle[] = responseData as VistaPreviaCajaDetalle[];
    return vistaPreviaDetalle;
  } else if ('legacy' in responseData[0]) {
    const vistaPreviaEtiquetas: VistaPreviaCajaEtiqueta[] = responseData as VistaPreviaCajaEtiqueta[];
    return vistaPreviaEtiquetas;
  }
  return rejectWithValue(null);
});

const fetchAñosVencimiento = createAsyncThunk<
  AñosVencimiento,
  RequestConfig<Pick<Inputs, 'tipoCaja' | 'tipoContenido'>>,
  { state: RootState }
>(FEATURE_NAME + '/fetchAñosVencimiento', async (options, thunkApi) => {
  const { dispatch, getState } = thunkApi;
  const data = options.data!;

  // Mapeo de la solicitud
  const requestData: VencimientoCajaRequestBody = {
    /*   idTipoCaja: +getState().editarCajas.inputs.tipoCaja?.value!,
      tipoContenido: getState().editarCajas.inputs.tipoContenido?.value.toString()!, */
    idTipoCaja: +data.tipoCaja?.value!,
    tipoContenido: data.tipoContenido?.label?.toString()!,
  };

  // Configuracion del servicio
  const api = apis['TIPOS_CAJA'];
  const resource = api.resources['VENCIMIENTO_CAJA'];
  const config = buildAxiosRequestConfig(api, resource, { ...options, data: requestData });

  // Respuesta del servicio
  const response = await axios.request<VencimientoCajaResponseBody>(config);
  const responseData = response.data;

  // Mapeo de la respuesta
  const añosVencimiento = responseData;

  return añosVencimiento;
});

const updateCaja = createAsyncThunk<number, RequestConfig<Inputs>, { state: RootState }>(
  FEATURE_NAME + '/updateCaja',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const data = options.data!;

    const fechaDesde = data.fechaContenido && data.fechaContenido.length > 0 ? dayjs(data.fechaContenido[0].toString()) : null;
    const fechaHasta = data.fechaContenido && data.fechaContenido.length > 1 ? dayjs(data.fechaContenido[1].toString()) : null;

    const añosVencimiento = getState().cajas.edicion.data.añosVencimiento!;
    const fechaVencimiento = fechaHasta && añosVencimiento >= 0 ? dayjs(fechaHasta).add(añosVencimiento, 'year').format() : null;

    // Mapeo de la solicitud
    const requestData: ModificarCajaRequestBody = {
      numero: getState().cajas.edicion.data.caja?.id!,
      idTipoCaja: +data.tipoCaja?.value!,
      //idTipoContenido: +inputs.tipoContenido?.value!,
      tipoContenido: data.tipoContenido?.label?.toString()!,
      idPlantilla: +data.tipoPlantilla?.value!,
      descripcion: data.descripcion!,
      restringida: data.restringida!,
      fechaVencimiento,
      fechaDesde: fechaDesde && fechaDesde.format(),
      fechaHasta: fechaHasta && fechaHasta.format(),
    };

    // Configuracion del servicio
    const api = apis['CAJA'];
    const resource = api.resources['MODIFICAR_CAJA'];
    const config = buildAxiosRequestConfig(api, resource, { ...options, data: requestData });

    // Respuesta del servicio
    const response = await axios.request<ModificarCajaResponseBody>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const idCaja = responseData.numero;

    dispatch(setInfo({ ...getState().cajas.edicion.info, fechaModificacion: dayjs().format('DD/MM/YYYY HH:mm:ss'), fechaVencimiento }));

    return idCaja;
  },
);

const updateContenido = createAsyncThunk<number, RequestConfig<Inputs>, { state: RootState }>(
  FEATURE_NAME + '/updateContenido',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const data = options.data!;

    /* 
    // Mapeo de la solicitud
    const requestData: ModificarCajaRequestBody = {
      numero: getState().cajas.edicion.data.caja?.id!,
      idTipoCaja: +inputs.tipoCaja?.value!,
      //idTipoContenido: +inputs.tipoContenido?.value!,
      tipoContenido: inputs.tipoContenido?.label?.toString()!,
      idPlantilla: +inputs.tipoPlantilla?.value!,
      descripcion: inputs.descripcion!,
      restringida: inputs.restringida!,

    };

    // Configuracion del servicio
    const api = apis['CAJA'];
    const resource = api.resources['MODIFICAR_CAJA'];
    const config = buildAxiosRequestConfig(api, resource, {...options, data: requestData}););

    // Respuesta del servicio
    const response = await axios.request<ModificarCajaResponseBody>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const idCaja = responseData.numero;

    dispatch(setInfo({ ...getState().cajas.edicion.info, fechaModificacion: dayjs().format('DD/MM/YYYY HH:mm:ss'), fechaVencimiento }));

    return idCaja; */

    return 1;
  },
);

// Slice
/* 
export type ContenidoCajaActionTypes =
  | RUNNING_CONTENT
  | CREATE_LOCAL_CONTENT
  | CLEAN_LOCAL_CONTENT
  | ADD_CONTENT_SUCCESS
  | ADD_CONTENT_FAILURE
  | UPDATE_CONTENT_SUCCESS
  | UPDATE_CONTENT_FAILURE
  | REMOVE_CONTENT_SUCCESS
  | REMOVE_CONTENT_FAILURE;

 */
const initialState: EditarCajaSliceState = {
  data: {},
  inputs: {},
  info: {},
  ui: {},
  loading: {},
  error: null,
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    loading(state, action: PayloadAction<boolean>) {
      state.loading.datos = action.payload;
    },
    setInputs(state, action: PayloadAction<Inputs>) {
      state.inputs = action.payload;
    },
    clearInputs(state) {
      state.inputs = {};
    },
    setInfo(state, action: PayloadAction<Info>) {
      state.info = action.payload;
    },
    clearInfo(state) {
      state.info = {};
    },
    setUI(state, action: PayloadAction<UIState>) {
      state.ui = action.payload;
    },
    clearUI(state) {
      state.ui = {};
    },
    clearState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInfoCaja.pending, (state) => {
        state.loading = { ...state.loading, caja: true };
        state.data.caja = null;
        state.error = null;
      })
      .addCase(fetchInfoCaja.fulfilled, (state, action) => {
        state.loading = { ...state.loading, caja: false };
        state.data.caja = action.payload;
      })
      .addCase(fetchInfoCaja.rejected, (state, action) => {
        state.loading = { ...state.loading, caja: false, datos: false };
        state.data.caja = null;
        state.error = action.error.message ?? null;
        state.ui.notFound = { visible: true };
      });
    builder
      .addCase(fetchTiposCaja.pending, (state) => {
        state.loading = { ...state.loading, tiposCaja: true };
        state.data.tiposCaja = [];
        state.error = null;
      })
      .addCase(fetchTiposCaja.fulfilled, (state, action) => {
        state.loading = { ...state.loading, tiposCaja: false };
        state.data.tiposCaja = action.payload;
      })
      .addCase(fetchTiposCaja.rejected, (state, action) => {
        state.loading = { ...state.loading, tiposCaja: false };
        state.data.tiposCaja = [];
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchTiposContenido.pending, (state) => {
        state.loading = { ...state.loading, tiposContenido: true };
        state.data.tiposContenido = [];
        state.error = null;
      })
      .addCase(fetchTiposContenido.fulfilled, (state, action) => {
        state.loading = { ...state.loading, tiposContenido: false };
        state.data.tiposContenido = action.payload;
      })
      .addCase(fetchTiposContenido.rejected, (state, action) => {
        state.loading = { ...state.loading, tiposContenido: false };
        state.data.tiposContenido = [];
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchTiposPlantilla.pending, (state) => {
        state.loading = { ...state.loading, tiposPlantilla: true };
        state.data.tiposPlantilla = [];
        state.error = null;
      })
      .addCase(fetchTiposPlantilla.fulfilled, (state, action) => {
        state.loading = { ...state.loading, tiposPlantilla: false };
        state.data.tiposPlantilla = action.payload;
      })
      .addCase(fetchTiposPlantilla.rejected, (state, action) => {
        state.loading = { ...state.loading, tiposPlantilla: false };
        state.data.tiposPlantilla = [];
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchVistaPrevia.pending, (state) => {
        state.loading = { ...state.loading, vistaPrevia: true };
        state.data.vistaPrevia = null;
        state.error = null;
      })
      .addCase(fetchVistaPrevia.fulfilled, (state, action) => {
        state.loading = { ...state.loading, vistaPrevia: false };
        state.data.vistaPrevia = action.payload;
      })
      .addCase(fetchVistaPrevia.rejected, (state, action) => {
        state.loading = { ...state.loading, vistaPrevia: false };
        state.data.vistaPrevia = null;
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchAñosVencimiento.pending, (state) => {
        state.loading = { ...state.loading, añosVencimiento: true };
        state.data.añosVencimiento = null;
        state.error = null;
      })
      .addCase(fetchAñosVencimiento.fulfilled, (state, action) => {
        state.loading = { ...state.loading, añosVencimiento: false };
        state.data.añosVencimiento = action.payload;
      })
      .addCase(fetchAñosVencimiento.rejected, (state, action) => {
        state.loading = { ...state.loading, añosVencimiento: false };
        state.data.añosVencimiento = null;
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(updateCaja.pending, (state) => {
        state.loading = { ...state.loading, guardandoCaja: true };
        state.error = null;
      })
      .addCase(updateCaja.fulfilled, (state) => {
        state.loading = { ...state.loading, guardandoCaja: false };
        /*   state.info = {
          fechaModificacion: state.data.caja?.fechaUltimaTransicion,
          fechaVencimiento: state.data.caja?.fechaVencimiento,
        }; */
      })
      .addCase(updateCaja.rejected, (state, action) => {
        state.loading = { ...state.loading, guardandoCaja: false };
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(updateContenido.pending, (state) => {
        state.loading = { ...state.loading, guardandoContenido: true };
        state.error = null;
      })
      .addCase(updateContenido.fulfilled, (state) => {
        state.loading = { ...state.loading, guardandoContenido: false };
        //state.content.
      })
      .addCase(updateContenido.rejected, (state, action) => {
        state.loading = { ...state.loading, guardandoContenido: false };
        state.error = action.error.message ?? null;
      });
  },
});

const { loading, setInputs, clearInputs, setInfo, clearInfo, setUI, clearUI, clearState } = slice.actions;

export {
  loading,
  setInputs,
  clearInputs,
  setInfo,
  clearInfo,
  setUI,
  clearUI,
  clearState,
  fetchInfoCaja,
  fetchTiposCaja,
  fetchTiposContenido,
  fetchTiposPlantilla,
  fetchVistaPrevia,
  fetchAñosVencimiento,
  updateCaja,
  updateContenido,
};

export default slice.reducer;
