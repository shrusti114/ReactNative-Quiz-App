// src/redux/slices/subjectSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "http://localhost:5000/subjects";

// Fetch all subjects
export const fetchSubjects = createAsyncThunk("subjects/fetch", async () => {
  const res = await fetch(BASE_URL);
  return await res.json();
});

// Add subject
export const addSubject = createAsyncThunk("subjects/add", async (subject) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subject),
  });
  return await res.json();
});

// Delete subject
export const deleteSubject = createAsyncThunk("subjects/delete", async (id) => {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return id;
});

const subjectSlice = createSlice({
  name: "subjects",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(addSubject.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item._id !== action.payload);
      });
  },
});

export default subjectSlice.reducer;
