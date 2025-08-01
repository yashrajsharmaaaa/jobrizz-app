// Template System Types
export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  preview: string;
  thumbnail: string;
  layout: LayoutConfig;
  styling: StyleConfig;
  sections: SectionConfig[];
  tags: string[];
}

export type TemplateCategory = 'modern' | 'classic' | 'creative' | 'minimal' | 'professional';

export interface LayoutConfig {
  type: 'single-column' | 'two-column' | 'sidebar';
  columns: 1 | 2;
  headerHeight: number;
  headerStyle: 'centered' | 'left' | 'split';
  sectionSpacing: number;
  pageMargins: MarginConfig;
  maxWidth?: number;
}

export interface StyleConfig {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  headingFont?: string;
  fontSize: FontSizeConfig;
  lineHeight: number;
  borderRadius?: number;
  shadows?: boolean;
}

export interface FontSizeConfig {
  h1: number;
  h2: number;
  h3: number;
  body: number;
  small: number;
  caption: number;
}

export interface MarginConfig {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface SectionConfig {
  type: SectionType;
  defaultTitle: string;
  isRequired: boolean;
  maxEntries?: number;
  customFields?: CustomField[];
  styling?: SectionStyling;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'date' | 'url' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: FieldValidation;
}

export interface FieldValidation {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  message?: string;
}

export interface SectionStyling {
  headerColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  spacing?: number;
  alignment?: 'left' | 'center' | 'right';
}

// Template Customization
export interface TemplateCustomization {
  templateId: string;
  colors: Partial<ColorScheme>;
  fonts: Partial<FontConfig>;
  layout: Partial<LayoutConfig>;
  sections: SectionCustomization[];
}

export interface SectionCustomization {
  sectionType: SectionType;
  isVisible: boolean;
  title?: string;
  styling?: SectionStyling;
  order: number;
}

// Template Selection and Preview
export interface TemplatePreview {
  templateId: string;
  previewUrl: string;
  thumbnailUrl: string;
  isLoading: boolean;
  error?: string;
}

export interface TemplateFilter {
  category?: TemplateCategory;
  tags?: string[];
  searchQuery?: string;
}

// Template Builder Types (for future template creation)
export interface TemplateBuilder {
  id: string;
  name: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  config: TemplateConfig;
  preview?: string;
}

export interface TemplateConfig {
  layout: LayoutConfig;
  styling: StyleConfig;
  sections: SectionConfig[];
  customCss?: string;
  variables?: TemplateVariable[];
}

export interface TemplateVariable {
  name: string;
  type: 'color' | 'font' | 'number' | 'text';
  defaultValue: string | number;
  description?: string;
  cssProperty: string;
}

// Import types from resume.ts
import type { SectionType, ColorScheme, FontConfig } from './resume';