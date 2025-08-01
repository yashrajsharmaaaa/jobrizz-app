// Resume library exports
export * from './defaults';
export * from './utils';

// Re-export specific types to avoid conflicts
export type { ResumeData, PersonalInfo, ResumeSection, SectionType } from '../../types/resume';
export type { Template, TemplateCategory } from '../../types/template';