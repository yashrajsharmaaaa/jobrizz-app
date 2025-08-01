import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
import type { Template, TemplateCustomization } from '../../types/template';
import type { ResumeData } from '../../types/resume';
import { createSampleResumeData } from '../../lib/resume/defaults';

interface TemplatePreviewProps {
  template: Template;
  customization?: TemplateCustomization;
  resumeData?: ResumeData;
  scale?: number;
  onScaleChange?: (scale: number) => void;
  showControls?: boolean;
  className?: string;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  customization,
  resumeData,
  scale = 1,
  onScaleChange,
  showControls = true,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Use sample data if no resume data provided
  const displayData = resumeData || createSampleResumeData(template.id);

  // Apply customizations to template
  const customizedTemplate = React.useMemo(() => {
    if (!customization) return template;

    return {
      ...template,
      styling: {
        ...template.styling,
        ...customization.colors && {
          primaryColor: customization.colors.primary || template.styling.primaryColor,
          secondaryColor: customization.colors.secondary || template.styling.secondaryColor,
          textColor: customization.colors.text || template.styling.textColor,
          accentColor: customization.colors.accent || template.styling.accentColor,
          backgroundColor: customization.colors.background || template.styling.backgroundColor,
        },
        ...customization.fonts && {
          fontFamily: customization.fonts.bodyFont || template.styling.fontFamily,
          headingFont: customization.fonts.headingFont || template.styling.headingFont,
          fontSize: {
            ...template.styling.fontSize,
            ...customization.fonts.sizes,
          },
        },
      },
      layout: {
        ...template.layout,
        ...customization.layout,
        pageMargins: {
          ...template.layout.pageMargins,
          ...customization.layout?.pageMargins,
        },
      },
    };
  }, [template, customization]);

  useEffect(() => {
    // Simulate loading time for preview generation
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [template.id, customization]);

  const handleZoomIn = () => {
    const newScale = Math.min(scale + 0.1, 2);
    onScaleChange?.(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.1, 0.3);
    onScaleChange?.(newScale);
  };

  const handleFitToWidth = () => {
    if (previewRef.current) {
      const containerWidth = previewRef.current.clientWidth;
      const contentWidth = 800; // Approximate resume width
      const newScale = Math.min((containerWidth - 40) / contentWidth, 1);
      onScaleChange?.(newScale);
    }
  };

  if (error) {
    return (
      <div className={`template-preview-error ${className}`}>
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Error</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`template-preview ${className}`}>
      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Preview:</span>
            <span className="text-sm text-gray-600">{template.name}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Zoom Out"
            >
              <MagnifyingGlassMinusIcon className="w-4 h-4" />
            </button>
            
            <span className="text-sm text-gray-600 min-w-[3rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Zoom In"
            >
              <MagnifyingGlassPlusIcon className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleFitToWidth}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            >
              Fit
            </button>
          </div>
        </div>
      )}

      {/* Preview Container */}
      <div
        ref={previewRef}
        className="preview-container bg-gray-100 rounded-lg p-4 overflow-auto"
        style={{ minHeight: '600px' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating preview...</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="resume-preview bg-white shadow-lg"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                width: '800px',
                minHeight: '1000px',
              }}
            >
              <ResumeRenderer
                template={customizedTemplate}
                resumeData={displayData}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ResumeRendererProps {
  template: Template;
  resumeData: ResumeData;
}

const ResumeRenderer: React.FC<ResumeRendererProps> = ({
  template,
  resumeData,
}) => {
  const styles = {
    container: {
      fontFamily: template.styling.fontFamily,
      fontSize: `${template.styling.fontSize.body}px`,
      lineHeight: template.styling.lineHeight,
      color: template.styling.textColor,
      backgroundColor: template.styling.backgroundColor,
      padding: `${template.layout.pageMargins.top}px ${template.layout.pageMargins.right}px ${template.layout.pageMargins.bottom}px ${template.layout.pageMargins.left}px`,
    },
    header: {
      textAlign: template.layout.headerStyle as 'left' | 'center' | 'right',
      marginBottom: `${template.layout.sectionSpacing}px`,
      paddingBottom: `${template.layout.sectionSpacing / 2}px`,
      borderBottom: template.styling.shadows ? `2px solid ${template.styling.primaryColor}` : 'none',
    },
    name: {
      fontSize: `${template.styling.fontSize.h1}px`,
      fontWeight: 'bold',
      color: template.styling.primaryColor,
      marginBottom: '8px',
      fontFamily: template.styling.headingFont || template.styling.fontFamily,
    },
    contactInfo: {
      fontSize: `${template.styling.fontSize.small}px`,
      color: template.styling.secondaryColor,
      marginBottom: '12px',
    },
    summary: {
      fontSize: `${template.styling.fontSize.body}px`,
      lineHeight: template.styling.lineHeight,
      marginTop: '12px',
    },
    sectionTitle: {
      fontSize: `${template.styling.fontSize.h2}px`,
      fontWeight: 'bold',
      color: template.styling.primaryColor,
      marginTop: `${template.layout.sectionSpacing}px`,
      marginBottom: '12px',
      fontFamily: template.styling.headingFont || template.styling.fontFamily,
      borderBottom: `1px solid ${template.styling.accentColor}`,
      paddingBottom: '4px',
    },
    entryTitle: {
      fontSize: `${template.styling.fontSize.h3}px`,
      fontWeight: 'bold',
      color: template.styling.textColor,
      marginBottom: '4px',
    },
    entrySubtitle: {
      fontSize: `${template.styling.fontSize.small}px`,
      color: template.styling.secondaryColor,
      marginBottom: '8px',
    },
    entryDescription: {
      fontSize: `${template.styling.fontSize.body}px`,
      marginBottom: '12px',
    },
  };

  const renderPersonalInfo = () => (
    <div style={styles.header}>
      <h1 style={styles.name}>
        {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
      </h1>
      <div style={styles.contactInfo}>
        {resumeData.personalInfo.email} • {resumeData.personalInfo.phone} • {resumeData.personalInfo.location}
        {resumeData.personalInfo.website && (
          <> • <a href={resumeData.personalInfo.website} style={{ color: template.styling.accentColor }}>
            {resumeData.personalInfo.website.replace(/^https?:\/\//, '')}
          </a></>
        )}
      </div>
      {resumeData.personalInfo.summary && (
        <div style={styles.summary}>
          {resumeData.personalInfo.summary}
        </div>
      )}
    </div>
  );

  const renderSection = (section: any) => {
    if (!section.isVisible) return null;

    return (
      <div key={section.id} style={{ marginBottom: `${template.layout.sectionSpacing}px` }}>
        <h2 style={styles.sectionTitle}>{section.title}</h2>
        
        {section.type === 'experience' && (
          <div>
            {section.content.entries.map((entry: any, index: number) => (
              <div key={entry.id || index} style={{ marginBottom: '16px' }}>
                <div style={styles.entryTitle}>{entry.jobTitle}</div>
                <div style={styles.entrySubtitle}>
                  {entry.company} • {entry.location} • {entry.startDate} - {entry.isCurrent ? 'Present' : entry.endDate}
                </div>
                <div style={styles.entryDescription}>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {entry.description.map((desc: string, i: number) => (
                      <li key={i} style={{ marginBottom: '4px' }}>{desc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {section.type === 'education' && (
          <div>
            {section.content.entries.map((entry: any, index: number) => (
              <div key={entry.id || index} style={{ marginBottom: '16px' }}>
                <div style={styles.entryTitle}>{entry.degree}</div>
                <div style={styles.entrySubtitle}>
                  {entry.institution} • {entry.location} • {entry.startDate} - {entry.isCurrent ? 'Present' : entry.endDate}
                  {entry.gpa && ` • GPA: ${entry.gpa}`}
                </div>
                {entry.honors && entry.honors.length > 0 && (
                  <div style={styles.entryDescription}>
                    <strong>Honors:</strong> {entry.honors.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {section.type === 'skills' && (
          <div>
            {section.content.categories.map((category: any, index: number) => (
              <div key={category.id || index} style={{ marginBottom: '12px' }}>
                <div style={{ ...styles.entryTitle, fontSize: `${template.styling.fontSize.h3}px` }}>
                  {category.name}
                </div>
                <div style={styles.entryDescription}>
                  {category.skills.map((skill: any) => skill.name).join(' • ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {renderPersonalInfo()}
      {resumeData.sections
        .filter(section => section.isVisible)
        .sort((a, b) => a.order - b.order)
        .map(renderSection)}
    </div>
  );
};