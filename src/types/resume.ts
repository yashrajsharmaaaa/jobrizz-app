// Core Resume Data Types
export interface ResumeData {
  id: string;
  templateId: string;
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
  styling: CustomStyling;
  metadata: ResumeMetadata;
  versions: ResumeVersion[];
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  content: SectionContent;
  order: number;
  isVisible: boolean;
  isCustom: boolean;
}

export type SectionType = 
  | 'experience' 
  | 'education' 
  | 'skills' 
  | 'projects' 
  | 'certifications' 
  | 'languages' 
  | 'custom';

// Section Content Types
export type SectionContent = 
  | ExperienceContent 
  | EducationContent 
  | SkillsContent 
  | ProjectsContent 
  | CertificationsContent 
  | LanguagesContent 
  | CustomContent;

export interface ExperienceContent {
  entries: ExperienceEntry[];
}

export interface ExperienceEntry {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string[];
  achievements: string[];
}

export interface EducationContent {
  entries: EducationEntry[];
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  gpa?: string;
  honors?: string[];
  coursework?: string[];
}

export interface SkillsContent {
  categories: SkillCategory[];
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

export interface ProjectsContent {
  entries: ProjectEntry[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  url?: string;
  githubUrl?: string;
  highlights: string[];
}

export interface CertificationsContent {
  entries: CertificationEntry[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  url?: string;
}

export interface LanguagesContent {
  entries: LanguageEntry[];
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
  certifications?: string[];
}

export interface CustomContent {
  entries: CustomEntry[];
}

export interface CustomEntry {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  date?: string;
  url?: string;
  details: string[];
}

// Styling and Customization
export interface CustomStyling {
  colors?: ColorScheme;
  fonts?: FontConfig;
  spacing?: SpacingConfig;
  layout?: LayoutOverrides;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  text: string;
  accent: string;
  background: string;
}

export interface FontConfig {
  headingFont: string;
  bodyFont: string;
  sizes: FontSizes;
}

export interface FontSizes {
  h1: number;
  h2: number;
  h3: number;
  body: number;
  small: number;
}

export interface SpacingConfig {
  sectionGap: number;
  itemGap: number;
  lineHeight: number;
}

export interface LayoutOverrides {
  headerStyle?: 'centered' | 'left' | 'split';
  sectionSpacing?: number;
  margins?: MarginConfig;
}

export interface MarginConfig {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Metadata and Versioning
export interface ResumeMetadata {
  createdAt: Date;
  updatedAt: Date;
  version: number;
  lastAutoSave?: Date;
  wordCount?: number;
  pageCount?: number;
}

export interface ResumeVersion {
  id: string;
  name: string;
  createdAt: Date;
  resumeData: ResumeData;
  thumbnail?: string;
}

// Export and Format Types
export type ExportFormat = 'pdf' | 'docx';

export interface ExportOptions {
  format: ExportFormat;
  pageSize?: 'A4' | 'Letter' | 'Legal';
  margins?: MarginConfig;
  includePageNumbers?: boolean;
  watermark?: string;
}

export interface ExportResult {
  blob: Blob;
  filename: string;
  success: boolean;
  error?: string;
}