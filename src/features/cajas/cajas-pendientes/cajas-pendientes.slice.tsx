import { Action, createAsyncThunk, createSlice, PayloadAction, Reducer, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import { apis } from 'src/api/setup-apis';
import { RootState } from 'src/reducers';
import { buildAxiosRequestConfig } from 'src/utils/api';
import { splitStringByWords } from 'src/utils/string';
import {
  CajasPendientes,
  CajasPendientesRequestBody,
  CajasPendientesResponseBody,
  DetalleCaja,
  FiltrosCajas,
  CajasPendientesSliceState,
} from './types';

const FEATURE_NAME = 'cajasPendientes';

// Async actions

const fetchCajas = createAsyncThunk<CajasPendientes, void, { state: RootState }>(FEATURE_NAME + '/fetchCajas', async (_, thunkApi) => {
  const { dispatch, getState } = thunkApi;

  const filters: FiltrosCajas = getState().cajas.pendientes.filters;

  // Mapeo de la solicitud
  const requestData: CajasPendientesRequestBody = {
    idUsuario: getState().sesion.data?.idUsuario!,
    roles: [getState().sesion.data?.perfil!],
    estado: filters.estado,
    fechaDesde: filters.fecha && filters.fecha.length > 0 ? filters.fecha[0].format('YYYY-MM-DD') : undefined,
    fechaHasta: filters.fecha && filters.fecha.length > 0 ? filters.fecha[1].format('YYYY-MM-DD') : undefined,
    centroCosto: filters.sector,
    nombre: filters.usuario,
  };

  // Configuracion del servicio
  const api = apis['CAJA'];
  const resource = api.resources['DETALLE_CAJA'];
  const config = buildAxiosRequestConfig(api, resource, requestData);

  // Respuesta del servicio
  const response = await axios.request<CajasPendientesResponseBody>(config);
  const responseData = response.data;

  // Mapeo de la respuesta
  const cajas = responseData.map((caja) => {
    return {
      numero: caja.numero,
      descripcion: caja.descripcion,
      estado: splitStringByWords(caja.estado)?.join(' '),
      fechaEmision: moment(caja.fechaEmision).format('DD/MM/YYYY'),
      sector: caja.sector,
      usuario: caja.usuario,
    } as DetalleCaja;
  });

  return cajas;
});

// Slice

const initialState: CajasPendientesSliceState = {
  data: [],
  filters: {},
  loading: false,
  error: null,
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<FiltrosCajas>) {
      state.filters = action.payload;
    },
    clearFilters(state) {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCajas.pending, (state) => {
        state.loading = true;
        state.data = [];
        state.error = null;
      })
      .addCase(fetchCajas.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCajas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

const { setFilters, clearFilters } = slice.actions;

export { fetchCajas, setFilters, clearFilters };

//export default slice.reducer;
export default slice.reducer as Reducer<typeof initialState>;
