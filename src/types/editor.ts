// Editor and UI State Types
export interface EditorState {
  activeSection: string | null;
  editingField: string | null;
  isDragging: boolean;
  draggedSection: string | null;
  previewScale: number;
  showPreview: boolean;
  isMobileView: boolean;
  unsavedChanges: boolean;
  lastSaved: Date | null;
}

export interface DragDropSection {
  id: string;
  type: SectionType;
  order: number;
  content: SectionContent;
  isVisible: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
}

export interface DropZone {
  id: string;
  position: number;
  isActive: boolean;
  canDrop: boolean;
}

// Content Editing Types
export interface ContentEditor {
  type: 'rich-text' | 'plain-text' | 'structured';
  value: string;
  placeholder?: string;
  maxLength?: number;
  validation?: ValidationRule[];
  suggestions?: ContentSuggestion[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'url' | 'phone' | 'date' | 'custom';
  message: string;
  pattern?: string;
  validator?: (value: string) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  sanitizedContent?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  type: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Content Suggestions and AI Assistance
export interface ContentSuggestion {
  id: string;
  type: 'completion' | 'improvement' | 'template' | 'grammar';
  text: string;
  confidence: number;
  category?: string;
  metadata?: Record<string, any>;
}

export interface SuggestionProvider {
  getSuggestions: (content: string, context: SuggestionContext) => Promise<ContentSuggestion[]>;
  applySuggestion: (suggestion: ContentSuggestion, content: string) => string;
}

export interface SuggestionContext {
  sectionType: SectionType;
  fieldType: string;
  jobTitle?: string;
  industry?: string;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
}

// Form and Input Types
export interface FormField {
  id: string;
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
  dependsOn?: string;
  conditional?: ConditionalRule;
}

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'email' 
  | 'tel' 
  | 'url' 
  | 'date' 
  | 'select' 
  | 'multiselect' 
  | 'checkbox' 
  | 'radio' 
  | 'rich-text'
  | 'file';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface ConditionalRule {
  field: string;
  operator: 'equals' | 'not-equals' | 'contains' | 'not-contains';
  value: string | string[];
}

// Auto-save and Recovery
export interface AutoSaveState {
  isEnabled: boolean;
  interval: number; // in milliseconds
  lastSave: Date | null;
  pendingChanges: boolean;
  saveInProgress: boolean;
  error?: string;
}

export interface RecoveryData {
  resumeId: string;
  timestamp: Date;
  data: ResumeData;
  source: 'auto-save' | 'manual-save' | 'crash-recovery';
}

// Undo/Redo System
export interface HistoryState {
  past: ResumeData[];
  present: ResumeData;
  future: ResumeData[];
  maxHistorySize: number;
}

export interface HistoryAction {
  type: 'undo' | 'redo' | 'push' | 'clear';
  description?: string;
  timestamp?: Date;
}

// Preview and Export States
export interface PreviewState {
  isLoading: boolean;
  scale: number;
  pageSize: 'A4' | 'Letter' | 'Legal';
  showGrid: boolean;
  showMargins: boolean;
  showPageBreaks: boolean;
  error?: string;
}

export interface ExportState {
  isExporting: boolean;
  format: ExportFormat | null;
  progress: number;
  error?: string;
  lastExport?: {
    format: ExportFormat;
    timestamp: Date;
    filename: string;
  };
}

// Accessibility and Keyboard Navigation
export interface AccessibilityState {
  isKeyboardNavigation: boolean;
  focusedElement: string | null;
  announcements: string[];
  highContrast: boolean;
  reducedMotion: boolean;
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: string;
  description: string;
  scope?: 'global' | 'editor' | 'preview';
}

// Error Handling
export interface ErrorState {
  hasError: boolean;
  error?: Error;
  errorBoundary?: string;
  recoveryData?: RecoveryData;
  userMessage?: string;
}

export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  timestamp: Date;
  userAgent: string;
  url: string;
}

// Import types from other files
import type { SectionType, SectionContent, ResumeData, ExportFormat } from './resume';