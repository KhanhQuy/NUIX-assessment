import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ItemsState } from '../types/Item';
import { api } from '../services/api';

// Async thunk for fetching items
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async () => {
    return await api.fetchItems();
  }
);

const initialState: ItemsState = {
  items: [],
  selectedItemId: null,
  selectedTab: 'properties',
  loading: false,
  error: null
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    // Select an item
    selectItem(state, action: PayloadAction<string>) {
      state.selectedItemId = action.payload;
    },
    
    // Switch tab
    setTab(state, action: PayloadAction<'properties' | 'image'>) {
      state.selectedTab = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        // Auto-select first item
        if (action.payload.length > 0) {
          state.selectedItemId = action.payload[0].guid;
        }
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load items';
      });
  }
});

export const { selectItem, setTab } = itemsSlice.actions;
export default itemsSlice.reducer;
