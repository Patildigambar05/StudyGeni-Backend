import express from "express";
import { isTeacher, protectRoute } from "../middleware/authMiddleware.js";
import {
  uploadStudyMaterial,
  viewMyUploads,
} from "../controller/teacherController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/files/upload-study-material",
  protectRoute,
  isTeacher,
  upload.single("file"),
  uploadStudyMaterial
);

router.get("/files/viewMyUploads", protectRoute, isTeacher, viewMyUploads);

export default router;
