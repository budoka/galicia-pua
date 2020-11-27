import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apis } from 'src/api/setup-apis';
import axios from 'axios';
import { buildAxiosRequestConfig } from 'src/utils/api';
import { CajasPendientesRequestBody, CajasPendientesBodyResponse, SliceState } from './types';
import { CajasPendientes, DetalleCaja } from 'src/actions/cajas/caja-pendientes';
import { splitStringByWords } from 'src/utils/string';
import moment from 'moment';

const initialState: SliceState = {
  data: [],
  filters: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'cajas-pendientes',
  initialState,
  reducers: {
    applyFilters(state, action: PayloadAction<CajasPendientes>) {
      state.filters = action.payload;
    },
    clearData(state) {
      state.data = [];
    },
    clearFilters(state) {
      state.filters = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
    builder.addCase(fetchData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? 'Error de prueba';
    });
  },
});

// Async actions

export const fetchData = createAsyncThunk('cajas-pendientes/fetchData', async (data: CajasPendientesRequestBody, thunkApi) => {
  const { dispatch, getState } = thunkApi;

  dispatch(clearData());

  const api = apis['CAJA'];
  const resource = api.resources['DETALLE_CAJA'];
  const config = buildAxiosRequestConfig(api, resource, data);

  const response = await axios.request<CajasPendientesBodyResponse>(config);

  // Mapeo de respuesta
  const cajas = response.data.map((caja) => {
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

export const { applyFilters, clearData, clearFilters } = slice.actions;

export default slice.reducer;
