import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import {
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CodeBracketIcon,
  StarIcon,
  GlobeAltIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import type {
  ResumeData,
  SectionType
} from '../types/resume';
import { getDefaultTemplate } from '../data/templates';
import { createDefaultResumeData } from '../lib/resume/defaults';

const ResumeEditor: React.FC = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  // Resume state
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize resume data
  useEffect(() => {
    const initializeResume = () => {
      if (resumeId) {
        // TODO: Load existing resume from storage/API
        const savedResume = localStorage.getItem(`resume_${resumeId}`);
        if (savedResume) {
          setResume(JSON.parse(savedResume));
        } else {
          // Create new resume with default template
          const defaultTemplate = getDefaultTemplate();
          const newResume = createDefaultResumeData(defaultTemplate.id);
          setResume(newResume);
        }
      } else {
        // Create new resume
        const defaultTemplate = getDefaultTemplate();
        const newResume = createDefaultResumeData(defaultTemplate.id);
        setResume(newResume);
      }
      setIsLoading(false);
    };

    initializeResume();
  }, [resumeId]);

  // Auto-save functionality
  useEffect(() => {
    if (resume) {
      const saveTimeout = setTimeout(() => {
        localStorage.setItem(`resume_${resume.id}`, JSON.stringify(resume));
      }, 1000);

      return () => clearTimeout(saveTimeout);
    }
  }, [resume]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Resume</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                ← Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Resume Editor
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {resumeId ? 'Editing existing resume' : 'Creating new resume'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                {isPreviewMode ? (
                  <>
                    <EyeSlashIcon className="w-4 h-4 mr-2" />
                    Edit Mode
                  </>
                ) : (
                  <>
                    <EyeIcon className="w-4 h-4 mr-2" />
                    Preview
                  </>
                )}
              </Button>
              <Button size="sm">
                Save Resume
              </Button>
              <Button size="sm">
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className={`${isPreviewMode ? 'hidden lg:block' : ''}`}>
            <div className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserIcon className="w-5 h-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name
                      </label>
                      <Input
                        value={resume.personalInfo.firstName}
                        onChange={(e) => {
                          setResume(prev => prev ? {
                            ...prev,
                            personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                          } : null);
                        }}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name
                      </label>
                      <Input
                        value={resume.personalInfo.lastName}
                        onChange={(e) => {
                          setResume(prev => prev ? {
                            ...prev,
                            personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                          } : null);
                        }}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={resume.personalInfo.email}
                      onChange={(e) => {
                        setResume(prev => prev ? {
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        } : null);
                      }}
                      placeholder="john.doe@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <Input
                        value={resume.personalInfo.phone}
                        onChange={(e) => {
                          setResume(prev => prev ? {
                            ...prev,
                            personalInfo: { ...prev.personalInfo, phone: e.target.value }
                          } : null);
                        }}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <Input
                        value={resume.personalInfo.location}
                        onChange={(e) => {
                          setResume(prev => prev ? {
                            ...prev,
                            personalInfo: { ...prev.personalInfo, location: e.target.value }
                          } : null);
                        }}
                        placeholder="San Francisco, CA"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Professional Summary
                    </label>
                    <textarea
                      value={resume.personalInfo.summary || ''}
                      onChange={(e) => {
                        setResume(prev => prev ? {
                          ...prev,
                          personalInfo: { ...prev.personalInfo, summary: e.target.value }
                        } : null);
                      }}
                      placeholder="Brief professional summary..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Resume Sections */}
              {resume.sections.map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        {getSectionIcon(section.type)}
                        <span className="ml-2">{section.title}</span>
                        {!section.isVisible && (
                          <Badge variant="secondary" className="ml-2">Hidden</Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setResume(prev => prev ? {
                              ...prev,
                              sections: prev.sections.map(s =>
                                s.id === section.id ? { ...s, isVisible: !s.isVisible } : s
                              )
                            } : null);
                          }}
                        >
                          {section.isVisible ? (
                            <EyeIcon className="w-4 h-4" />
                          ) : (
                            <EyeSlashIcon className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // TODO: Add entry functionality
                            console.log('Add entry to section:', section.id);
                          }}
                        >
                          <PlusIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {section.isVisible && (
                      <div className="text-center py-8 text-gray-500">
                        <p>Section content will be implemented in the next step.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Preview Panel */}
          <div className={`${isPreviewMode ? 'lg:col-span-2' : ''}`}>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Resume Preview</span>
                  <Badge variant="outline">Template: {resume.templateId}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[800px]">
                  {/* Simple preview - will be enhanced with actual template rendering */}
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {resume.personalInfo.firstName} {resume.personalInfo.lastName}
                    </h1>
                    <p className="text-gray-600 mb-4">{resume.personalInfo.email} • {resume.personalInfo.phone}</p>
                    <p className="text-gray-600 mb-6">{resume.personalInfo.location}</p>

                    {resume.personalInfo.summary && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Summary</h2>
                        <p className="text-gray-700">{resume.personalInfo.summary}</p>
                      </div>
                    )}

                    {resume.sections.filter(s => s.isVisible).map((section) => (
                      <div key={section.id} className="mb-6 text-left">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                          {section.title}
                        </h2>
                        <p className="text-gray-500 italic">Section content will be displayed here</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get section icon
const getSectionIcon = (type: SectionType) => {
  switch (type) {
    case 'experience':
      return <BriefcaseIcon className="w-5 h-5" />;
    case 'education':
      return <AcademicCapIcon className="w-5 h-5" />;
    case 'skills':
      return <StarIcon className="w-5 h-5" />;
    case 'projects':
      return <CodeBracketIcon className="w-5 h-5" />;
    case 'languages':
      return <GlobeAltIcon className="w-5 h-5" />;
    default:
      return <DocumentTextIcon className="w-5 h-5" />;
  }
};

export default ResumeEditor; 