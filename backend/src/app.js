import express from "express";
import cors from "cors";
import "./config/env.js";
import { connectDB } from "./config/db.js";
import router from "./routes/router.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", router);

connectDB();

export default app;
