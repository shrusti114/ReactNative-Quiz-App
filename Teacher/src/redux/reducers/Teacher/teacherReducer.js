// src/redux/teacherReducer.js
import { createSlice } from "@reduxjs/toolkit";

const teacherSlice = createSlice({
  name: "teacher",
  initialState: {
    teacher: null,
  },
  reducers: {
    setTeacher: (state, action) => {
      state.teacher = action.payload;
    },
    logoutTeacher: (state) => {
      state.teacher = null;
    },
  },
});

export const { setTeacher, logoutTeacher } = teacherSlice.actions;
export default teacherSlice.reducer;
