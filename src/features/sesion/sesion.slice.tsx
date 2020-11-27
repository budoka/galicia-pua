import { Action, createAsyncThunk, createSlice, PayloadAction, Reducer, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import { apis } from 'src/api/setup-apis';
import { RootState } from 'src/reducers';
import { buildAxiosRequestConfig } from 'src/utils/api';
import { splitStringByWords } from 'src/utils/string';
import { InfoAzure, InfoSesion, SesionResponseBody, SesionSliceState } from './types';

const FEATURE_NAME = 'sesion';

// Async actions

const fetchInfoSesion = createAsyncThunk<InfoSesion, InfoAzure, { state: RootState }>(
  FEATURE_NAME + '/fetchInfoSesion',
  async (data: InfoAzure, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    // Mapeo de la solicitud
    const requestData: InfoAzure = {
      ...data,
    };

    // Configuracion del servicio
    const api = apis['INFO_SESION'];
    const resource = api.resources['INFO_SESION'];
    const config = buildAxiosRequestConfig(api, resource, requestData);

    // Respuesta del servicio
    const response = await axios.request<SesionResponseBody>(config);
    const responseData = response.data;

    // Mapeo de la respuesta
    const infoSesion: InfoSesion = {
      idUsuario: responseData.idUsuario,
      idSector: responseData.idSector,
      nombreSector: responseData.descripcionSector,
      perfil: responseData.roles && responseData.roles.length > 0 ? responseData.roles[0].descripcion : undefined,
      legajo: data.legajo,
      nombreUsuario: data.nombreUsuario,
    };

    return infoSesion;
  },
);

// Slice

const initialState: SesionSliceState = {
  data: {},
  loading: false,
  error: null,
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInfoSesion.pending, (state) => {
        state.loading = true;
        state.data = {};
        state.error = null;
      })
      .addCase(fetchInfoSesion.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInfoSesion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error de prueba';
      });
  },
});

export { fetchInfoSesion };

//export default slice.reducer;
export default slice.reducer as Reducer<typeof initialState>;
