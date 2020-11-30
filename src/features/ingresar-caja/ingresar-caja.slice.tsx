import { Action, createAsyncThunk, createSlice, PayloadAction, Reducer, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';
import { apis } from 'src/api/setup-apis';
import { RootState } from 'src/reducers';
import { buildAxiosRequestConfig } from 'src/utils/api';
import { goTo } from 'src/utils/history';
import { splitStringByWords } from 'src/utils/string';
import {
  AñosVencimiento,
  FechaVigencia,
  Filtro,
  GuardarCajaRequestBody,
  GuardarCajaResponseBody,
  IngresarCajaSliceState,
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
} from './types';

const FEATURE_NAME = 'ingresarCaja';

// Async actions

const fetchTiposCaja = createAsyncThunk<TiposCaja, void, { state: RootState }>(FEATURE_NAME + '/fetchTiposCaja', async (_, thunkApi) => {
  const { dispatch, getState } = thunkApi;

  // Configuracion del servicio
  const api = apis['TIPO_CAJA'];
  const resource = api.resources['TIPO_CAJA'];
  const config = buildAxiosRequestConfig(api, resource);

  // Respuesta del servicio
  const response = await axios.request<TiposCajaResponseBody>(config);
  const responseData = response.data;

  // Mapeo de la respuesta
  const tiposCaja = responseData.map((tipoCaja) => {
    return {
      ...tipoCaja,
    };
  }) as TiposCaja;

  return tiposCaja;
});

const fetchTiposContenido = createAsyncThunk<TiposContenido, void, { state: RootState }>(
  FEATURE_NAME + '/fetchTiposContenido',
  async (_, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Mapeo de la solicitud
    const requestData: TiposContenidoRequestBody = {
      tipoCaja: getState().ingresarCajas.inputs.tipoCaja?.descripcion!,
    };

    // Configuracion del servicio
    const api = apis['TIPO_CAJA'];
    const resource = api.resources['TIPO_CONTENIDO'];
    const config = buildAxiosRequestConfig(api, resource, requestData);

    // Respuesta del servicio
    const response = await axios.request<TiposContenidoResponseBody>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const tiposContenido = responseData.map((tipoContenido) => {
      return {
        id: tipoContenido,
        descripcion: tipoContenido,
      };
    }) as TiposContenido;

    return tiposContenido;
  },
);

const fetchTiposPlantilla = createAsyncThunk<TiposContenido, void, { state: RootState }>(
  FEATURE_NAME + '/fetchTiposPlantilla',
  async (_, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Mapeo de la solicitud
    const requestData: TiposPlantillaRequestBody = {
      idSector: getState().sesion.data.idSector!,
    };

    // Configuracion del servicio
    const api = apis['PLANTILLAS_SECTOR'];
    const resource = api.resources['PLANTILLAS_SECTOR'];
    const config = buildAxiosRequestConfig(api, resource, requestData);

    // Respuesta del servicio
    const response = await axios.request<TiposPlantillaResponseBody>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const tiposPlantilla = responseData.map((tipoPlantilla) => {
      return {
        ...tipoPlantilla,
      };
    }) as TiposPlantilla;

    return tiposPlantilla;
  },
);

const fetchVistaPrevia = createAsyncThunk<VistaPrevia, void, { state: RootState }>(
  FEATURE_NAME + '/fetchVistaPrevia',
  async (_, thunkApi) => {
    const { dispatch, getState, rejectWithValue } = thunkApi;

    // Mapeo de la solicitud
    const requestData: VistaPreviaRequestBody = {
      idTipoCaja: +getState().ingresarCajas.inputs.tipoCaja?.id!,
      idTipoContenido: +getState().ingresarCajas.inputs.tipoContenido?.id!,
      idPlantilla: +getState().ingresarCajas.inputs.tipoPlantilla?.id!,
    };

    // Configuracion del servicio
    const api = apis['CAJA'];
    const resource = api.resources['PREVIEW'];
    const config = buildAxiosRequestConfig(api, resource, requestData);

    // Respuesta del servicio
    const response = await axios.request<VistaPreviaResponseBody>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    // Type Guards # Cuando las response devuelvan el tipoContenido y idPlanilla, se debería corregir.

    console.log(responseData);
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
  },
);

const fetchAñosVencimiento = createAsyncThunk<AñosVencimiento, void, { state: RootState }>(
  FEATURE_NAME + '/fetchAñosVencimiento',
  async (_, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Mapeo de la solicitud
    const requestData: VencimientoCajaRequestBody = {
      idTipoCaja: +getState().ingresarCajas.inputs.tipoCaja?.id!,
      tipoContenido: getState().ingresarCajas.inputs.tipoContenido?.descripcion!,
    };

    // Configuracion del servicio
    const api = apis['TIPO_CAJA'];
    const resource = api.resources['VENCIMIENTO_CAJA'];
    const config = buildAxiosRequestConfig(api, resource, requestData);

    // Respuesta del servicio
    const response = await axios.request<VencimientoCajaResponseBody>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const añosVencimiento = responseData;

    return añosVencimiento;
  },
);

const saveCaja = createAsyncThunk<number, void, { state: RootState }>(FEATURE_NAME + '/saveCajas', async (_, thunkApi) => {
  const { dispatch, getState } = thunkApi;

  // Mapeo de la solicitud
  const requestData: GuardarCajaRequestBody = {
    idTipoCaja: +getState().ingresarCajas.inputs.tipoCaja?.id!,
    idTipoContenido: +getState().ingresarCajas.inputs.tipoContenido?.id!,
    idPlantilla: +getState().ingresarCajas.inputs.tipoPlantilla?.id!,
    idUsuarioAlta: getState().sesion.data?.idUsuario!,
    idSectorOrigen: getState().sesion.data?.idSector!,
    descripcion: getState().ingresarCajas.inputs.descripcion!,
    restringida: getState().ingresarCajas.inputs.restringida!,
    fechaGeneracion: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
    fechaVencimiento: dayjs().add(10, 'year').format('YYYY-MM-DD'),
    fechaDesde: dayjs().format('YYYY-MM-DD'),
    fechaHasta: dayjs().add(10, 'year').format('YYYY-MM-DD'),
  };

  // Configuracion del servicio
  const api = apis['CAJA'];
  const resource = api.resources['GUARDAR_CAJA'];
  const config = buildAxiosRequestConfig(api, resource, requestData);

  // Respuesta del servicio
  const response = await axios.request<GuardarCajaResponseBody>(config);
  const responseData = response.data;

  // Mapeo de la respuesta
  const idCaja = responseData.numero;

  return idCaja;
});

// Slice

const initialState: IngresarCajaSliceState = {
  data: {},
  inputs: {},
  ui: {},
  loading: {},
  error: null,
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    /*     setTipoCaja(state, action: PayloadAction<Filtro>) {
      state.inputs.tipoCaja = action.payload;
      //    state.selected = { ...state.selected, tipoCaja: action.payload };
    },
    setTipoContenido(state, action: PayloadAction<Filtro>) {
      state.inputs.tipoContenido = action.payload;
      //  state.selected = { ...state.selected, tipoContenido: action.payload };
    },
    setTipoPlantilla(state, action: PayloadAction<Filtro>) {
      state.inputs.tipoPlantilla = action.payload;
      //  state.selected = { ...state.selected, tipoPlantilla: action.payload };
    },
    setFechaVigencia(state, action: PayloadAction<FechaVigencia | null>) {
      state.inputs.fechaVigencia = action.payload;
      //  state.selected = { ...state.selected, tipoPlantilla: action.payload };
    }, */
    setInputs(state, action: PayloadAction<Inputs>) {
      state.inputs = action.payload;
    },
    clearInputs(state) {
      state.inputs = {};
    },
    setUI(state, action: PayloadAction<UIState>) {
      state.ui = action.payload;
    },
    clearUI(state) {
      state.ui = {};
    },
    clearState(state) {
      state.inputs = {};
      state.ui = {};
      state.data = {};
      state.loading = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTiposCaja.pending, (state) => {
        state.loading = { tiposCaja: true };
        state.data.tiposCaja = [];
        state.error = null;
      })
      .addCase(fetchTiposCaja.fulfilled, (state, action) => {
        state.loading = { tiposCaja: false };
        state.data.tiposCaja = action.payload;
      })
      .addCase(fetchTiposCaja.rejected, (state, action) => {
        state.loading = { tiposCaja: false };
        state.data.tiposCaja = [];
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchTiposContenido.pending, (state) => {
        state.loading = { tiposContenido: true };
        state.data.tiposContenido = [];
        state.error = null;
      })
      .addCase(fetchTiposContenido.fulfilled, (state, action) => {
        state.loading = { tiposContenido: false };
        state.data.tiposContenido = action.payload;
      })
      .addCase(fetchTiposContenido.rejected, (state, action) => {
        state.loading = { tiposContenido: false };
        state.data.tiposContenido = [];
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchTiposPlantilla.pending, (state) => {
        state.loading = { tiposPlantilla: true };
        state.data.tiposPlantilla = [];
        state.error = null;
      })
      .addCase(fetchTiposPlantilla.fulfilled, (state, action) => {
        state.loading = { tiposPlantilla: false };
        state.data.tiposPlantilla = action.payload;
      })
      .addCase(fetchTiposPlantilla.rejected, (state, action) => {
        state.loading = { tiposPlantilla: false };
        state.data.tiposPlantilla = [];
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchVistaPrevia.pending, (state) => {
        state.loading = { vistaPrevia: true };
        state.data.vistaPrevia = null;
        state.error = null;
      })
      .addCase(fetchVistaPrevia.fulfilled, (state, action) => {
        state.loading = { vistaPrevia: false };
        state.data.vistaPrevia = action.payload;
      })
      .addCase(fetchVistaPrevia.rejected, (state, action) => {
        state.loading = { vistaPrevia: false };
        state.data.vistaPrevia = null;
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchAñosVencimiento.pending, (state) => {
        state.loading = { añosVencimiento: true };
        state.data.añosVencimiento = null;
        state.error = null;
      })
      .addCase(fetchAñosVencimiento.fulfilled, (state, action) => {
        state.loading = { añosVencimiento: false };
        state.data.añosVencimiento = action.payload;
      })
      .addCase(fetchAñosVencimiento.rejected, (state, action) => {
        state.loading = { añosVencimiento: false };
        state.data.añosVencimiento = null;
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(saveCaja.pending, (state) => {
        state.loading = { guardandoCaja: true };
        state.error = null;
      })
      .addCase(saveCaja.fulfilled, (state) => {
        state.loading = { guardandoCaja: false };
      })
      .addCase(saveCaja.rejected, (state, action) => {
        state.loading = { guardandoCaja: false };
        state.error = action.error.message ?? null;
      });
  },
});

const {
  /* setTipoCaja, setTipoContenido, setTipoPlantilla, setFechaVigencia, */ setInputs,
  clearInputs,
  setUI,
  clearUI,
  clearState,
} = slice.actions;

export {
  /*   setTipoCaja,
  setTipoContenido,
  setTipoPlantilla,
  setFechaVigencia, */
  setInputs,
  clearInputs,
  setUI,
  clearUI,
  clearState,
  fetchTiposCaja,
  fetchTiposContenido,
  fetchTiposPlantilla,
  fetchVistaPrevia,
  fetchAñosVencimiento,
  saveCaja,
};

//export default slice.reducer;
export default slice.reducer as Reducer<typeof initialState>;
