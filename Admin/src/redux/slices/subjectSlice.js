import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const apiUrl = "http://localhost:5000";

// Fetch all subjects
export const fetchSubjects = createAsyncThunk("subjects/fetchSubjects", async () => {
  const res = await fetch(`${apiUrl}/subjects`);
  return res.json();
});

// Add a new subject
export const addSubject = createAsyncThunk("subjects/addSubject", async (subject) => {
  const res = await fetch(`${apiUrl}/subjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subject),
  });
  return res.json();
});

// Update a subject
export const updateSubject = createAsyncThunk("subjects/updateSubject", async ({ id, data }) => {
  const res = await fetch(`${apiUrl}/subjects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
});

// Delete a subject
export const deleteSubject = createAsyncThunk("subjects/deleteSubject", async (id) => {
  const res = await fetch(`${apiUrl}/subjects/${id}`, { method: "DELETE" });
  return res.json();
});

const subjectSlice = createSlice({
  name: "subjects",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSubjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addSubject.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        const index = state.list.findIndex((s) => s._id === action.meta.arg.id);
        if (index !== -1) state.list[index] = { ...state.list[index], ...action.meta.arg.data };
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s._id !== action.meta.arg);
      });
  },
});

export default subjectSlice.reducer;
