export class TextExtractor {
  static async extractFromPDF(buffer: Buffer): Promise<string> {
    try {
      // Dynamic import to ensure it only runs on server
      const pdf = (await import("pdf-parse")).default;
      const data = await pdf(buffer);
      return data.text;
    } catch (error) {
      throw new Error(`Failed to extract text from PDF: ${error}`);
    }
  }

  static async extractFromDOCX(buffer: Buffer): Promise<string> {
    try {
      // Dynamic import to ensure it only runs on server
      const mammoth = (await import("mammoth")).default;
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      throw new Error(`Failed to extract text from DOCX: ${error}`);
    }
  }

  static extractFromTXT(buffer: Buffer): string {
    return buffer.toString("utf-8");
  }
}
