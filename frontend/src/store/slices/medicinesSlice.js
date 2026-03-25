import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getMedicines as fetchMedicinesApi } from '../../api/medicines';

export const fetchMedicines = createAsyncThunk(
  'medicines/fetchMedicines',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchMedicinesApi();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const medicinesSlice = createSlice({
  name: 'medicines',
  initialState: {
    items: [],
    searchQuery: '',
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = action.payload ?? [];
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load medicines';
      });
  },
});

export const { setSearchQuery, clearError } = medicinesSlice.actions;

export const selectMedicines = (state) => state.medicines.items;
export const selectMedicinesLoading = (state) => state.medicines.loading;
export const selectMedicinesError = (state) => state.medicines.error;
export const selectSearchQuery = (state) => state.medicines.searchQuery;

export const selectFilteredMedicines = (state) => {
  const { items, searchQuery } = state.medicines;
  if (!searchQuery?.trim()) return items;
  const q = searchQuery.toLowerCase();
  return items.filter(
    (m) =>
      m.name?.toLowerCase().includes(q) ||
      m.category?.toLowerCase().includes(q)
  );
};

export default medicinesSlice.reducer;
