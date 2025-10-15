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
        (d) => d.department_id === action.payload.department_id
      );
      if (index >= 0) state.departments[index] = action.payload;
    },
    deleteDepartment: (state, action) => {
      state.departments = state.departments.filter(
        (d) => d.department_id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setDepartments, addDepartment, updateDepartment, deleteDepartment, setLoading } =
  departmentSlice.actions;

export default departmentSlice.reducer;
