import { Action, createAsyncThunk, createSlice, PayloadAction, Reducer, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import { apis } from 'src/api/setup-apis';
import { RootState } from 'src/reducers';
import { buildAxiosRequestConfig } from 'src/utils/api';
import { splitStringByWords } from 'src/utils/string';
import {
  Filtro,
  IngresarCajaSliceState,
  TiposCaja,
  TiposCajaResponseBody,
  TiposContenido,
  TiposContenidoRequestBody,
  TiposContenidoResponseBody,
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
      tipoCaja: getState().ingresarCajas.selected.tipoCaja?.descripcion!,
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

// Slice

const initialState: IngresarCajaSliceState = {
  filters: {},
  selected: {},
  info: {},
  loading: { tiposCaja: false, tiposContenido: false, tipoPlantilla: false, añosVencimiento: false },
  error: null,
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTiposCaja.pending, (state, action) => {
        state.loading.tiposCaja = true;
        state.filters.tiposCaja = [];
        state.error = null;
      })
      .addCase(fetchTiposCaja.fulfilled, (state, action) => {
        state.loading.tiposCaja = false;
        state.filters.tiposCaja = action.payload;
      })
      .addCase(fetchTiposCaja.rejected, (state, action) => {
        console.log(state.loading);
        state.loading.tiposCaja = false;
        state.filters.tiposCaja = [];
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchTiposContenido.pending, (state) => {
        state.loading.tiposContenido = true;
        state.filters.tiposContenido = [];
        state.error = null;
      })
      .addCase(fetchTiposContenido.fulfilled, (state, action) => {
        state.loading.tiposContenido = false;
        state.filters.tiposContenido = action.payload;
      })
      .addCase(fetchTiposContenido.rejected, (state, action) => {
        state.loading.tiposContenido = false;
        state.filters.tiposContenido = [];
        state.error = action.error.message ?? null;
      });
  },
});

export { fetchTiposCaja, fetchTiposContenido };

//export default slice.reducer;
export default slice.reducer as Reducer<typeof initialState>;
