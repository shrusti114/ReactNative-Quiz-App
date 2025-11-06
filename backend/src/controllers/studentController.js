import studentService from "../services/studentService.js";
import { successResponse, errorResponse } from "../utils/responseUtil.js";

export const register = async (req, res) => {
  try {
    const student = await studentService.register(req.body);
    successResponse(res, "Student registered successfully", student);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const result = await studentService.login(req.body);
    successResponse(res, "Login successful", result);
  } catch (error) {
    errorResponse(res, error.message);
  }
};
