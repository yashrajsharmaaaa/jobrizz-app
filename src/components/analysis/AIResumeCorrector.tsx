import React, { useState } from 'react';
import { 
  SparklesIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useToast } from '../ui/Toast';
import { AIResumeCorrector, type CorrectionResult, type TextChange } from '../../services/aiResumeCorrector';
import type { ResumeAnalysis } from '../../types/analysis';

interface AIResumeCorrectorProps {
  analysis: ResumeAnalysis;
  recommendations: any[]; // Using any[] to match existing Recommendation type
  className?: string;
}

export const AIResumeCorrectorComponent: React.FC<AIResumeCorrectorProps> = ({
  analysis,
  recommendations,
  className = '',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [correctionResult, setCorrectionResult] = useState<CorrectionResult | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const toast = useToast();

  const handleCorrectResume = async () => {
    if (recommendations.length === 0) {
      toast.warning('No Recommendations', 'No AI recommendations available to apply');
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await AIResumeCorrector.correctResume(
        analysis.extractedText,
        recommendations
      );
      
      setCorrectionResult(result);
      toast.success(
        'Resume Corrected!', 
        `Applied ${result.appliedRecommendations.length} recommendations with ${result.improvementScore}% improvement`
      );
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to correct resume';
      toast.error('Correction Failed', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadCorrected = async () => {
    if (!correctionResult) return;

    try {
      const { PDFExportService } = await import('../../services/pdfExport');
      // Use hybrid export - server-side when available, client-side fallback
      await PDFExportService.exportPDFHybrid(
        analysis.fileName,
        correctionResult.correctedText,
        false, // isOriginal = false for corrected version
        undefined // userId - will be available when auth is implemented
      );
      
      toast.success('Downloaded!', 'Corrected resume saved as PDF to your downloads');
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Export Failed', 'Could not generate PDF. Please try again.');
    }
  };

  const getChangeTypeColor = (type: TextChange['type']) => {
    switch (type) {
      case 'replacement': return 'text-blue-600 bg-blue-50';
      case 'addition': return 'text-green-600 bg-green-50';
      case 'removal': return 'text-red-600 bg-red-50';
      case 'enhancement': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getChangeTypeIcon = (type: TextChange['type']) => {
    switch (type) {
      case 'replacement': return '🔄';
      case 'addition': return '➕';
      case 'removal': return '➖';
      case 'enhancement': return '✨';
      default: return '📝';
    }
  };

  return (
    <div className={`ai-resume-corrector bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Resume Corrector</h3>
            <p className="text-sm text-gray-600">Automatically apply AI recommendations to improve your resume</p>
          </div>
        </div>
        <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
          AI Powered
        </div>
      </div>

      {!correctionResult ? (
        /* Initial State */
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DocumentTextIcon className="w-8 h-8 text-green-600" />
          </div>
          
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to Improve Your Resume?
          </h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Our AI will automatically apply the recommendations to enhance your resume content, 
            improve action verbs, add quantifiable results, and optimize for ATS systems.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <h5 className="font-medium text-blue-900 mb-2">What will be improved:</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Stronger action verbs and professional language</li>
              <li>• Quantifiable metrics and achievements</li>
              <li>• Industry-relevant keywords and terminology</li>
              <li>• ATS-optimized formatting and structure</li>
            </ul>
          </div>

          <button
            onClick={handleCorrectResume}
            disabled={isProcessing || recommendations.length === 0}
            className={`
              inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors
              ${isProcessing || recommendations.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
              }
            `}
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size="sm" color="white" className="mr-2" />
                Processing...
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5 mr-2" />
                Correct My Resume ({recommendations.length} recommendations)
              </>
            )}
          </button>

          {recommendations.length === 0 && (
            <p className="text-sm text-gray-500 mt-3">
              No recommendations available. Upload a resume first to get AI suggestions.
            </p>
          )}
        </div>
      ) : (
        /* Results State */
        <div className="space-y-6">
          {/* Success Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
              <div>
                <h4 className="text-lg font-semibold text-green-900">
                  Resume Successfully Corrected!
                </h4>
                <p className="text-green-700">
                  Applied {correctionResult.appliedRecommendations.length} recommendations 
                  with {correctionResult.improvementScore}% improvement score
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {correctionResult.changes.length}
                </div>
                <div className="text-sm text-green-700">Changes Made</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {correctionResult.improvementScore}%
                </div>
                <div className="text-sm text-green-700">Improvement</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {correctionResult.appliedRecommendations.length}
                </div>
                <div className="text-sm text-green-700">Applied</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadCorrected}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Download Corrected PDF
            </button>
            
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              {showComparison ? 'Hide' : 'Show'} Changes
            </button>
            
            <button
              onClick={() => {
                setCorrectionResult(null);
                setShowComparison(false);
              }}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Correct Again
            </button>
          </div>

          {/* Changes Details */}
          {showComparison && (
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-900">Changes Made:</h5>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {correctionResult.changes.map((change, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getChangeTypeIcon(change.type)}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getChangeTypeColor(change.type)}`}>
                          {change.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-500">Original:</span>
                        <p className="text-sm text-gray-700 bg-red-50 p-2 rounded border-l-4 border-red-200">
                          {change.original}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-xs font-medium text-gray-500">Corrected:</span>
                        <p className="text-sm text-gray-700 bg-green-50 p-2 rounded border-l-4 border-green-200">
                          {change.corrected}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-xs font-medium text-gray-500">Reason:</span>
                        <p className="text-xs text-gray-600">{change.reason}</p>
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
  );
};

export default AIResumeCorrectorComponent;