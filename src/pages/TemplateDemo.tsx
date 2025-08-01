import React from 'react';
import { TemplateSystem, useTemplateSystem } from '../components/resume-builder';
import { createSampleResumeData } from '../lib/resume/defaults';

const TemplateDemo: React.FC = () => {
  const {
    selectedTemplate,
    customization,
    handleTemplateChange,
    handleCustomizationChange,
  } = useTemplateSystem();

  // Create sample resume data for demonstration
  const sampleResumeData = createSampleResumeData(selectedTemplate.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resume Template System
          </h1>
          <p className="text-gray-600">
            Choose and customize professional resume templates for your perfect resume.
          </p>
        </div>

        <TemplateSystem
          selectedTemplateId={selectedTemplate.id}
          customization={customization}
          resumeData={sampleResumeData}
          onTemplateChange={handleTemplateChange}
          onCustomizationChange={handleCustomizationChange}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        />

        {/* Debug Info (remove in production) */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Debug Info:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Selected Template:</strong> {selectedTemplate.name} ({selectedTemplate.id})</p>
            <p><strong>Category:</strong> {selectedTemplate.category}</p>
            <p><strong>Layout Type:</strong> {selectedTemplate.layout.type}</p>
            <p><strong>Primary Color:</strong> {customization.colors?.primary}</p>
            <p><strong>Font Family:</strong> {customization.fonts?.bodyFont}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDemo;