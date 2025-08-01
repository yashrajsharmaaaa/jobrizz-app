import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon,
    BriefcaseIcon,
    DocumentTextIcon,
    ChartBarIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { JobDescriptionForm } from '../components/job-matching/JobDescriptionForm';
import { JobMatchResults } from '../components/job-matching/JobMatchResults';
import { AIInsights } from '../components/job-matching/AIInsights';
import { AIErrorBoundary } from '../components/ErrorBoundary';
import { JobMatchingService } from '../services/jobMatchingService';
import type { JobMatch, ResumeAnalysis } from '../types/analysis';

const JobMatchingPage: React.FC = () => {
    const navigate = useNavigate();
    const [jobMatch, setJobMatch] = useState<JobMatch | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);

    // Check if user has uploaded a resume (from localStorage or context)
    React.useEffect(() => {
        const savedAnalysis = localStorage.getItem('jobrizz_latest_resume_analysis');
        if (savedAnalysis) {
            try {
                const analysis = JSON.parse(savedAnalysis);
                setResumeAnalysis(analysis);
            } catch (err) {
                console.error('Failed to load saved resume analysis:', err);
            }
        }
    }, []);

    const handleJobAnalysis = async (jobTitle: string, company: string, jobDescription: string) => {
        setIsAnalyzing(true);
        setError(null);

        if (!resumeAnalysis) {
            setError('Please upload and analyze your resume first');
            setIsAnalyzing(false);
            return;
        }

        try {
            const matchResult = await JobMatchingService.analyzeJobMatch(
                resumeAnalysis,
                jobTitle,
                company,
                jobDescription
            );

            setJobMatch(matchResult);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to analyze job match';
            setError(errorMessage);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const resetAnalysis = () => {
        setJobMatch(null);
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
                                    Job Matching
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    See how well your resume matches specific job postings
                                </p>
                            </div>
                        </div>

                        {jobMatch && (
                            <button
                                onClick={resetAnalysis}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Analyze New Job
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {!resumeAnalysis ? (
                    /* No Resume State */
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DocumentTextIcon className="w-8 h-8 text-yellow-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Resume Required
                            </h2>
                            <p className="text-gray-600 mb-6">
                                To use job matching, you need to upload and analyze your resume first. 
                                This helps us compare your skills and experience with job requirements.
                            </p>
                            <button
                                onClick={() => navigate('/analysis')}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                <DocumentTextIcon className="w-5 h-5 mr-2" />
                                Upload Resume First
                            </button>
                        </div>
                    </div>
                ) : !jobMatch ? (
                    /* Job Input Section */
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <BriefcaseIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Analyze Job Match
                            </h2>
                            <p className="text-gray-600">
                                Paste a job description to see how well your resume matches the requirements
                                and get personalized recommendations to improve your chances.
                            </p>
                        </div>

                        <JobDescriptionForm
                            onAnalyze={handleJobAnalysis}
                            isAnalyzing={isAnalyzing}
                            className="mb-8"
                        />

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
                                <h3 className="font-semibold text-gray-900 mb-2">Match Score</h3>
                                <p className="text-sm text-gray-600">
                                    Get a comprehensive score showing how well your resume matches the job requirements
                                </p>
                            </div>

                            <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                                <DocumentTextIcon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-2">Keyword Analysis</h3>
                                <p className="text-sm text-gray-600">
                                    See which keywords from the job posting appear in your resume and which are missing
                                </p>
                            </div>

                            <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                                <SparklesIcon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-900 mb-2">Smart Recommendations</h3>
                                <p className="text-sm text-gray-600">
                                    Get specific suggestions on how to improve your resume for this particular job
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Job Match Results */
                    <div className="space-y-8">
                        <JobMatchResults jobMatch={jobMatch} />
                        {resumeAnalysis && (
                            <AIErrorBoundary>
                                <AIInsights jobMatch={jobMatch} resumeAnalysis={resumeAnalysis} />
                            </AIErrorBoundary>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobMatchingPage;