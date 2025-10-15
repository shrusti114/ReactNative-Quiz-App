import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', { username, password });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    admin: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.admin = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
