import express from "express";
import dbConnect from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import teacherRoutes from "../routes/teacherRoutes.js";
import studentRoutes from "../routes/studentRoutes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse incoming JSON requests and attach the parsed data to req.body
dbConnect();

app.use("/api/auth", authRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the StudyGeni Platform !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (req, res) => {
  console.log(`Listening on Port ${PORT}`);
});
