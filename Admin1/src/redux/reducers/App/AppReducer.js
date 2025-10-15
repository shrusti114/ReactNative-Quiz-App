import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  appName: "Admin Panel",
  loading: false,
  error: null,
};

const AppReducer = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setLoading, setError, clearError } = AppReducer.actions;

export default AppReducer.reducer;
