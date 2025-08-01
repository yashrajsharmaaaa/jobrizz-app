import React, { useState } from 'react';
import { SwatchIcon, DocumentTextIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { colorSchemes, fontOptions } from '../../data/templates';
import type { Template, TemplateCustomization } from '../../types/template';
import type { ColorScheme, FontConfig, FontSizes } from '../../types/resume';

interface TemplateCustomizerProps {
  template: Template;
  customization: TemplateCustomization;
  onCustomizationChange: (customization: TemplateCustomization) => void;
  className?: string;
}

export const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
  template,
  customization,
  onCustomizationChange,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'layout'>('colors');

  const handleColorChange = (colors: Partial<ColorScheme>) => {
    onCustomizationChange({
      ...customization,
      colors: { ...customization.colors, ...colors },
    });
  };

  const handleFontChange = (fonts: Partial<FontConfig>) => {
    onCustomizationChange({
      ...customization,
      fonts: { ...customization.fonts, ...fonts },
    });
  };

  const handleLayoutChange = (layout: any) => {
    onCustomizationChange({
      ...customization,
      layout: { ...customization.layout, ...layout },
    });
  };

  const tabs = [
    { id: 'colors', label: 'Colors', icon: SwatchIcon },
    { id: 'fonts', label: 'Typography', icon: DocumentTextIcon },
    { id: 'layout', label: 'Layout', icon: AdjustmentsHorizontalIcon },
  ];

  return (
    <div className={`template-customizer bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Customize Template</h3>
        <p className="text-sm text-gray-600 mt-1">
          Personalize the {template.name} template to match your style
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'colors' && (
          <ColorCustomizer
            currentColors={customization.colors}
            onColorChange={handleColorChange}
          />
        )}
        {activeTab === 'fonts' && (
          <FontCustomizer
            currentFonts={customization.fonts}
            onFontChange={handleFontChange}
          />
        )}
        {activeTab === 'layout' && (
          <LayoutCustomizer
            template={template}
            currentLayout={customization.layout}
            onLayoutChange={handleLayoutChange}
          />
        )}
      </div>
    </div>
  );
};

interface ColorCustomizerProps {
  currentColors: Partial<ColorScheme>;
  onColorChange: (colors: Partial<ColorScheme>) => void;
}

const ColorCustomizer: React.FC<ColorCustomizerProps> = ({
  currentColors,
  onColorChange,
}) => {
  const [customMode, setCustomMode] = useState(false);

  const handleSchemeSelect = (scheme: typeof colorSchemes[0]) => {
    onColorChange(scheme.colors);
    setCustomMode(false);
  };

  const handleCustomColorChange = (colorKey: keyof ColorScheme, value: string) => {
    onColorChange({ [colorKey]: value });
  };

  return (
    <div className="space-y-6">
      {/* Preset Color Schemes */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Color Schemes</h4>
        <div className="grid grid-cols-2 gap-3">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.name}
              onClick={() => handleSchemeSelect(scheme)}
              className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex space-x-1">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: scheme.colors.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: scheme.colors.secondary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: scheme.colors.accent }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">{scheme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">Custom Colors</span>
        <button
          onClick={() => setCustomMode(!customMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            customMode ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              customMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Custom Color Inputs */}
      {customMode && (
        <div className="space-y-4">
          {Object.entries(currentColors).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={value || '#000000'}
                  onChange={(e) => handleCustomColorChange(key as keyof ColorScheme, e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={value || '#000000'}
                  onChange={(e) => handleCustomColorChange(key as keyof ColorScheme, e.target.value)}
                  className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface FontCustomizerProps {
  currentFonts: Partial<FontConfig>;
  onFontChange: (fonts: Partial<FontConfig>) => void;
}

const FontCustomizer: React.FC<FontCustomizerProps> = ({
  currentFonts,
  onFontChange,
}) => {
  const handleFontFamilyChange = (type: 'headingFont' | 'bodyFont', value: string) => {
    onFontChange({ [type]: value });
  };

  const handleFontSizeChange = (sizeKey: string, value: number) => {
    const currentSizes = currentFonts.sizes || { h1: 24, h2: 20, h3: 16, body: 12, small: 10 };
    onFontChange({
      sizes: {
        ...currentSizes,
        [sizeKey]: value,
      } as FontSizes,
    });
  };

  const sansSerifFonts = fontOptions.filter(font => font.category === 'sans-serif');
  const serifFonts = fontOptions.filter(font => font.category === 'serif');

  return (
    <div className="space-y-6">
      {/* Font Family Selection */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Font Families</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heading Font
            </label>
            <select
              value={currentFonts.headingFont || ''}
              onChange={(e) => handleFontFamilyChange('headingFont', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <optgroup label="Sans Serif">
                {sansSerifFonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Serif">
                {serifFonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Font
            </label>
            <select
              value={currentFonts.bodyFont || ''}
              onChange={(e) => handleFontFamilyChange('bodyFont', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <optgroup label="Sans Serif">
                {sansSerifFonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Serif">
                {serifFonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Font Sizes */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Font Sizes</h4>
        <div className="space-y-3">
          {Object.entries(currentFonts.sizes || {}).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 capitalize">
                {key === 'h1' ? 'Main Heading' : 
                 key === 'h2' ? 'Section Heading' :
                 key === 'h3' ? 'Sub Heading' :
                 key === 'body' ? 'Body Text' :
                 key === 'small' ? 'Small Text' : key}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min={key === 'h1' ? 20 : key === 'h2' ? 16 : key === 'h3' ? 12 : key === 'body' ? 10 : 8}
                  max={key === 'h1' ? 40 : key === 'h2' ? 28 : key === 'h3' ? 20 : key === 'body' ? 16 : 12}
                  value={value as number}
                  onChange={(e) => handleFontSizeChange(key, parseInt(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-600 w-8">{value as number}px</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface LayoutCustomizerProps {
  template: Template;
  currentLayout: any;
  onLayoutChange: (layout: any) => void;
}

const LayoutCustomizer: React.FC<LayoutCustomizerProps> = ({
  template,
  currentLayout,
  onLayoutChange,
}) => {
  const handleMarginChange = (side: string, value: number) => {
    onLayoutChange({
      pageMargins: {
        ...currentLayout.pageMargins,
        [side]: value,
      },
    });
  };

  const handleSpacingChange = (key: string, value: number) => {
    onLayoutChange({
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Style */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Header Style</h4>
        <div className="grid grid-cols-3 gap-2">
          {['left', 'centered', 'split'].map((style) => (
            <button
              key={style}
              onClick={() => onLayoutChange({ headerStyle: style })}
              className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                currentLayout.headerStyle === style
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Page Margins */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Page Margins</h4>
        <div className="space-y-3">
          {Object.entries(currentLayout.pageMargins || {}).map(([side, value]) => (
            <div key={side} className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 capitalize">
                {side}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min={20}
                  max={80}
                  value={value as number}
                  onChange={(e) => handleMarginChange(side, parseInt(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-600 w-8">{String(value)}px</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Spacing */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Spacing</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Section Spacing
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min={12}
                max={40}
                value={currentLayout.sectionSpacing || 20}
                onChange={(e) => handleSpacingChange('sectionSpacing', parseInt(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600 w-8">{currentLayout.sectionSpacing || 20}px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Template-specific options */}
      {template.layout.type === 'two-column' && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Column Layout</h4>
          <p className="text-sm text-gray-600">
            This template uses a two-column layout. The left column typically contains contact information and skills, while the right column contains experience and education.
          </p>
        </div>
      )}
    </div>
  );
};