import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

const WorkInProgressPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <WrenchScrewdriverIcon className="w-12 h-12 text-blue-600" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resume Builder
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8">
            Coming in Version 2.0
          </p>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              We're working on an amazing resume builder with drag-and-drop functionality, 
              beautiful templates, and real-time editing. Stay tuned!
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Templates</h3>
                <p className="text-sm text-gray-600">Professional designs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🖱️</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Drag & Drop</h3>
                <p className="text-sm text-gray-600">Easy reordering</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Real-time</h3>
                <p className="text-sm text-gray-600">Instant preview</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Development Progress</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          {/* Available Features */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Available Now
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/analysis')}
                className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-left transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Resume Analysis</h4>
                    <p className="text-sm text-gray-600">ATS scoring & optimization</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => navigate('/job-matching')}
                className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-left transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Job Matching</h4>
                    <p className="text-sm text-gray-600">Compare resume to jobs</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Call to Action */}
          <p className="text-gray-600">
            In the meantime, try our resume analysis and job matching features to optimize your existing resume.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkInProgressPage;