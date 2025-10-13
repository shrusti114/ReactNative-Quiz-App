import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://127.0.0.1:5000/departments";

// Fetch all departments from server
export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch departments");
    return res.json();
  }
);

// Add a department
export const addDepartment = createAsyncThunk(
  "departments/addDepartment",
  async ({ name }) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add department");
    return data.department;
  }
);

// Delete a department
export const deleteDepartment = createAsyncThunk(
  "departments/deleteDepartment",
  async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete department");
    return id;
  }
);

// For simplicity, update will only change name
export const updateDepartment = createAsyncThunk(
  "departments/updateDepartment",
  async ({ id, name }) => {
    // Here your server doesn't have PUT, so we delete + add (or you can add PUT)
    throw new Error("Update API not implemented on server yet");
  }
);

const departmentsSlice = createSlice({
  name: "departments",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchDepartments.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDepartments.fulfilled, (state, action) => { state.list = action.payload; state.loading = false; })
      .addCase(fetchDepartments.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      // Add
      .addCase(addDepartment.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addDepartment.fulfilled, (state, action) => { state.list.push(action.payload); state.loading = false; })
      .addCase(addDepartment.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      // Delete
      .addCase(deleteDepartment.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteDepartment.fulfilled, (state, action) => { state.list = state.list.filter(dep => dep._id !== action.payload); state.loading = false; })
      .addCase(deleteDepartment.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default departmentsSlice.reducer;
