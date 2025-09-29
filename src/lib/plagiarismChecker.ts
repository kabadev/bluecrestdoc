import {
  PlagiarismResult,
  MatchedSource,
  SentenceResult,
  KnownSource,
} from "@/types/plagiarism";

export class PlagiarismChecker {
  private static readonly SIMILARITY_THRESHOLD = 0.7;
  private static readonly SENTENCE_MIN_LENGTH = 10;

  // Sample database of known sources (in real app, this would be a database)
  private static knownSources: KnownSource[] = [
    {
      title: "Academic Paper on Climate Change",
      content:
        "Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations are natural, scientific evidence shows that human activities have been the main driver of climate change since the 1800s.",
      url: "https://example.com/climate-paper",
    },
    {
      title: "Wikipedia Article on Artificial Intelligence",
      content:
        "Artificial intelligence is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction.",
      url: "https://wikipedia.org/ai",
    },
    // Add more sources as needed
  ];

  static async checkPlagiarism(text: string): Promise<PlagiarismResult> {
    const sentences = this.splitIntoSentences(text);
    const sentenceResults: SentenceResult[] = [];
    const matchedSources: Set<MatchedSource> = new Set();

    // Dynamic import for server-side only
    const { compareTwoStrings } = await import("string-similarity");

    let totalSimilarityScore = 0;
    let checkedSentences = 0;

    // Check each sentence against known sources
    for (const sentence of sentences) {
      if (sentence.length < this.SENTENCE_MIN_LENGTH) continue;

      const sentenceResult = await this.checkSentence(sentence);
      sentenceResults.push(sentenceResult);

      if (sentenceResult.score > this.SIMILARITY_THRESHOLD) {
        // Find and add matched sources
        for (const source of this.knownSources) {
          const similarity = compareTwoStrings(
            sentence.toLowerCase(),
            source.content.toLowerCase()
          );
          if (similarity > this.SIMILARITY_THRESHOLD) {
            matchedSources.add({
              ...source,
              similarity: similarity,
            });
          }
        }
      }

      totalSimilarityScore += sentenceResult.score;
      checkedSentences++;
    }

    // Check against web sources (simplified - in production use actual search APIs)
    const webMatches = await this.checkAgainstWeb(text);
    webMatches.forEach((source) => matchedSources.add(source));

    const overallScore =
      checkedSentences > 0
        ? (totalSimilarityScore / checkedSentences) * 100
        : 0;

    return {
      originalText: text,
      similarityScore: Math.round(overallScore * 100) / 100,
      matchedSources: Array.from(matchedSources),
      overallScore: Math.round(overallScore * 100) / 100,
      sentences: sentenceResults,
    };
  }

  private static splitIntoSentences(text: string): string[] {
    // Split text into sentences using regex (more reliable than natural tokenizer)
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.map((s) => s.trim()).filter((s) => s.length > 0);
  }

  private static async checkSentence(
    sentence: string
  ): Promise<SentenceResult> {
    const matches: string[] = [];
    let maxScore = 0;

    // Dynamic import for server-side only
    const { compareTwoStrings } = await import("string-similarity");

    // Check against known sources
    for (const source of this.knownSources) {
      const sourceSentences = this.splitIntoSentences(source.content);

      for (const sourceSentence of sourceSentences) {
        const similarity = compareTwoStrings(
          sentence.toLowerCase(),
          sourceSentence.toLowerCase()
        );

        if (similarity > this.SIMILARITY_THRESHOLD) {
          matches.push(sourceSentence);
          maxScore = Math.max(maxScore, similarity);
        }
      }
    }

    return {
      text: sentence,
      score: Math.round(maxScore * 100) / 100,
      matches,
    };
  }

  private static async checkAgainstWeb(text: string): Promise<MatchedSource[]> {
    // In a real implementation, you would:
    // 1. Use Google Custom Search API or similar
    // 2. Search for phrases from the text
    // 3. Fetch and compare content from results
    // 4. Return matched sources with similarity scores

    // For demo purposes, returning empty array
    // You can integrate with APIs like:
    // - Google Custom Search API
    // - Bing Search API
    // - Academic databases like CrossRef, arXiv

    return [];
  }

  static getScoreCategory(score: number): {
    category: string;
    color: string;
    description: string;
  } {
    if (score < 15) {
      return {
        category: "Low Risk",
        color: "text-green-600",
        description: "Minimal similarity detected",
      };
    } else if (score < 30) {
      return {
        category: "Medium Risk",
        color: "text-yellow-600",
        description: "Some similarity detected, review recommended",
      };
    } else {
      return {
        category: "High Risk",
        color: "text-red-600",
        description: "Significant similarity detected, requires attention",
      };
    }
  }
}
