import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  //   if (file.mimetype.startsWith("application/")) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error("Invalid file type"));
  //   }

  const allowedTypes = [
    "application/pdf", // PDF
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, Word, and PowerPoint files are allowed."
      )
    );
  }
};

export const upload = multer({ storage, fileFilter });
