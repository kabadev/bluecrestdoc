export interface PlagiarismResult {
  originalText: string;
  similarityScore: number;
  matchedSources: MatchedSource[];
  overallScore: number;
  sentences: SentenceResult[];
}

export interface KnownSource {
  url?: string;
  title: string;
  content: string;
}

export interface MatchedSource extends KnownSource {
  similarity: number;
}

export interface SentenceResult {
  text: string;
  score: number;
  matches: string[];
}
