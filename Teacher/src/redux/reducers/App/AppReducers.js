import { combineReducers } from "@reduxjs/toolkit";
import teacherReducer from "./Admin/teacherReducers";
import appReducer from "./App/AppReducer";

const rootReducer = combineReducers({
  teacher: teacherReducer,
  app: appReducer,
});

export default rootReducer;
