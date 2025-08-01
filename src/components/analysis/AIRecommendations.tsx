import React, { useState, useEffect } from 'react';
import {
  SparklesIcon,
  LightBulbIcon,
  ChartBarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { AnalysisSkeleton } from '../ui/SkeletonLoader';
import { useToast } from '../ui/Toast';
import { AIService } from '../../services/aiService';
import type { ResumeAnalysis, AIRecommendation } from '../../types/analysis';

interface AIRecommendationsProps {
  analysis: ResumeAnalysis;
  className?: string;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  analysis,
  className = '',
}) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const generateRecommendations = async () => {
      try {
        setIsLoading(true);
        const aiRecommendations = await AIService.generateResumeOptimizations(analysis);
        setRecommendations(aiRecommendations);

        if (aiRecommendations.length > 0) {
          toast.success('AI Analysis Complete', `Generated ${aiRecommendations.length} personalized recommendations`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate AI recommendations';
        setError(errorMessage);
        toast.error('AI Analysis Failed', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    generateRecommendations();
  }, [analysis]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content_enhancement': return <LightBulbIcon className="w-5 h-5" />;
      case 'skills_optimization': return <ChartBarIcon className="w-5 h-5" />;
      case 'impact_measurement': return <SparklesIcon className="w-5 h-5" />;
      case 'industry_alignment': return <CheckCircleIcon className="w-5 h-5" />;
      default: return <SparklesIcon className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className={className}>
        <AnalysisSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`ai-recommendations bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            <SparklesIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">AI Analysis Unavailable</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`ai-recommendations bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI-Powered Recommendations</h3>
            <p className="text-sm text-gray-600">Personalized suggestions to improve your resume</p>
          </div>
        </div>
        <div className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
          AI Generated
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-6">
        {recommendations.map((rec) => (
          <div key={rec.id} className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-purple-600">
                  {getTypeIcon(rec.type)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(rec.priority)}`}>
                  {rec.priority} priority
                </span>
                <div className="text-xs text-gray-500">
                  {Math.round(rec.confidence * 100)}% confidence
                </div>
              </div>
            </div>

            {/* Impact */}
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Expected Impact:</span>
              </div>
              <p className="text-sm text-blue-800 mt-1">{rec.impact}</p>
            </div>

            {/* Suggestions */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">AI Suggestions:</h5>
              <ul className="space-y-2">
                {rec.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-4 h-4" />
            <span>Powered by JobRizz AI</span>
          </div>
          <div>
            Generated {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};