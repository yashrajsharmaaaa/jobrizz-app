import React, { useState, useCallback } from 'react';
import { EyeIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { TemplateSelector } from './TemplateSelector';
import { TemplateCustomizer } from './TemplateCustomizer';
import { TemplatePreview } from './TemplatePreview';
import { getTemplateById, getDefaultTemplate } from '../../data/templates';
import type { Template, TemplateCustomization } from '../../types/template';
import type { ResumeData } from '../../types/resume';

interface TemplateSystemProps {
  selectedTemplateId?: string;
  customization?: TemplateCustomization;
  resumeData?: ResumeData;
  onTemplateChange: (template: Template) => void;
  onCustomizationChange: (customization: TemplateCustomization) => void;
  className?: string;
}

export const TemplateSystem: React.FC<TemplateSystemProps> = ({
  selectedTemplateId,
  customization,
  resumeData,
  onTemplateChange,
  onCustomizationChange,
  className = '',
}) => {
  const [currentView, setCurrentView] = useState<'selector' | 'customizer' | 'preview'>('selector');
  const [previewScale, setPreviewScale] = useState(0.8);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // Get current template
  const currentTemplate = selectedTemplateId 
    ? getTemplateById(selectedTemplateId) || getDefaultTemplate()
    : getDefaultTemplate();

  // Create default customization if none provided
  const currentCustomization: TemplateCustomization = customization || {
    templateId: currentTemplate.id,
    colors: {
      primary: currentTemplate.styling.primaryColor,
      secondary: currentTemplate.styling.secondaryColor,
      text: currentTemplate.styling.textColor,
      accent: currentTemplate.styling.accentColor,
      background: currentTemplate.styling.backgroundColor,
    },
    fonts: {
      headingFont: currentTemplate.styling.headingFont || currentTemplate.styling.fontFamily,
      bodyFont: currentTemplate.styling.fontFamily,
      sizes: currentTemplate.styling.fontSize,
    },
    layout: {
      headerStyle: currentTemplate.layout.headerStyle,
      sectionSpacing: currentTemplate.layout.sectionSpacing,
      pageMargins: currentTemplate.layout.pageMargins,
    },
    sections: currentTemplate.sections.map((section, index) => ({
      sectionType: section.type,
      isVisible: true,
      title: section.defaultTitle,
      styling: section.styling,
      order: index,
    })),
  };

  const handleTemplateSelect = useCallback((template: Template) => {
    onTemplateChange(template);
    
    // Update customization to match new template
    const newCustomization: TemplateCustomization = {
      templateId: template.id,
      colors: {
        primary: template.styling.primaryColor,
        secondary: template.styling.secondaryColor,
        text: template.styling.textColor,
        accent: template.styling.accentColor,
        background: template.styling.backgroundColor,
      },
      fonts: {
        headingFont: template.styling.headingFont || template.styling.fontFamily,
        bodyFont: template.styling.fontFamily,
        sizes: template.styling.fontSize,
      },
      layout: {
        headerStyle: template.layout.headerStyle,
        sectionSpacing: template.layout.sectionSpacing,
        pageMargins: template.layout.pageMargins,
      },
      sections: template.sections.map((section, index) => ({
        sectionType: section.type,
        isVisible: true,
        title: section.defaultTitle,
        styling: section.styling,
        order: index,
      })),
    };
    
    onCustomizationChange(newCustomization);
    setCurrentView('customizer');
  }, [onTemplateChange, onCustomizationChange]);

  const handleTemplatePreview = useCallback((template: Template) => {
    setPreviewTemplate(template);
    setCurrentView('preview');
  }, []);

  const handleCustomizationChange = useCallback((newCustomization: TemplateCustomization) => {
    onCustomizationChange(newCustomization);
  }, [onCustomizationChange]);

  const handleBackToSelector = () => {
    setCurrentView('selector');
    setPreviewTemplate(null);
  };

  const handleShowCustomizer = () => {
    setCurrentView('customizer');
    setPreviewTemplate(null);
  };

  const handleShowPreview = () => {
    setCurrentView('preview');
    setPreviewTemplate(currentTemplate);
  };

  const renderNavigation = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        {currentView !== 'selector' && (
          <button
            onClick={handleBackToSelector}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Templates
          </button>
        )}
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-sm font-medium text-gray-900">
            {currentView === 'selector' && 'Select Template'}
            {currentView === 'customizer' && 'Customize Template'}
            {currentView === 'preview' && 'Preview Template'}
          </span>
        </div>
      </div>

      {currentView !== 'selector' && (
        <div className="flex items-center space-x-2">
          {currentView !== 'customizer' && (
            <button
              onClick={handleShowCustomizer}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Cog6ToothIcon className="w-4 h-4 mr-2" />
              Customize
            </button>
          )}
          
          {currentView !== 'preview' && (
            <button
              onClick={handleShowPreview}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              Preview
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'selector':
        return (
          <TemplateSelector
            selectedTemplateId={selectedTemplateId}
            onTemplateSelect={handleTemplateSelect}
            onPreview={handleTemplatePreview}
          />
        );

      case 'customizer':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <TemplateCustomizer
                template={currentTemplate}
                customization={currentCustomization}
                onCustomizationChange={handleCustomizationChange}
              />
            </div>
            <div>
              <TemplatePreview
                template={currentTemplate}
                customization={currentCustomization}
                resumeData={resumeData}
                scale={previewScale}
                onScaleChange={setPreviewScale}
                showControls={true}
              />
            </div>
          </div>
        );

      case 'preview':
        const templateToPreview = previewTemplate || currentTemplate;
        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-1">
                {templateToPreview.name} Template Preview
              </h3>
              <p className="text-sm text-blue-700">
                This is how your resume will look with the {templateToPreview.name} template.
                {previewTemplate && ' Click "Select Template" to use this template for your resume.'}
              </p>
              {previewTemplate && (
                <div className="mt-3">
                  <button
                    onClick={() => handleTemplateSelect(previewTemplate)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Select This Template
                  </button>
                </div>
              )}
            </div>
            
            <TemplatePreview
              template={templateToPreview}
              customization={previewTemplate ? undefined : currentCustomization}
              resumeData={resumeData}
              scale={previewScale}
              onScaleChange={setPreviewScale}
              showControls={true}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`template-system ${className}`}>
      {renderNavigation()}
      {renderContent()}
    </div>
  );
};

// Hook for managing template state
export const useTemplateSystem = (initialTemplateId?: string) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(() => {
    return initialTemplateId 
      ? getTemplateById(initialTemplateId) || getDefaultTemplate()
      : getDefaultTemplate();
  });

  const [customization, setCustomization] = useState<TemplateCustomization>(() => ({
    templateId: selectedTemplate.id,
    colors: {
      primary: selectedTemplate.styling.primaryColor,
      secondary: selectedTemplate.styling.secondaryColor,
      text: selectedTemplate.styling.textColor,
      accent: selectedTemplate.styling.accentColor,
      background: selectedTemplate.styling.backgroundColor,
    },
    fonts: {
      headingFont: selectedTemplate.styling.headingFont || selectedTemplate.styling.fontFamily,
      bodyFont: selectedTemplate.styling.fontFamily,
      sizes: selectedTemplate.styling.fontSize,
    },
    layout: {
      headerStyle: selectedTemplate.layout.headerStyle,
      sectionSpacing: selectedTemplate.layout.sectionSpacing,
      pageMargins: selectedTemplate.layout.pageMargins,
    },
    sections: selectedTemplate.sections.map((section, index) => ({
      sectionType: section.type,
      isVisible: true,
      title: section.defaultTitle,
      styling: section.styling,
      order: index,
    })),
  }));

  const handleTemplateChange = useCallback((template: Template) => {
    setSelectedTemplate(template);
  }, []);

  const handleCustomizationChange = useCallback((newCustomization: TemplateCustomization) => {
    setCustomization(newCustomization);
  }, []);

  return {
    selectedTemplate,
    customization,
    handleTemplateChange,
    handleCustomizationChange,
  };
};