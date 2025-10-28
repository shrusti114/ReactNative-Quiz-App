import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teachers: [],
  loading: false,
};

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    setTeachers: (state, action) => {
      state.teachers = action.payload;
    },
    addTeacher: (state, action) => {
      state.teachers.push(action.payload);
    },
    updateTeacher: (state, action) => {
      const index = state.teachers.findIndex(
        (t) => t.teacher_id === action.payload.teacher_id
      );
      if (index >= 0) state.teachers[index] = action.payload;
    },
    deleteTeacher: (state, action) => {
      state.teachers = state.teachers.filter(
        (t) => t.teacher_id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  setLoading,
} = teacherSlice.actions;

export default teacherSlice.reducer;
