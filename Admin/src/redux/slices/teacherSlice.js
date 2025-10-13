import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const apiUrl = "http://localhost:5000";

// Fetch all teachers
export const fetchTeachers = createAsyncThunk("teachers/fetchTeachers", async () => {
  const res = await fetch(`${apiUrl}/teachers`);
  return res.json();
});

// Add a new teacher
export const addTeacher = createAsyncThunk("teachers/addTeacher", async (teacher) => {
  const res = await fetch(`${apiUrl}/teachers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(teacher),
  });
  return res.json();
});

// Update a teacher
export const updateTeacher = createAsyncThunk("teachers/updateTeacher", async ({ id, data }) => {
  const res = await fetch(`${apiUrl}/teachers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
});

// Delete a teacher
export const deleteTeacher = createAsyncThunk("teachers/deleteTeacher", async (id) => {
  const res = await fetch(`${apiUrl}/teachers/${id}`, { method: "DELETE" });
  return res.json();
});

const teacherSlice = createSlice({
  name: "teachers",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchTeachers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addTeacher.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t._id === action.meta.arg.id);
        if (index !== -1) state.list[index] = { ...state.list[index], ...action.meta.arg.data };
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.meta.arg);
      });
  },
});

export default teacherSlice.reducer;
