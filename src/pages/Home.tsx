import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Home: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-6xl">
          Optimize Your Resume with{' '}
          <span className="text-primary-600 dark:text-primary-400">AI Power</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          JobRizz uses advanced artificial intelligence to analyze your resume against job descriptions, 
          providing personalized optimization suggestions, ATS scoring, and tailored content generation 
          to boost your job application success.
        </p>
        
        <div className="mt-10 flex justify-center gap-4">
          {user ? (
            <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-primary text-lg px-8 py-3">
                Login
              </Link>
              <Link to="/register" className="btn-secondary text-lg px-8 py-3">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Quick Access to Core Features */}
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link 
            to="/analysis" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            📊 Resume Analysis
          </Link>
          <Link 
            to="/job-matching" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            🎯 Job Matching
          </Link>
        </div>
      </div>
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Analysis</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Advanced machine learning algorithms analyze your resume compatibility with job descriptions
          </p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">ATS Optimization</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Optimize your resume for Applicant Tracking Systems with smart keyword suggestions
          </p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Suggestions</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Get personalized improvement suggestions and generate tailored cover letters
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home