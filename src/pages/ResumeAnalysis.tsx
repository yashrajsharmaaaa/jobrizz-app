import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { FileUpload } from '../components/upload/FileUpload';
import { ATSScoreCard } from '../components/analysis/ATSScoreCard';
import { AIRecommendations } from '../components/analysis/AIRecommendations';
import { AIResumeCorrectorComponent } from '../components/analysis/AIResumeCorrector';
import { FileUploadErrorBoundary, AIErrorBoundary } from '../components/ErrorBoundary';
import { ResumeParser } from '../services/resumeParser';
import type { ResumeAnalysis, UploadResult } from '../types/analysis';

const ResumeAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File): Promise<UploadResult> => {

    setError(null);
    
    try {
      // Extract text from file
      const extractedText = await ResumeParser.parseFile(file);
      
      // Analyze the resume
      const resumeAnalysis = await ResumeParser.analyzeResume(file, extractedText);
      
      setAnalysis(resumeAnalysis);
      
      // Save analysis to localStorage for job matching
      localStorage.setItem('jobrizz_latest_resume_analysis', JSON.stringify(resumeAnalysis));
      
      return {
        success: true,
        analysis: resumeAnalysis,
        processingTime: Date.now() - Date.now(), // This would be calculated properly
      };
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze resume';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        processingTime: 0,
      };
    }
  };

  const handleAnalysisComplete = (result: UploadResult) => {
    if (result.success && result.analysis) {
      console.log('Analysis completed:', result.analysis);
    } else {
      console.error('Analysis failed:', result.error);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Home
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Resume Analysis
                </h1>
                <p className="text-gray-600 mt-1">
                  Get your ATS compatibility score and optimization recommendations
                </p>
              </div>
            </div>
            
            {analysis && (
              <button
                onClick={resetAnalysis}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Analyze New Resume
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!analysis ? (
          /* Upload Section */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <DocumentTextIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Upload Your Resume
              </h2>
              <p className="text-gray-600">
                Get instant feedback on your resume's ATS compatibility and receive 
                personalized recommendations to improve your chances of getting noticed.
              </p>
            </div>

            <FileUploadErrorBoundary>
              <FileUpload
                onUpload={handleFileUpload}
                onAnalysisComplete={handleAnalysisComplete}
                className="mb-8"
              />
            </FileUploadErrorBoundary>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="text-red-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-900">Analysis Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Features Preview */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <ChartBarIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">ATS Score</h3>
                <p className="text-sm text-gray-600">
                  Get a comprehensive score showing how well your resume works with ATS systems
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <DocumentTextIcon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Content Analysis</h3>
                <p className="text-sm text-gray-600">
                  Detailed breakdown of your resume's content, keywords, and structure
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                <svg className="w-8 h-8 text-purple-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Recommendations</h3>
                <p className="text-sm text-gray-600">
                  Actionable suggestions to improve your resume and increase your job prospects
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-8">
            {/* Analysis Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Analysis Results
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {analysis.fileName} • {(analysis.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Analyzed on {analysis.uploadedAt.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {analysis.contentAnalysis.wordCount} words • {analysis.contentAnalysis.pageCount} pages
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        const { PDFExportService } = await import('../services/pdfExport');
                        // Use hybrid export - server-side when available, client-side fallback
                        await PDFExportService.exportPDFHybrid(
                          analysis.fileName,
                          analysis.extractedText,
                          true, // isOriginal = true
                          undefined // userId - will be available when auth is implemented
                        );
                      } catch (error) {
                        console.error('PDF export failed:', error);
                      }
                    }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    Download Original PDF
                  </button>
                </div>
              </div>
            </div>

            {/* ATS Score */}
            <ATSScoreCard score={analysis.atsScore} />

            {/* AI-Powered Recommendations */}
            <AIErrorBoundary>
              <AIRecommendations analysis={analysis} />
            </AIErrorBoundary>

            {/* AI Resume Corrector */}
            <AIErrorBoundary>
              <AIResumeCorrectorComponent 
                analysis={analysis} 
                recommendations={analysis.recommendations}
              />
            </AIErrorBoundary>

            {/* Content Analysis */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Analysis</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {analysis.contentAnalysis.wordCount}
                  </div>
                  <div className="text-sm text-gray-600">Words</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {analysis.contentAnalysis.pageCount}
                  </div>
                  <div className="text-sm text-gray-600">Pages</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {analysis.contentAnalysis.readabilityScore}
                  </div>
                  <div className="text-sm text-gray-600">Readability</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {analysis.contentAnalysis.actionVerbs.length}
                  </div>
                  <div className="text-sm text-gray-600">Action Verbs</div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recommendations ({analysis.recommendations.length})
                </h3>
                <div className="space-y-4">
                  {analysis.recommendations.map((rec) => (
                    <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{rec.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                          {rec.examples && rec.examples.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-gray-700 mb-1">Examples:</p>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {rec.examples.map((example, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-gray-400 mr-2">•</span>
                                    {example}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex flex-col items-end space-y-1">
                          <span className={`
                            px-2 py-1 text-xs font-medium rounded-full
                            ${rec.impact === 'high' ? 'bg-red-100 text-red-800' :
                              rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'}
                          `}>
                            {rec.impact} impact
                          </span>
                          <span className={`
                            px-2 py-1 text-xs font-medium rounded-full
                            ${rec.effort === 'difficult' ? 'bg-red-100 text-red-800' :
                              rec.effort === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'}
                          `}>
                            {rec.effort}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalysisPage;