// REPLACEMENT FOR: aiHelper.js

import { ai, GEMINI_MODEL } from "../config/ai.js";
import fetch from "node-fetch";

const getMimeTypeFromExtension = (fileUrl) => {
  try {
    const pathname = new URL(fileUrl).pathname;
    const ext = pathname.split(".").pop()?.toLowerCase();

    const map = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };
    return map[ext]; // Will be undefined if extension is not in the map
  } catch (error) {
    console.error("Invalid file URL:", fileUrl, error);
    return undefined;
  }
};

const safeGeminiText = (response) => {
  try {
    if (response?.response?.text) return response.response.text();
    if (response?.candidates?.length)
      return response.candidates
        .map((c) => c.content?.parts?.map((p) => p.text).join(" "))
        .join(" ");
    return "⚠️ No text returned from Gemini.";
  } catch {
    return "⚠️ Unexpected response format.";
  }
};

export const generateAISummary = async (fileUrl, mimeType, title) => {
  // mimeType is now passed from your database
  if (!mimeType) {
    throw new Error("MIME type is missing for this file.");
  }

  // Optional: Check if the type is one we even support
  const supportedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  if (!supportedTypes.includes(mimeType)) {
    throw new Error(
      `Unsupported file type: ${mimeType}. Only PDF, DOCX, and PPTX are allowed.`
    );
  }

  try {
    // This logic now works for all 3 types
    const res = await fetch(fileUrl);
    if (!res.ok) throw new Error(`Failed to fetch file: ${res.statusText}`);
    const fileBuffer = await res.arrayBuffer();

    const contents = [
      {
        text: "Summarize this document in clear, concise bullet points for students.",
      },
      {
        inlineData: {
          mimeType: mimeType, // Use the correct type from DB
          data: Buffer.from(fileBuffer).toString("base64"),
        },
      },
    ];

    const result = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
    });
    return safeGeminiText(result);
  } catch (error) {
    console.error("AI Summary Error:", error);
    throw error;
  }
};

// REWRITTEN: generateAIQuiz
export const generateAIQuiz = async (fileUrl, mimeType, title) => {
  // mimeType is now passed from your database
  if (!mimeType) {
    throw new Error("MIME type is missing for this file.");
  }

  const supportedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  if (!supportedTypes.includes(mimeType)) {
    throw new Error(
      `Unsupported file type: ${mimeType}. Only PDF, DOCX, and PPTX are allowed.`
    );
  }

  try {
    // This logic now works for all 3 types
    const res = await fetch(fileUrl);
    if (!res.ok) throw new Error(`Failed to fetch file: ${res.statusText}`);
    const fileBuffer = await res.arrayBuffer();

    const contents = [
      {
        text: `Generate 5 multiple-choice questions from this document. 
                 Each question must have 4 options and specify the correct answer in JSON format.`,
      },
      {
        inlineData: {
          mimeType: mimeType, // Use the correct type from DB
          data: Buffer.from(fileBuffer).toString("base64"),
        },
      },
    ];

    const result = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
    });
    return safeGeminiText(result);
  } catch (error) {
    console.error("AI Quiz Error:", error);
    throw error;
  }
};
