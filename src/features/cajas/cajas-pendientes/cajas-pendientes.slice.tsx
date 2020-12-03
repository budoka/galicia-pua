import { createAsyncThunk, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import axios from 'axios';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { apis } from 'src/api/setup-apis';
import { RootState } from 'src/reducers';
import { buildAxiosRequestConfig } from 'src/utils/api';
import { splitStringByWords } from 'src/utils/string';
import { sleep } from 'src/utils/various';
import {
  CajasPendientes,
  CajasPendientesRequestBody,
  CajasPendientesResponseBody,
  CajasPendientesSliceState,
  DetalleCaja,
  FiltrosCajas,
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

const exportCajas = createAsyncThunk<void, void, { state: RootState }>(FEATURE_NAME + '/exportCajas', async (_, thunkApi) => {
  const { dispatch, getState } = thunkApi;

  // Excel
  const workbook = new Workbook();
  // Hojas
  const sheet = workbook.addWorksheet('Datos', {
    properties: { defaultColWidth: 90 },
  });
  // Estilo del header
  sheet.getRow(1).font = {
    bold: true,
  };
  sheet.getRow(1).alignment = { horizontal: 'center' };

  // Columnas
  sheet.columns = [
    { header: 'Caja', key: 'numero', width: 20 },
    { header: 'Descripción', key: 'descripcion', width: 20 },
    { header: 'Estado', key: 'estado', width: 20 },
    { header: 'Fecha emisión', key: 'fechaEmision', width: 20 },
    { header: 'Sector', key: 'sector', width: 20 },
    { header: 'Usuario', key: 'usuario', width: 20 },
  ];

  // Filas
  const data = getState().cajas.pendientes.data;
  sheet.addRows(data);

  // Creacion de archivo
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), 'test.xlsx');

  await sleep(1000);
});

// Slice

const initialState: CajasPendientesSliceState = {
  data: [],
  filters: {},
  loading: {},
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
        state.loading.busqueda = true;
        state.data = [];
        state.error = null;
      })
      .addCase(fetchCajas.fulfilled, (state, action) => {
        state.loading.busqueda = false;
        state.data = action.payload;
      })
      .addCase(fetchCajas.rejected, (state, action) => {
        state.loading.busqueda = false;
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(exportCajas.pending, (state) => {
        state.loading.exportacion = true;
        state.error = null;
      })
      .addCase(exportCajas.fulfilled, (state) => {
        state.loading.exportacion = false;
      })
      .addCase(exportCajas.rejected, (state, action) => {
        state.loading.exportacion = false;
        state.error = action.error.message ?? null;
      });
  },
});

const { setFilters, clearFilters } = slice.actions;

export { fetchCajas, exportCajas, setFilters, clearFilters };

//export default slice.reducer;
export default slice.reducer as Reducer<typeof initialState>;
