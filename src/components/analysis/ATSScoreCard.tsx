import React from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import type { ATSScore } from '../../types/analysis';

interface ATSScoreCardProps {
  score: ATSScore;
  className?: string;
}

export const ATSScoreCard: React.FC<ATSScoreCardProps> = ({
  score,
  className = '',
}) => {
  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 80) return 'text-green-600';
    if (scoreValue >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (scoreValue: number) => {
    if (scoreValue >= 80) return 'bg-green-100';
    if (scoreValue >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreBorder = (scoreValue: number) => {
    if (scoreValue >= 80) return 'border-green-200';
    if (scoreValue >= 60) return 'border-yellow-200';
    return 'border-red-200';
  };

  const getScoreLabel = (scoreValue: number) => {
    if (scoreValue >= 80) return 'Excellent';
    if (scoreValue >= 60) return 'Good';
    if (scoreValue >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'suggestion':
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className={`ats-score-card bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">ATS Compatibility Score</h2>
            <p className="text-sm text-gray-600 mt-1">
              How well your resume works with Applicant Tracking Systems
            </p>
          </div>
          
          {/* Overall Score */}
          <div className={`
            flex items-center justify-center w-20 h-20 rounded-full border-4
            ${getScoreBackground(score.overall)} ${getScoreBorder(score.overall)}
          `}>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(score.overall)}`}>
                {score.overall}
              </div>
              <div className="text-xs text-gray-600">/ 100</div>
            </div>
          </div>
        </div>
        
        {/* Score Label */}
        <div className="mt-4">
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${getScoreBackground(score.overall)} ${getScoreColor(score.overall)}
          `}>
            {getScoreLabel(score.overall)}
          </span>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Score Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(score.breakdown).map(([category, value]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      value >= 80 ? 'bg-green-500' :
                      value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className={`text-sm font-medium w-8 ${getScoreColor(value)}`}>
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issues */}
      {score.issues.length > 0 && (
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Issues Found</h3>
          <div className="space-y-3">
            {score.issues.slice(0, 5).map((issue, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                {getIssueIcon(issue.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {issue.message}
                    </p>
                    <span className="text-xs text-gray-500">
                      -{issue.impact} pts
                    </span>
                  </div>
                  {issue.fix && (
                    <p className="text-xs text-gray-600 mt-1">
                      <strong>Fix:</strong> {issue.fix}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {score.issues.length > 5 && (
              <div className="text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View {score.issues.length - 5} more issues
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Improvements */}
      {score.improvements.length > 0 && (
        <div className="p-6 border-t border-gray-200 bg-blue-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-2" />
            Quick Improvements
          </h3>
          <ul className="space-y-2">
            {score.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};