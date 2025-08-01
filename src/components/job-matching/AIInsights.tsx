import React, { useState, useEffect } from 'react';
import {
    SparklesIcon,
    UserIcon,
    CurrencyDollarIcon,
    ChatBubbleLeftRightIcon,
    ArrowTrendingUpIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { AIService } from '../../services/aiService';
import type { JobMatch, ResumeAnalysis, AIInsight } from '../../types/analysis';

interface AIInsightsProps {
    jobMatch: JobMatch;
    resumeAnalysis: ResumeAnalysis;
    className?: string;
}

export const AIInsights: React.FC<AIInsightsProps> = ({
    jobMatch,
    resumeAnalysis,
    className = '',
}) => {
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateInsights = async () => {
            try {
                setIsLoading(true);
                const aiInsights = await AIService.generateJobMatchInsights(jobMatch, resumeAnalysis);
                setInsights(aiInsights);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to generate AI insights');
            } finally {
                setIsLoading(false);
            }
        };

        generateInsights();
    }, [jobMatch, resumeAnalysis]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'personality_analysis': return <UserIcon className="w-5 h-5" />;
            case 'compensation_analysis': return <CurrencyDollarIcon className="w-5 h-5" />;
            case 'interview_preparation': return <ChatBubbleLeftRightIcon className="w-5 h-5" />;
            case 'career_analysis': return <ArrowTrendingUpIcon className="w-5 h-5" />;
            default: return <SparklesIcon className="w-5 h-5" />;
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 0.8) return 'text-green-600 bg-green-100';
        if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
        if (score >= 0.4) return 'text-orange-600 bg-orange-100';
        return 'text-red-600 bg-red-100';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 0.8) return 'Excellent';
        if (score >= 0.6) return 'Good';
        if (score >= 0.4) return 'Fair';
        return 'Needs Improvement';
    };

    if (isLoading) {
        return (
            <div className={`ai-insights bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">AI Career Insights</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-center mt-6 text-sm text-gray-500">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    AI is analyzing job compatibility...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`ai-insights bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
                <div className="text-center py-8">
                    <div className="text-red-500 mb-2">
                        <SparklesIcon className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">AI Insights Unavailable</h3>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`ai-insights bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">AI Career Insights</h3>
                        <p className="text-sm text-gray-600">Advanced analysis of your job compatibility</p>
                    </div>
                </div>
                <div className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                    AI Powered
                </div>
            </div>

            {/* Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insights.map((insight) => (
                    <div key={insight.id} className="border border-gray-200 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="text-indigo-600">
                                    {getTypeIcon(insight.type)}
                                </div>
                                <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                            </div>

                            {insight.score > 0 && (
                                <div className="text-right">
                                    <div className={`px-2 py-1 text-xs font-medium rounded-full ${getScoreColor(insight.score)}`}>
                                        {getScoreLabel(insight.score)}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {Math.round(insight.score * 100)}%
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-gray-600 mb-4">{insight.description}</p>

                        {/* Details */}
                        <div className="space-y-2">
                            {insight.details.map((detail, idx) => (
                                <div key={idx} className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-sm text-gray-700">{detail}</span>
                                </div>
                            ))}
                        </div>

                        {/* Confidence */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>AI Confidence</span>
                                <span>{Math.round(insight.confidence * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div
                                    className="bg-indigo-500 h-1 rounded-full transition-all duration-300"
                                    style={{ width: `${insight.confidence * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                        <SparklesIcon className="w-4 h-4" />
                        <span>Advanced AI analysis by JobRizz</span>
                    </div>
                    <div>
                        Generated {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>
        </div>
    );
};