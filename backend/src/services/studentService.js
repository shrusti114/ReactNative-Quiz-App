import bcrypt from "bcryptjs";
import Student from "../models/studentModel.js";
import { generateToken } from "../utils/tokenUtil.js";
import redisClient from "../config/redis.js";

class StudentService {
  async register(data) {
    const { name, email, password } = data;

    const existingUser = await Student.findOne({ email });
    if (existingUser) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({ name, email, password: hashedPassword });
    await newStudent.save();

    return newStudent;
  }

  async login(data) {
    const { email, password } = data;
    const student = await Student.findOne({ email });
    if (!student) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = generateToken(student._id);
    await redisClient.set(`token:${student._id}`, token);

    return { token, user: student };
  }
}

export default new StudentService();
