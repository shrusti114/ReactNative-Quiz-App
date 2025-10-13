import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchStudents = createAsyncThunk(
  "student/fetchAll",
  async () => {
    const res = await fetch("http://localhost:5000/students");
    return await res.json();
  }
);

export const fetchScores = createAsyncThunk(
  "student/fetchScores",
  async () => {
    const res = await fetch("http://localhost:5000/scores");
    return await res.json();
  }
);

const studentSlice = createSlice({
  name: "student",
  initialState: { students: [], scores: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => { state.loading = true; })
      .addCase(fetchStudents.fulfilled, (state, action) => { state.loading = false; state.students = action.payload; })
      .addCase(fetchStudents.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(fetchScores.pending, (state) => { state.loading = true; })
      .addCase(fetchScores.fulfilled, (state, action) => { state.loading = false; state.scores = action.payload; })
      .addCase(fetchScores.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  }
});

export default studentSlice.reducer;
