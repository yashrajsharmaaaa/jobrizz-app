import type { Template } from '../types/template';

// Professional Resume Templates
export const templates: Template[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    category: 'modern',
    preview: '/templates/modern-professional-preview.png',
    thumbnail: '/templates/modern-professional-thumb.png',
    layout: {
      type: 'single-column',
      columns: 1,
      headerHeight: 120,
      headerStyle: 'centered',
      sectionSpacing: 24,
      pageMargins: {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40,
      },
      maxWidth: 800,
    },
    styling: {
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      textColor: '#1e293b',
      accentColor: '#3b82f6',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
      headingFont: 'Inter',
      fontSize: {
        h1: 28,
        h2: 20,
        h3: 16,
        body: 12,
        small: 10,
        caption: 9,
      },
      lineHeight: 1.5,
      borderRadius: 8,
      shadows: true,
    },
    sections: [
      {
        type: 'experience',
        defaultTitle: 'Professional Experience',
        isRequired: true,
        styling: {
          headerColor: '#2563eb',
          spacing: 16,
          alignment: 'left',
        },
      },
      {
        type: 'education',
        defaultTitle: 'Education',
        isRequired: true,
        styling: {
          headerColor: '#2563eb',
          spacing: 16,
          alignment: 'left',
        },
      },
      {
        type: 'skills',
        defaultTitle: 'Skills',
        isRequired: false,
        styling: {
          headerColor: '#2563eb',
          spacing: 12,
          alignment: 'left',
        },
      },
    ],
    tags: ['professional', 'clean', 'modern', 'single-column'],
  },
  {
    id: 'classic-elegant',
    name: 'Classic Elegant',
    category: 'classic',
    preview: '/templates/classic-elegant-preview.png',
    thumbnail: '/templates/classic-elegant-thumb.png',
    layout: {
      type: 'single-column',
      columns: 1,
      headerHeight: 100,
      headerStyle: 'left',
      sectionSpacing: 20,
      pageMargins: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      },
      maxWidth: 750,
    },
    styling: {
      primaryColor: '#1f2937',
      secondaryColor: '#6b7280',
      textColor: '#111827',
      accentColor: '#374151',
      backgroundColor: '#ffffff',
      fontFamily: 'Georgia',
      headingFont: 'Georgia',
      fontSize: {
        h1: 26,
        h2: 18,
        h3: 14,
        body: 11,
        small: 9,
        caption: 8,
      },
      lineHeight: 1.6,
      borderRadius: 0,
      shadows: false,
    },
    sections: [
      {
        type: 'experience',
        defaultTitle: 'Work Experience',
        isRequired: true,
        styling: {
          headerColor: '#1f2937',
          spacing: 14,
          alignment: 'left',
        },
      },
      {
        type: 'education',
        defaultTitle: 'Education',
        isRequired: true,
        styling: {
          headerColor: '#1f2937',
          spacing: 14,
          alignment: 'left',
        },
      },
      {
        type: 'skills',
        defaultTitle: 'Core Competencies',
        isRequired: false,
        styling: {
          headerColor: '#1f2937',
          spacing: 10,
          alignment: 'left',
        },
      },
    ],
    tags: ['classic', 'traditional', 'serif', 'elegant'],
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    category: 'creative',
    preview: '/templates/creative-bold-preview.png',
    thumbnail: '/templates/creative-bold-thumb.png',
    layout: {
      type: 'two-column',
      columns: 2,
      headerHeight: 140,
      headerStyle: 'split',
      sectionSpacing: 28,
      pageMargins: {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30,
      },
      maxWidth: 850,
    },
    styling: {
      primaryColor: '#dc2626',
      secondaryColor: '#991b1b',
      textColor: '#1f2937',
      accentColor: '#ef4444',
      backgroundColor: '#ffffff',
      fontFamily: 'Poppins',
      headingFont: 'Poppins',
      fontSize: {
        h1: 32,
        h2: 22,
        h3: 18,
        body: 12,
        small: 10,
        caption: 9,
      },
      lineHeight: 1.4,
      borderRadius: 12,
      shadows: true,
    },
    sections: [
      {
        type: 'experience',
        defaultTitle: 'Experience',
        isRequired: true,
        styling: {
          headerColor: '#dc2626',
          spacing: 18,
          alignment: 'left',
        },
      },
      {
        type: 'education',
        defaultTitle: 'Education',
        isRequired: true,
        styling: {
          headerColor: '#dc2626',
          spacing: 18,
          alignment: 'left',
        },
      },
      {
        type: 'skills',
        defaultTitle: 'Skills',
        isRequired: false,
        styling: {
          headerColor: '#dc2626',
          spacing: 14,
          alignment: 'left',
        },
      },
      {
        type: 'projects',
        defaultTitle: 'Projects',
        isRequired: false,
        styling: {
          headerColor: '#dc2626',
          spacing: 16,
          alignment: 'left',
        },
      },
    ],
    tags: ['creative', 'bold', 'colorful', 'two-column', 'modern'],
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    category: 'minimal',
    preview: '/templates/minimal-clean-preview.png',
    thumbnail: '/templates/minimal-clean-thumb.png',
    layout: {
      type: 'single-column',
      columns: 1,
      headerHeight: 80,
      headerStyle: 'left',
      sectionSpacing: 32,
      pageMargins: {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60,
      },
      maxWidth: 700,
    },
    styling: {
      primaryColor: '#000000',
      secondaryColor: '#666666',
      textColor: '#333333',
      accentColor: '#999999',
      backgroundColor: '#ffffff',
      fontFamily: 'Helvetica',
      headingFont: 'Helvetica',
      fontSize: {
        h1: 24,
        h2: 16,
        h3: 14,
        body: 11,
        small: 9,
        caption: 8,
      },
      lineHeight: 1.7,
      borderRadius: 0,
      shadows: false,
    },
    sections: [
      {
        type: 'experience',
        defaultTitle: 'Experience',
        isRequired: true,
        styling: {
          headerColor: '#000000',
          spacing: 20,
          alignment: 'left',
        },
      },
      {
        type: 'education',
        defaultTitle: 'Education',
        isRequired: true,
        styling: {
          headerColor: '#000000',
          spacing: 20,
          alignment: 'left',
        },
      },
      {
        type: 'skills',
        defaultTitle: 'Skills',
        isRequired: false,
        styling: {
          headerColor: '#000000',
          spacing: 16,
          alignment: 'left',
        },
      },
    ],
    tags: ['minimal', 'clean', 'simple', 'black-white', 'helvetica'],
  },
  {
    id: 'executive',
    name: 'Executive',
    category: 'professional',
    preview: '/templates/executive-preview.png',
    thumbnail: '/templates/executive-thumb.png',
    layout: {
      type: 'sidebar',
      columns: 2,
      headerHeight: 110,
      headerStyle: 'centered',
      sectionSpacing: 22,
      pageMargins: {
        top: 35,
        right: 35,
        bottom: 35,
        left: 35,
      },
      maxWidth: 820,
    },
    styling: {
      primaryColor: '#1e40af',
      secondaryColor: '#3730a3',
      textColor: '#1f2937',
      accentColor: '#2563eb',
      backgroundColor: '#ffffff',
      fontFamily: 'Roboto',
      headingFont: 'Roboto',
      fontSize: {
        h1: 30,
        h2: 19,
        h3: 15,
        body: 11,
        small: 9,
        caption: 8,
      },
      lineHeight: 1.5,
      borderRadius: 6,
      shadows: true,
    },
    sections: [
      {
        type: 'experience',
        defaultTitle: 'Professional Experience',
        isRequired: true,
        styling: {
          headerColor: '#1e40af',
          spacing: 16,
          alignment: 'left',
        },
      },
      {
        type: 'education',
        defaultTitle: 'Education & Qualifications',
        isRequired: true,
        styling: {
          headerColor: '#1e40af',
          spacing: 16,
          alignment: 'left',
        },
      },
      {
        type: 'skills',
        defaultTitle: 'Core Competencies',
        isRequired: false,
        styling: {
          headerColor: '#1e40af',
          spacing: 12,
          alignment: 'left',
        },
      },
      {
        type: 'certifications',
        defaultTitle: 'Certifications',
        isRequired: false,
        styling: {
          headerColor: '#1e40af',
          spacing: 14,
          alignment: 'left',
        },
      },
    ],
    tags: ['executive', 'professional', 'sidebar', 'corporate'],
  },
];

// Template categories for filtering
export const templateCategories = [
  { value: 'all', label: 'All Templates' },
  { value: 'modern', label: 'Modern' },
  { value: 'classic', label: 'Classic' },
  { value: 'creative', label: 'Creative' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'professional', label: 'Professional' },
];

// Get template by ID
export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};

// Get templates by category
export const getTemplatesByCategory = (category: string): Template[] => {
  if (category === 'all') return templates;
  return templates.filter(template => template.category === category);
};

// Get default template
export const getDefaultTemplate = (): Template => {
  return templates[0]; // Modern Professional
};

// Template color schemes for customization
export const colorSchemes = [
  {
    name: 'Professional Blue',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      text: '#1e293b',
      accent: '#3b82f6',
      background: '#ffffff',
    },
  },
  {
    name: 'Classic Black',
    colors: {
      primary: '#1f2937',
      secondary: '#6b7280',
      text: '#111827',
      accent: '#374151',
      background: '#ffffff',
    },
  },
  {
    name: 'Creative Red',
    colors: {
      primary: '#dc2626',
      secondary: '#991b1b',
      text: '#1f2937',
      accent: '#ef4444',
      background: '#ffffff',
    },
  },
  {
    name: 'Nature Green',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      text: '#1f2937',
      accent: '#10b981',
      background: '#ffffff',
    },
  },
  {
    name: 'Royal Purple',
    colors: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      text: '#1f2937',
      accent: '#8b5cf6',
      background: '#ffffff',
    },
  },
  {
    name: 'Warm Orange',
    colors: {
      primary: '#ea580c',
      secondary: '#c2410c',
      text: '#1f2937',
      accent: '#f97316',
      background: '#ffffff',
    },
  },
];

// Font options for customization
export const fontOptions = [
  { name: 'Inter', value: 'Inter', category: 'sans-serif' },
  { name: 'Roboto', value: 'Roboto', category: 'sans-serif' },
  { name: 'Poppins', value: 'Poppins', category: 'sans-serif' },
  { name: 'Helvetica', value: 'Helvetica', category: 'sans-serif' },
  { name: 'Arial', value: 'Arial', category: 'sans-serif' },
  { name: 'Georgia', value: 'Georgia', category: 'serif' },
  { name: 'Times New Roman', value: 'Times New Roman', category: 'serif' },
  { name: 'Playfair Display', value: 'Playfair Display', category: 'serif' },
];