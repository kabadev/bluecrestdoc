"use server";
import { TextExtractor } from "@/lib/textExtractor";
import { PlagiarismChecker } from "@/lib/plagiarismChecker";

export async function checkPlagiarismAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { error: "No file provided" };
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        error: "Unsupported file type. Please upload PDF, DOCX, or TXT files.",
      };
    }

    // Convert File to Buffer properly
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from the document
    let extractedText: string;

    switch (file.type) {
      case "application/pdf":
        extractedText = await TextExtractor.extractFromPDF(buffer);
        break;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        extractedText = await TextExtractor.extractFromDOCX(buffer);
        break;
      case "text/plain":
        extractedText = TextExtractor.extractFromTXT(buffer);
        break;
      default:
        return { error: "Unsupported file type" };
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return { error: "Could not extract text from the document" };
    }

    // Check for plagiarism
    const result = await PlagiarismChecker.checkPlagiarism(extractedText);

    return {
      success: true,
      result,
      wordCount: extractedText.split(/\s+/).length,
    };
  } catch (error) {
    console.error("Plagiarism check error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
