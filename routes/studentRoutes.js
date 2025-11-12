import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  getFileQuiz,
  getFileSummary,
  viewAllFiles,
  viewMaterialDetails,
} from "../controller/studentController.js";

const router = express.Router();

router.get("/files/viewAllFiles", protectRoute, viewAllFiles);
router.get("/files/:id", protectRoute, viewMaterialDetails);
router.get("/files/:id/summary", protectRoute, getFileSummary);
router.get("/files/:id/quiz", protectRoute, getFileQuiz);

export default router;
