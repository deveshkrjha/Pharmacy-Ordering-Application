import { configureStore } from '@reduxjs/toolkit';
import medicinesReducer from './slices/medicinesSlice';
import uiReducer from './slices/uiSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    medicines: medicinesReducer,
    ui: uiReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});
