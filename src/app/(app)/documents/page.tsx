"use client";

import { useState } from "react";

import { PlagiarismResult } from "@/types/plagiarism";
import { PlagiarismChecker } from "@/lib/plagiarismChecker";
import { checkPlagiarismAction } from "@/actions/plagiarism";

export default function PlagiarismCheckerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const response = await checkPlagiarismAction(formData);

    if (response.error) {
      setError(response.error);
    } else if (response.result) {
      setResult(response.result);
      setWordCount(response.wordCount || 0);
    }

    setIsLoading(false);
  };

  const scoreInfo = result
    ? PlagiarismChecker.getScoreCategory(result.overallScore)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Document Plagiarism Checker
          </h1>
          <p className="text-gray-600">
            Upload PDF, DOCX, or TXT files to check for potential plagiarism
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form action={handleSubmit}>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="space-y-4">
                <div className="text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 48 48"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    />
                  </svg>
                  <p className="text-lg">Select a document to check</p>
                  <p className="text-sm">Supports PDF, DOCX, and TXT files</p>
                </div>

                <input
                  type="file"
                  name="file"
                  accept=".pdf,.docx,.txt"
                  required
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Checking..." : "Check for Plagiarism"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && scoreInfo && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Plagiarism Check Results
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {wordCount}
                  </div>
                  <div className="text-sm text-gray-600">Words</div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold ${scoreInfo.color}`}>
                    {result.overallScore}%
                  </div>
                  <div className="text-sm text-gray-600">Similarity Score</div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-lg font-semibold ${scoreInfo.color}`}>
                    {scoreInfo.category}
                  </div>
                  <div className="text-sm text-gray-600">
                    {scoreInfo.description}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    result.overallScore < 15
                      ? "bg-green-500"
                      : result.overallScore < 30
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(result.overallScore, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Matched Sources */}
            {result.matchedSources.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Potential Sources Found
                </h3>
                <div className="space-y-4">
                  {result.matchedSources.map((source, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">
                          {source.title}
                        </h4>
                        <span className="text-sm font-semibold text-red-600">
                          {Math.round(source.similarity * 100)}% match
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {source.content}
                      </p>
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Source →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sentence Analysis */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Sentence Analysis</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {result.sentences.map((sentence, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      sentence.score > 0.7
                        ? "border-red-500 bg-red-50"
                        : sentence.score > 0.4
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-green-500 bg-green-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          sentence.score > 0.7
                            ? "bg-red-100 text-red-800"
                            : sentence.score > 0.4
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {Math.round(sentence.score * 100)}% similarity
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm">{sentence.text}</p>
                    {sentence.matches.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">
                          Similar content found:
                        </p>
                        {sentence.matches
                          .slice(0, 2)
                          .map((match, matchIndex) => (
                            <p
                              key={matchIndex}
                              className="text-xs text-gray-500 italic"
                            >
                              "{match.substring(0, 100)}..."
                            </p>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
