// Main types export file - using explicit exports to avoid naming conflicts
// export * from './resume';
// export * from './template';
// export * from './editor';
// export * from './errors';

// Re-export commonly used types for convenience
export type {
  ResumeData,
  PersonalInfo,
  ResumeSection,
  SectionType,
  SectionContent,
  ExperienceEntry,
  EducationEntry,
  SkillCategory,
  Skill,
  ProjectEntry,
  CertificationEntry,
  LanguageEntry,
  CustomEntry,
  ExportFormat,
  ExportOptions,
  ExportResult,
  MarginConfig as ResumeMarginConfig,
} from './resume';

export type {
  Template,
  TemplateCategory,
  LayoutConfig,
  StyleConfig,
  TemplateCustomization,
  TemplatePreview,
  TemplateFilter,
  MarginConfig as TemplateMarginConfig,
} from './template';

export type {
  EditorState,
  DragDropSection,
  ContentEditor,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  FormField,
  FieldType,
  AutoSaveState,
  PreviewState,
  ExportState,
  ErrorInfo as EditorErrorInfo,
} from './editor';

export type {
  AppError,
  ResumeBuilderError,
  ValidationError as ValidationErrorClass,
  ExportError,
  StorageError,
  TemplateError,
  ErrorRecoveryAction,
  ErrorBoundaryState,
  ErrorCode,
  ErrorSeverity,
  ErrorCategory,
  ErrorInfo as ErrorErrorInfo,
} from './errors';