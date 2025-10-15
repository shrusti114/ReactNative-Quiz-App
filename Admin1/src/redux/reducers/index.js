import { combineReducers } from "@reduxjs/toolkit";
import departmentReducer from "./Admin/departmentReducers";
import appReducer from "./App/AppReducer";

const rootReducer = combineReducers({
  departments: departmentReducer,
  app: appReducer,
});

export default rootReducer;
