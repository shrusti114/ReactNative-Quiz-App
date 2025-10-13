import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loginTeacher = createAsyncThunk(
  "teacher/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5000/teacher/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const teacherSlice = createSlice({
  name: "teacher",
  initialState: { teacher: null, loading: false, error: null },
  reducers: { logout: (state) => { state.teacher = null; state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(loginTeacher.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginTeacher.fulfilled, (state, action) => { state.loading = false; state.teacher = action.payload; })
      .addCase(loginTeacher.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logout } = teacherSlice.actions;
export default teacherSlice.reducer;
