import File from "../model/FileModel.js";
import { uploadDocumentToCloudinary } from "../utils/cloudinaryHelper.js";

export const uploadStudyMaterial = async (req, res) => {
  try {
    const { title, description, subject } = req.body;

    if (!title || !description || !subject) {
      return res.status(400).json({
        message: "Title, description, and subject are required!",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded!",
      });
    } // Upload file to Cloudinary

    // --- 1. REMOVED ---
    // The PDF-only validation block is GONE.
    // Your multer 'fileFilter' handles validation now.
    // ------------------

    // Note: Your helper only takes 2 args, the 3rd is ignored
    const result = await uploadDocumentToCloudinary(req.file.buffer, "files"); // Save document metadata in DB

    const newFile = await File.create({
      title,
      description,
      subject,
      fileUrl: result.secure_url,
      createdBy: req.user._id,
      // --- 2. ADDED ---
      // This is the crucial line to save the file type
      mimetype: req.file.mimetype,
      // ----------------
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully!",
      file: newFile,
    });
  } catch (error) {
    console.error("Document Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading document",
      error: error.message,
    });
  }
};
export const viewMyUploads = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const files = await File.find({ createdBy: teacherId }).sort({
      createdAt: -1,
    });

    if (!files || files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No files found for this teacher.",
      });
    }
    res.status(200).json({
      success: true,
      count: files.length,
      files,
    });
  } catch (error) {
    console.error("Get Teacher Files Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching uploaded files",
    });
  }
};
