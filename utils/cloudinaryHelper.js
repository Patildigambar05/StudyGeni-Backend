import cloudinary from "../config/cloud.js";

// Helper function for streaming upload
export const uploadDocumentToCloudinary = async (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw", //  must be 'raw' for non-image files
        folder: folderName || "documents",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};