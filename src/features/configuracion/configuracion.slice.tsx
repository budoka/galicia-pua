import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { getDeviceType } from 'src/utils/mobile';
import { getScreenOrientation } from 'src/utils/screen';
import { ConfiguracionSliceState, Device, ScreenOrientation } from './types';

const FEATURE_NAME = 'configuracion';

// Slice

const initialState: ConfiguracionSliceState = {
  device: getDeviceType(),
  orientation: getScreenOrientation({ width: window.innerWidth, height: window.innerHeight }),
  collapsed: false,
  forcedCollapsed: false,
  buttonVisible: true,
  openMenu: undefined,
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
    setOpenMenu(state, action: PayloadAction<string>) {
      state.openMenu = action.payload;
    },
    toggleCollapse(state, action: PayloadAction<boolean>) {
      state.collapsed = action.payload;
    },
    toggleForcedCollapse(state, action: PayloadAction<boolean>) {
      state.forcedCollapsed = action.payload;
    },
    toggleButtonVisible(state, action: PayloadAction<boolean>) {
      state.buttonVisible = action.payload;
    },
  },
});

export const { setDevice, setOrientation, setOpenMenu, toggleCollapse, toggleForcedCollapse, toggleButtonVisible } = slice.actions;

//export default slice.reducer;
export default slice.reducer as Reducer<typeof initialState>;
