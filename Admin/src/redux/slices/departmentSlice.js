import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ---------------- Async Thunks ----------------

// Fetch all departments
export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async () => {
    const res = await fetch("http://localhost:5000/departments");    const data = await res.json();
    return data.map(dep => ({
      ...dep,
      created_at: new Date(dep.created_at).toISOString(),
    }));
  }
);

// Add new department
export const addDepartment = createAsyncThunk(
  "departments/addDepartment",
  async (department) => {
    const res = await fetch("http://localhost:5000/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(department),
    });
    const data = await res.json();
    return {
      ...data.department,
      created_at: new Date(data.department.created_at).toISOString(),
    };
  }
);

// Update department
export const updateDepartment = createAsyncThunk(
  "departments/updateDepartment",
  async ({ id, name }) => {
    await fetch(`http://localhost:5000/departments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    return { id, name };
  }
);

// Delete department
export const deleteDepartment = createAsyncThunk(
  "departments/deleteDepartment",
  async (id) => {
    await fetch(`http://localhost:5000/departments/${id}`, {
      method: "DELETE",
    });
    return id;
  }
);

// ---------------- Slice ----------------
const departmentSlice = createSlice({
  name: "departments",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add
      .addCase(addDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(dep => dep._id === action.payload.id);
        if (index !== -1) state.list[index].name = action.payload.name;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(dep => dep._id !== action.payload);
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default departmentSlice.reducer;
