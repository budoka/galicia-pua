import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { getEnvironment, getVar } from 'src/utils/environment';
import { getDeviceType } from 'src/utils/mobile';
import { getScreenOrientation } from 'src/utils/screen';
import { ConfiguracionSliceState, Device, ScreenOrientation } from './types';

const FEATURE_NAME = 'configuracion';

// Slice

const initialState: ConfiguracionSliceState = {
  environment: getEnvironment(),
  device: getDeviceType(),
  orientation: getScreenOrientation({ width: window.innerWidth, height: window.innerHeight }),
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    setDevice(state, action: PayloadAction<Device>) {
      state.device = action.payload;
    },
    setOrientation(state, action: PayloadAction<ScreenOrientation>) {
      state.orientation = action.payload;
    },
  },
});

export const { setDevice, setOrientation } = slice.actions;

//export default slice.reducer;
export default slice.reducer as Reducer<typeof initialState>;
