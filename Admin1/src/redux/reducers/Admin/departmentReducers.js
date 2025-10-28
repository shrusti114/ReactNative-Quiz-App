import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  departments: [],
  loading: false,
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    setDepartments: (state, action) => {
      state.departments = action.payload;
    },
    addDepartment: (state, action) => {
      state.departments.push(action.payload);
    },
    updateDepartment: (state, action) => {
      const index = state.departments.findIndex(
        (dept) => dept.department_id === action.payload.department_id
      );
      if (index >= 0) {
        state.departments[index] = action.payload;
      }
    },
    deleteDepartment: (state, action) => {
      state.departments = state.departments.filter(
        (dept) => dept.department_id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// Export actions
export const { setDepartments, addDepartment, updateDepartment, deleteDepartment, setLoading } =
  departmentSlice.actions;

// Export reducer
export default departmentSlice.reducer;
