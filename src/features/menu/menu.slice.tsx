import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { MenuSliceState } from './types';

const FEATURE_NAME = 'menu';

// Slice

const initialState: MenuSliceState = {
  collapsed: false,
  forcedCollapsed: false,
  buttonVisible: true,
  openMenu: undefined,
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
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

export const { setOpenMenu, toggleCollapse, toggleForcedCollapse, toggleButtonVisible } = slice.actions;

//export default slice.reducer;
export default slice.reducer as Reducer<typeof initialState>;
