import React, { useState } from 'react';
import { DragDropResumeEditor } from '../components/resume-builder';
import { createSampleResumeData } from '../lib/resume/defaults';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const DragDropDemo: React.FC = () => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(() => createSampleResumeData('modern-professional'));
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const handleResumeUpdate = (updatedResumeData: typeof resumeData) => {
    setResumeData(updatedResumeData);
  };

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSectionId(sectionId === selectedSectionId ? null : sectionId);
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
                  Drag & Drop Resume Editor
                </h1>
                <p className="text-gray-600 mt-1">
                  Reorder your resume sections with intuitive drag and drop
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Sections:</span> {resumeData.sections.length}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Visible:</span> {resumeData.sections.filter(s => s.isVisible).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Panel */}
          <div className="lg:col-span-2">
            <DragDropResumeEditor
              resumeData={resumeData}
              onResumeUpdate={handleResumeUpdate}
              onSectionSelect={handleSectionSelect}
              selectedSectionId={selectedSectionId || undefined}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            />
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How to Use
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs">
                    1
                  </div>
                  <p>
                    <strong>Drag to reorder:</strong> Use the drag handle (⋮⋮⋮) to move sections up or down
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs">
                    2
                  </div>
                  <p>
                    <strong>Toggle visibility:</strong> Click the eye icon to show or hide sections
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs">
                    3
                  </div>
                  <p>
                    <strong>Select sections:</strong> Click on a section to select it (highlighted in blue)
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs">
                    4
                  </div>
                  <p>
                    <strong>Drop zones:</strong> Blue drop zones appear when dragging to show where you can drop
                  </p>
                </div>
              </div>
            </div>

            {/* Section Details */}
            {selectedSectionId && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Section Details
                </h3>
                {(() => {
                  const section = resumeData.sections.find(s => s.id === selectedSectionId);
                  if (!section) return null;
                  
                  return (
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Title:</span>
                        <span className="ml-2 text-gray-600">{section.title}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Type:</span>
                        <span className="ml-2 text-gray-600 capitalize">{section.type}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Order:</span>
                        <span className="ml-2 text-gray-600">{section.order + 1}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Visible:</span>
                        <span className={`ml-2 ${section.isVisible ? 'text-green-600' : 'text-red-600'}`}>
                          {section.isVisible ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Custom:</span>
                        <span className={`ml-2 ${section.isCustom ? 'text-blue-600' : 'text-gray-600'}`}>
                          {section.isCustom ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Resume Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resume Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sections:</span>
                  <span className="font-medium text-gray-900">{resumeData.sections.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Visible Sections:</span>
                  <span className="font-medium text-green-600">
                    {resumeData.sections.filter(s => s.isVisible).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hidden Sections:</span>
                  <span className="font-medium text-red-600">
                    {resumeData.sections.filter(s => !s.isVisible).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Custom Sections:</span>
                  <span className="font-medium text-blue-600">
                    {resumeData.sections.filter(s => s.isCustom).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Debug Info */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Debug Info
              </h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Template: {resumeData.templateId}</div>
                <div>Last Updated: {resumeData.metadata.updatedAt.toLocaleTimeString()}</div>
                <div>Selected: {selectedSectionId || 'None'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragDropDemo;