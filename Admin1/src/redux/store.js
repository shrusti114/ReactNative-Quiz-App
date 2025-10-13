// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import departmentReducer from "./slices/departmentSlice";
import teacherReducer from "./slices/teacherSlice";
import subjectReducer from "./slices/subjectSlice";

const store = configureStore({
  reducer: {
    departments: departmentReducer,
    teachers: teacherReducer,
    subjects: subjectReducer,
  },
});

export default store;
