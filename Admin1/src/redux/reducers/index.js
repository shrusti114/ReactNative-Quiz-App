import { combineReducers } from "@reduxjs/toolkit";
import departmentReducer from "./Admin/departmentReducers";
import subjectReducer from "./Admin/subjectReducers";
import teacherReducer from "./Admin/teacherReducers";  // ✅ Added teacher reducer
import appReducer from "./App/AppReducer";

const rootReducer = combineReducers({
  department: departmentReducer,
  subject: subjectReducer,
  teacher: teacherReducer,   // ✅ Added teacher reducer here
  app: appReducer,           // ✅ Make sure app reducer is included too
});

export default rootReducer;
