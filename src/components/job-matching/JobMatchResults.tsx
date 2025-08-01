import React from 'react';
import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import type { JobMatch } from '../../types/analysis';

interface JobMatchResultsProps {
  jobMatch: JobMatch;
  className?: string;
}

export const JobMatchResults: React.FC<JobMatchResultsProps> = ({
  jobMatch,
  className = '',
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreBorder = (score: number) => {
    if (score >= 80) return 'border-green-200';
    if (score >= 60) return 'border-yellow-200';
    return 'border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Partial Match';
    return 'Poor Match';
  };

  const matchedKeywords = jobMatch.keywordMatches.filter(match => match.inJob && match.inResume);
  const missingKeywords = jobMatch.keywordMatches.filter(match => match.inJob && !match.inResume);

  return (
    <div className={`job-match-results space-y-8 ${className}`}>
      {/* Job Info Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {jobMatch.jobTitle}
            </h2>
            {jobMatch.company && (
              <p className="text-gray-600 mt-1">{jobMatch.company}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Analyzed on {jobMatch.createdAt.toLocaleDateString()}
            </p>
          </div>
          
          {/* Overall Match Score */}
          <div className={`
            flex items-center justify-center w-24 h-24 rounded-full border-4
            ${getScoreBackground(jobMatch.matchScore)} ${getScoreBorder(jobMatch.matchScore)}
          `}>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(jobMatch.matchScore)}`}>
                {jobMatch.matchScore}
              </div>
              <div className="text-xs text-gray-600">/ 100</div>
            </div>
          </div>
        </div>
        
        {/* Score Label */}
        <div className="mt-4">
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${getScoreBackground(jobMatch.matchScore)} ${getScoreColor(jobMatch.matchScore)}
          `}>
            <ChartBarIcon className="w-4 h-4 mr-1" />
            {getScoreLabel(jobMatch.matchScore)}
          </span>
        </div>
      </div>

      {/* Keyword Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Matched Keywords */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
            Matched Keywords ({matchedKeywords.length})
          </h3>
          
          {matchedKeywords.length > 0 ? (
            <div className="space-y-3">
              {matchedKeywords.slice(0, 10).map((match, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-900">{match.keyword}</span>
                    <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full capitalize">
                      {match.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {Math.round(match.importance * 100)}% importance
                  </div>
                </div>
              ))}
              
              {matchedKeywords.length > 10 && (
                <div className="text-center text-sm text-gray-500">
                  + {matchedKeywords.length - 10} more matches
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No keyword matches found</p>
          )}
        </div>

        {/* Missing Keywords */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <XCircleIcon className="w-5 h-5 text-red-600 mr-2" />
            Missing Keywords ({missingKeywords.length})
          </h3>
          
          {missingKeywords.length > 0 ? (
            <div className="space-y-3">
              {missingKeywords.slice(0, 10).map((match, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <XCircleIcon className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-gray-900">{match.keyword}</span>
                    <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full capitalize">
                      {match.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {Math.round(match.importance * 100)}% importance
                  </div>
                </div>
              ))}
              
              {missingKeywords.length > 10 && (
                <div className="text-center text-sm text-gray-500">
                  + {missingKeywords.length - 10} more missing
                </div>
              )}
            </div>
          ) : (
            <p className="text-green-600 text-center py-4 flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              All important keywords found!
            </p>
          )}
        </div>
      </div>

      {/* Skills Gap Analysis */}
      {jobMatch.skillsGap.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2" />
            Skills Gap Analysis ({jobMatch.skillsGap.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobMatch.skillsGap.slice(0, 9).map((gap, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{gap.skill}</h4>
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${gap.importance === 'critical' ? 'bg-red-100 text-red-800' :
                      gap.importance === 'important' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'}
                  `}>
                    {gap.importance}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 capitalize">
                  {gap.category.replace('_', ' ')} skill
                </p>
                
                {gap.suggestions.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Suggestions:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {gap.suggestions.slice(0, 2).map((suggestion, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-gray-400 mr-1">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {gap.learningResources && gap.learningResources.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1 flex items-center">
                      <BookOpenIcon className="w-3 h-3 mr-1" />
                      Resources:
                    </p>
                    <ul className="text-xs text-blue-600 space-y-1">
                      {gap.learningResources.slice(0, 2).map((resource, idx) => (
                        <li key={idx} className="truncate">{resource}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {jobMatch.skillsGap.length > 9 && (
            <div className="text-center mt-4">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View {jobMatch.skillsGap.length - 9} more skills gaps
              </button>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {jobMatch.recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <LightBulbIcon className="w-5 h-5 text-blue-600 mr-2" />
            Recommendations ({jobMatch.recommendations.length})
          </h3>
          
          <div className="space-y-4">
            {jobMatch.recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <p className="text-sm text-blue-600 mt-2 font-medium">
                      Impact: {rec.impact}
                    </p>
                    
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
                      ${rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'}
                    `}>
                      {rec.priority} priority
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
                      {rec.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          📊 Match Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-900">{jobMatch.matchScore}%</div>
            <div className="text-sm text-blue-700">Overall Match</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{matchedKeywords.length}</div>
            <div className="text-sm text-blue-700">Keywords Matched</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{missingKeywords.length}</div>
            <div className="text-sm text-blue-700">Keywords Missing</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{jobMatch.skillsGap.length}</div>
            <div className="text-sm text-blue-700">Skills to Learn</div>
          </div>
        </div>
      </div>
    </div>
  );
};