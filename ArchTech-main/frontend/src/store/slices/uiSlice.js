import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    emergencyPriority: false,
  },
  reducers: {
    setEmergencyPriority: (state, action) => {
      state.emergencyPriority = Boolean(action.payload);
    },
    toggleEmergencyPriority: (state) => {
      state.emergencyPriority = !state.emergencyPriority;
    },
  },
});

export const { setEmergencyPriority, toggleEmergencyPriority } = uiSlice.actions;

export const selectEmergencyPriority = (state) => state.ui.emergencyPriority;

export default uiSlice.reducer;
