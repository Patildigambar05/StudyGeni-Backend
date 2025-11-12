import File from "../model/FileModel.js";
import { generateAISummary, generateAIQuiz } from "../utils/aiHelper.js";

export const viewAllFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });

    if (!files || files.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No files found.",
      });
    }

    res.status(201).json({
      success: true,
      count: files.length,
      files,
    });
  } catch (error) {
    console.error("Get All Files Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching All files",
    });
  }
};

export const viewMaterialDetails = async (req, res) => {
  try {
    const { id: materialId } = req.params;
    const material = await File.findById(materialId).populate(
      "createdBy",
      "username email role"
    );

    if (!material) {
      res.status(404).json({
        success: false,
        message: "Study material not found",
      });
    }

    res.status(201).json({
      success: true,
      material,
    });
  } catch (error) {
    console.error("Get file details error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching file details",
    });
  }
};

export const getFileSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "File not found" });

    // --- UPDATE THIS LINE ---
    // Pass the mimetype from the file object
    const summary = await generateAISummary(
      file.fileUrl,
      file.mimetype,
      file.title
    );
    // ----------------------

    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("AI Summary Error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating summary",
      error: error.message,
    });
  }
};

export const getFileQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "File not found" });

    // --- UPDATE THIS LINE ---
    // Pass the mimetype from the file object
    const quiz = await generateAIQuiz(file.fileUrl, file.mimetype, file.title);
    // ----------------------

    res.status(200).json({ success: true, quiz });
  } catch (error) {
    console.error("AI Quiz Error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating quiz",
      error: error.message,
    });
  }
};
