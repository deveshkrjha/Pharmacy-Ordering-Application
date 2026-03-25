import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // { medicineId, name, price, quantity }
  },
  reducers: {
    addToCart: (state, action) => {
      const { medicineId, name, price, quantity = 1, requiresPrescription } = action.payload;
      const existing = state.items.find((i) => i.medicineId === medicineId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ medicineId, name, price, quantity, requiresPrescription: Boolean(requiresPrescription) });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.medicineId !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { medicineId, quantity } = action.payload;
      const item = state.items.find((i) => i.medicineId === medicineId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.medicineId !== medicineId);
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export default cartSlice.reducer;
