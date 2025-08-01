import React, { useState } from 'react';
import { 
  BriefcaseIcon, 
  BuildingOfficeIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface JobDescriptionFormProps {
  onAnalyze: (jobTitle: string, company: string, jobDescription: string) => void;
  isAnalyzing: boolean;
  className?: string;
}

export const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({
  onAnalyze,
  isAnalyzing,
  className = '',
}) => {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required';
    } else if (jobDescription.trim().length < 100) {
      newErrors.jobDescription = 'Job description should be at least 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAnalyze(jobTitle.trim(), company.trim(), jobDescription.trim());
    }
  };

  const handlePasteExample = () => {
    const exampleJob = {
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      description: `We are seeking a Senior Frontend Developer to join our dynamic team. The ideal candidate will have 5+ years of experience building modern web applications using React, TypeScript, and Node.js.

Key Responsibilities:
• Develop and maintain scalable React applications
• Collaborate with cross-functional teams including designers and backend developers
• Implement responsive designs and ensure cross-browser compatibility
• Write clean, maintainable code following best practices
• Participate in code reviews and mentor junior developers
• Optimize application performance and user experience
• Work with RESTful APIs and GraphQL
• Implement automated testing strategies

Required Skills:
• 5+ years of experience with JavaScript and modern frameworks
• Expert knowledge of React, Redux, and TypeScript
• Experience with Node.js and Express
• Proficiency in HTML5, CSS3, and responsive design
• Familiarity with Git version control
• Experience with CI/CD pipelines
• Knowledge of testing frameworks (Jest, Cypress)
• Understanding of Agile development methodologies

Preferred Qualifications:
• Experience with AWS or other cloud platforms
• Knowledge of Docker and containerization
• Familiarity with GraphQL and Apollo Client
• Experience with performance optimization techniques
• Bachelor's degree in Computer Science or related field

We offer competitive salary, comprehensive benefits, and opportunities for professional growth in a collaborative environment.`
    };

    setJobTitle(exampleJob.title);
    setCompany(exampleJob.company);
    setJobDescription(exampleJob.description);
    setErrors({});
  };

  return (
    <div className={`job-description-form ${className}`}>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
          <button
            type="button"
            onClick={handlePasteExample}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Use Example Job
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Job Title */}
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BriefcaseIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className={`
                  block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${errors.jobTitle ? 'border-red-300' : 'border-gray-300'}
                `}
                placeholder="e.g. Senior Frontend Developer"
                disabled={isAnalyzing}
              />
            </div>
            {errors.jobTitle && (
              <p className="mt-1 text-sm text-red-600">{errors.jobTitle}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Company (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. TechCorp Inc."
                disabled={isAnalyzing}
              />
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Job Description *
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={12}
              className={`
                block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical
                ${errors.jobDescription ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="Paste the complete job description here, including responsibilities, requirements, and qualifications..."
              disabled={isAnalyzing}
            />
          </div>
          {errors.jobDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.jobDescription}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {jobDescription.length} characters (minimum 100 required)
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isAnalyzing}
            className={`
              flex items-center px-6 py-3 rounded-lg font-medium transition-colors
              ${isAnalyzing
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            `}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing Match...
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                Analyze Job Match
              </>
            )}
          </button>
        </div>
      </form>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for Better Analysis</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Include the complete job description with requirements and responsibilities</li>
          <li>• Make sure to paste both required and preferred qualifications</li>
          <li>• Include any specific technologies, tools, or skills mentioned</li>
          <li>• The more detailed the job description, the more accurate the match analysis</li>
        </ul>
      </div>
    </div>
  );
};