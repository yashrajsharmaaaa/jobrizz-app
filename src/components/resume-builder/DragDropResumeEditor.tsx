import React, { useState, useCallback } from 'react';
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { DragDropProvider } from './DragDropProvider';
import { DraggableSection } from './DraggableSection';
import { DropZone } from './DropZone';
import type { ResumeData, ResumeSection } from '../../types/resume';
import { reorderSections } from '../../lib/resume/utils';

interface DragDropResumeEditorProps {
  resumeData: ResumeData;
  onResumeUpdate: (resumeData: ResumeData) => void;
  onSectionSelect?: (sectionId: string) => void;
  selectedSectionId?: string;
  className?: string;
}

export const DragDropResumeEditor: React.FC<DragDropResumeEditorProps> = ({
  resumeData,
  onResumeUpdate,
  onSectionSelect,
  selectedSectionId,
  className = '',
}) => {
  const [dragPreview] = useState<string | null>(null);

  // Handle section reordering
  const handleSectionMove = useCallback((fromIndex: number, toIndex: number) => {
    const visibleSections = resumeData.sections
      .filter(section => section.isVisible)
      .sort((a, b) => a.order - b.order);
    
    const sectionIds = visibleSections.map(section => section.id);
    const reorderedSections = reorderSections(resumeData.sections, sectionIds);
    
    // Move the section from fromIndex to toIndex
    const [movedSection] = reorderedSections.splice(fromIndex, 1);
    reorderedSections.splice(toIndex, 0, movedSection);
    
    // Update order values
    const updatedSections = reorderedSections.map((section, index) => ({
      ...section,
      order: index,
    }));

    onResumeUpdate({
      ...resumeData,
      sections: updatedSections,
    });
  }, [resumeData, onResumeUpdate]);

  // Handle section visibility toggle
  const handleToggleVisibility = useCallback((sectionId: string) => {
    const updatedSections = resumeData.sections.map(section =>
      section.id === sectionId
        ? { ...section, isVisible: !section.isVisible }
        : section
    );

    onResumeUpdate({
      ...resumeData,
      sections: updatedSections,
    });
  }, [resumeData, onResumeUpdate]);

  // Handle section selection
  const handleSectionClick = useCallback((sectionId: string) => {
    if (onSectionSelect) {
      onSectionSelect(sectionId);
    }
  }, [onSectionSelect]);

  // Get visible sections sorted by order
  const visibleSections = resumeData.sections
    .filter(section => section.isVisible)
    .sort((a, b) => a.order - b.order);

  // Get hidden sections
  const hiddenSections = resumeData.sections
    .filter(section => !section.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <DragDropProvider onSectionMove={handleSectionMove}>
      <div className={`drag-drop-resume-editor ${className}`}>
        {/* Drag and Drop Instructions */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <DocumentTextIcon className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">
                Drag & Drop to Reorder
              </h3>
              <p className="text-sm text-blue-700">
                Use the drag handles (⋮⋮⋮) to reorder your resume sections. 
                Click the eye icon to show/hide sections.
              </p>
            </div>
          </div>
        </div>

        {/* Visible Sections */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Resume Sections
          </h2>

          {/* Drop zone at the top */}
          <DropZone
            index={0}
            onDrop={handleSectionMove}
            isVisible={visibleSections.length > 0}
          />

          {visibleSections.map((section, index) => (
            <React.Fragment key={section.id}>
              <DraggableSection
                section={section}
                index={index}
                onToggleVisibility={handleToggleVisibility}
                onSectionClick={handleSectionClick}
                className={selectedSectionId === section.id ? 'ring-2 ring-blue-500' : ''}
              >
                <SectionContent section={section} />
              </DraggableSection>

              {/* Drop zone between sections */}
              <DropZone
                index={index + 1}
                onDrop={handleSectionMove}
                isVisible={true}
              />
            </React.Fragment>
          ))}

          {/* Empty state */}
          {visibleSections.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No visible sections
              </h3>
              <p className="text-gray-600 mb-4">
                All sections are hidden. Show some sections to start building your resume.
              </p>
            </div>
          )}
        </div>

        {/* Hidden Sections */}
        {hiddenSections.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Hidden Sections
            </h2>
            <div className="space-y-3">
              {hiddenSections.map((section, index) => (
                <DraggableSection
                  key={section.id}
                  section={section}
                  index={visibleSections.length + index}
                  onToggleVisibility={handleToggleVisibility}
                  onSectionClick={handleSectionClick}
                  className="opacity-60"
                >
                  <SectionContent section={section} />
                </DraggableSection>
              ))}
            </div>
          </div>
        )}

        {/* Add Section Button */}
        <div className="mt-8">
          <button
            className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors duration-200"
            onClick={() => {
              // TODO: Implement add section functionality
              console.log('Add new section');
            }}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Section
          </button>
        </div>

        {/* Drag Preview Overlay */}
        {dragPreview && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg">
              Moving: {dragPreview}
            </div>
          </div>
        )}
      </div>
    </DragDropProvider>
  );
};

// Component to render section content preview
const SectionContent: React.FC<{ section: ResumeSection }> = ({ section }) => {
  const getContentPreview = () => {
    switch (section.type) {
      case 'experience':
        const expContent = section.content as any;
        const entryCount = expContent?.entries?.length || 0;
        return `${entryCount} ${entryCount === 1 ? 'position' : 'positions'}`;
      
      case 'education':
        const eduContent = section.content as any;
        const eduCount = eduContent?.entries?.length || 0;
        return `${eduCount} ${eduCount === 1 ? 'degree' : 'degrees'}`;
      
      case 'skills':
        const skillsContent = section.content as any;
        const categoryCount = skillsContent?.categories?.length || 0;
        const totalSkills = skillsContent?.categories?.reduce(
          (total: number, cat: any) => total + (cat.skills?.length || 0), 0
        ) || 0;
        return `${categoryCount} ${categoryCount === 1 ? 'category' : 'categories'}, ${totalSkills} skills`;
      
      case 'projects':
        const projectsContent = section.content as any;
        const projectCount = projectsContent?.entries?.length || 0;
        return `${projectCount} ${projectCount === 1 ? 'project' : 'projects'}`;
      
      case 'certifications':
        const certsContent = section.content as any;
        const certCount = certsContent?.entries?.length || 0;
        return `${certCount} ${certCount === 1 ? 'certification' : 'certifications'}`;
      
      case 'languages':
        const langsContent = section.content as any;
        const langCount = langsContent?.entries?.length || 0;
        return `${langCount} ${langCount === 1 ? 'language' : 'languages'}`;
      
      case 'custom':
        const customContent = section.content as any;
        const customCount = customContent?.entries?.length || 0;
        return `${customCount} ${customCount === 1 ? 'item' : 'items'}`;
      
      default:
        return 'No content';
    }
  };

  return (
    <div className="text-sm text-gray-600">
      <p>{getContentPreview()}</p>
      {!section.isVisible && (
        <p className="text-xs text-gray-500 mt-1">
          This section is hidden and won't appear in your resume
        </p>
      )}
    </div>
  );
};