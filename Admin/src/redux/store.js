import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice";
import departmentReducer from "./slices/departmentSlice";
import teacherReducer from "./slices/teacherSlice";
import subjectReducer from "./slices/subjectSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    departments: departmentReducer,
    teachers: teacherReducer,
    subjects: subjectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [
          "departments.list",
          "admin.list",
          "teachers.list",
          "subjects.list",
        ],
        ignoredActions: [
          "departments/fetchDepartments/fulfilled",
          "departments/addDepartment/fulfilled",
          "teachers/fetchTeachers/fulfilled",
          "teachers/addTeacher/fulfilled",
          "subjects/fetchSubjects/fulfilled",
          "subjects/addSubject/fulfilled",
        ],
      },
    }),
});
