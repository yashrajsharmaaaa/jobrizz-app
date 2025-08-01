import React, { useState, useMemo } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { templateCategories, getTemplatesByCategory } from '../../data/templates';
import type { Template, TemplateCategory, TemplateFilter } from '../../types/template';

interface TemplateSelectorProps {
  selectedTemplateId?: string;
  onTemplateSelect: (template: Template) => void;
  onPreview?: (template: Template) => void;
  className?: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onTemplateSelect,
  onPreview,
  className = '',
}) => {
  const [filter, setFilter] = useState<TemplateFilter>({
    searchQuery: '',
  });

  // Filter templates based on current filter state
  const filteredTemplates = useMemo(() => {
    let filtered = getTemplatesByCategory(filter.category || 'all');

    // Apply search filter
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [filter]);

  const handleCategoryChange = (category: string) => {
    setFilter(prev => ({ ...prev, category: category as TemplateCategory }));
  };

  const handleSearchChange = (query: string) => {
    setFilter(prev => ({ ...prev, searchQuery: query }));
  };

  const handleTemplateClick = (template: Template) => {
    onTemplateSelect(template);
  };

  const handlePreviewClick = (template: Template, event: React.MouseEvent) => {
    event.stopPropagation();
    onPreview?.(template);
  };

  return (
    <div className={`template-selector ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Template
        </h2>
        <p className="text-gray-600">
          Select a professional template that matches your style and industry
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Category Filter */}
        <div className="relative">
          <select
            value={filter.category || 'all'}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {templateCategories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search templates..."
            value={filter.searchQuery || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>


      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplateId === template.id}
            onSelect={() => handleTemplateClick(template)}
            onPreview={(e) => handlePreviewClick(template, e)}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
  onPreview: (event: React.MouseEvent) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  onPreview,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`template-card relative bg-white rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >


      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-blue-500 text-white rounded-full p-1">
            <CheckIcon className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Template Preview */}
      <div className="aspect-[3/4] bg-gray-100 rounded-t-lg overflow-hidden relative">
        {!imageError ? (
          <>
            <img
              src={template.thumbnail}
              alt={`${template.name} template preview`}
              className={`w-full h-full object-cover transition-opacity duration-200 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-gray-500">Preview</p>
            </div>
          </div>
        )}

        {/* Preview Button */}
        <button
          onClick={onPreview}
          className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100"
        >
          <div className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium shadow-lg">
            Preview
          </div>
        </button>
      </div>

      {/* Template Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">{template.name}</h3>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium capitalize">
            {template.category}
          </span>
          <div className="flex items-center space-x-1">
            {template.layout.type === 'two-column' && (
              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">2-Column</span>
            )}
            {template.styling.shadows && (
              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">Shadows</span>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="inline-block text-gray-500 px-2 py-1 text-xs">
              +{template.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};