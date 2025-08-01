import { z } from 'zod';
import DOMPurify from 'dompurify';
import type { ValidationResult, ValidationError, ValidationWarning } from '../../types/editor';
import type { SectionType } from '../../types/resume';
import {
  personalInfoSchema,
  experienceEntrySchema,
  educationEntrySchema,
  skillSchema,
  projectEntrySchema,
  certificationEntrySchema,
  languageEntrySchema,
  customEntrySchema,
  resumeDataSchema,
} from './schemas';

// Content sanitization configuration
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'p'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM_IMPORT: false,
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    // Server-side fallback - strip all HTML tags
    return html.replace(/<[^>]*>/g, '');
  }
  
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format (international)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanPhone);
};

/**
 * Validates URL format
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates date format and ensures it's not in the future
 */
export const validateDate = (dateString: string, allowFuture = false): boolean => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return false;
  }
  
  if (!allowFuture && date > new Date()) {
    return false;
  }
  
  return true;
};

/**
 * Validates date range (start date before end date)
 */
export const validateDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false;
  }
  
  return start <= end;
};

/**
 * Validates content length and provides warnings
 */
export const validateContentLength = (
  content: string,
  minLength: number = 0,
  maxLength: number = 1000,
  recommendedLength?: number
): { isValid: boolean; warnings: ValidationWarning[] } => {
  const length = content.trim().length;
  const warnings: ValidationWarning[] = [];
  
  if (recommendedLength && length > recommendedLength) {
    warnings.push({
      field: 'content',
      message: `Content is longer than recommended (${length}/${recommendedLength} characters)`,
      suggestion: 'Consider shortening for better readability',
    });
  }
  
  if (length < minLength * 0.5 && minLength > 0) {
    warnings.push({
      field: 'content',
      message: 'Content seems too short',
      suggestion: 'Add more details to make it more compelling',
    });
  }
  
  return {
    isValid: length >= minLength && length <= maxLength,
    warnings,
  };
};

/**
 * Validates resume content based on section type
 */
export const validateResumeContent = (
  content: string,
  sectionType: SectionType,
  fieldType: string = 'text'
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let sanitizedContent = content;
  
  // Sanitize HTML content
  if (fieldType === 'rich-text' || fieldType === 'textarea') {
    sanitizedContent = sanitizeHtml(content);
  }
  
  // Basic validation based on field type
  switch (fieldType) {
    case 'email':
      if (content && !validateEmail(content)) {
        errors.push({
          field: 'email',
          message: 'Please enter a valid email address',
          type: 'format',
        });
      }
      break;
      
    case 'phone':
      if (content && !validatePhone(content)) {
        errors.push({
          field: 'phone',
          message: 'Please enter a valid phone number',
          type: 'format',
        });
      }
      break;
      
    case 'url':
      if (content && !validateUrl(content)) {
        errors.push({
          field: 'url',
          message: 'Please enter a valid URL',
          type: 'format',
        });
      }
      break;
      
    case 'date':
      if (content && !validateDate(content)) {
        errors.push({
          field: 'date',
          message: 'Please enter a valid date',
          type: 'format',
        });
      }
      break;
  }
  
  // Section-specific validation
  const lengthValidation = validateContentLength(
    sanitizedContent,
    getSectionMinLength(sectionType, fieldType),
    getSectionMaxLength(sectionType, fieldType),
    getSectionRecommendedLength(sectionType, fieldType)
  );
  
  if (!lengthValidation.isValid) {
    errors.push({
      field: fieldType,
      message: 'Content length is invalid',
      type: 'length',
    });
  }
  
  warnings.push(...lengthValidation.warnings);
  
  // Check for common issues
  const commonIssues = checkCommonIssues(sanitizedContent, sectionType, fieldType);
  warnings.push(...commonIssues);
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedContent,
  };
};

/**
 * Gets minimum content length for section type and field
 */
const getSectionMinLength = (sectionType: SectionType, fieldType: string): number => {
  const minimums: Record<string, Record<string, number>> = {
    experience: {
      jobTitle: 2,
      company: 2,
      description: 10,
      achievements: 5,
    },
    education: {
      degree: 2,
      institution: 2,
    },
    projects: {
      name: 2,
      description: 20,
    },
    skills: {
      name: 1,
    },
  };
  
  return minimums[sectionType]?.[fieldType] || 0;
};

/**
 * Gets maximum content length for section type and field
 */
const getSectionMaxLength = (sectionType: SectionType, fieldType: string): number => {
  const maximums: Record<string, Record<string, number>> = {
    experience: {
      jobTitle: 100,
      company: 100,
      description: 200,
      achievements: 200,
    },
    education: {
      degree: 100,
      institution: 100,
    },
    projects: {
      name: 100,
      description: 500,
    },
    skills: {
      name: 50,
    },
    personal: {
      summary: 500,
    },
  };
  
  return maximums[sectionType]?.[fieldType] || 1000;
};

/**
 * Gets recommended content length for section type and field
 */
const getSectionRecommendedLength = (sectionType: SectionType, fieldType: string): number | undefined => {
  const recommended: Record<string, Record<string, number>> = {
    experience: {
      description: 150,
      achievements: 150,
    },
    projects: {
      description: 300,
    },
    personal: {
      summary: 300,
    },
  };
  
  return recommended[sectionType]?.[fieldType];
};

/**
 * Checks for common content issues and provides suggestions
 */
const checkCommonIssues = (
  content: string,
  sectionType: SectionType,
  fieldType: string
): ValidationWarning[] => {
  const warnings: ValidationWarning[] = [];
  
  // Check for passive voice in descriptions
  if (fieldType === 'description' && sectionType === 'experience') {
    const passiveIndicators = ['was', 'were', 'been', 'being'];
    const hasPassiveVoice = passiveIndicators.some(indicator => 
      content.toLowerCase().includes(` ${indicator} `)
    );
    
    if (hasPassiveVoice) {
      warnings.push({
        field: fieldType,
        message: 'Consider using active voice for stronger impact',
        suggestion: 'Start with action verbs like "Led", "Developed", "Managed"',
      });
    }
  }
  
  // Check for missing action verbs in experience descriptions
  if (fieldType === 'description' && sectionType === 'experience') {
    const actionVerbs = [
      'achieved', 'built', 'created', 'developed', 'established', 'implemented',
      'improved', 'increased', 'led', 'managed', 'optimized', 'reduced'
    ];
    
    const hasActionVerb = actionVerbs.some(verb => 
      content.toLowerCase().includes(verb)
    );
    
    if (!hasActionVerb && content.length > 20) {
      warnings.push({
        field: fieldType,
        message: 'Consider starting with strong action verbs',
        suggestion: 'Use verbs like "Achieved", "Built", "Created", "Developed"',
      });
    }
  }
  
  // Check for quantifiable results
  if (fieldType === 'achievements' || (fieldType === 'description' && sectionType === 'experience')) {
    const hasNumbers = /\d/.test(content);
    const hasPercentage = /%/.test(content);
    const hasMetrics = /\$|revenue|sales|users|customers|efficiency|performance/.test(content.toLowerCase());
    
    if (!hasNumbers && !hasPercentage && !hasMetrics && content.length > 30) {
      warnings.push({
        field: fieldType,
        message: 'Consider adding quantifiable results',
        suggestion: 'Include numbers, percentages, or metrics to show impact',
      });
    }
  }
  
  return warnings;
};

/**
 * Validates complete resume data using Zod schemas
 */
export const validateResumeData = (data: unknown): ValidationResult => {
  try {
    resumeDataSchema.parse(data);
    return {
      isValid: true,
      errors: [],
      warnings: [],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
        type: err.code,
      }));
      
      return {
        isValid: false,
        errors,
        warnings: [],
      };
    }
    
    return {
      isValid: false,
      errors: [{
        field: 'unknown',
        message: 'An unexpected validation error occurred',
        type: 'unknown',
      }],
      warnings: [],
    };
  }
};

/**
 * Validates specific section data
 */
export const validateSectionData = (sectionType: SectionType, data: unknown): ValidationResult => {
  const schemas = {
    experience: experienceEntrySchema,
    education: educationEntrySchema,
    skills: skillSchema,
    projects: projectEntrySchema,
    certifications: certificationEntrySchema,
    languages: languageEntrySchema,
    custom: customEntrySchema,
  };
  
  const schema = schemas[sectionType];
  if (!schema) {
    return {
      isValid: false,
      errors: [{
        field: 'sectionType',
        message: `Unknown section type: ${sectionType}`,
        type: 'invalid',
      }],
      warnings: [],
    };
  }
  
  try {
    schema.parse(data);
    return {
      isValid: true,
      errors: [],
      warnings: [],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
        type: err.code,
      }));
      
      return {
        isValid: false,
        errors,
        warnings: [],
      };
    }
    
    return {
      isValid: false,
      errors: [{
        field: 'unknown',
        message: 'An unexpected validation error occurred',
        type: 'unknown',
      }],
      warnings: [],
    };
  }
};

/**
 * Validates personal information
 */
export const validatePersonalInfo = (data: unknown): ValidationResult => {
  try {
    personalInfoSchema.parse(data);
    return {
      isValid: true,
      errors: [],
      warnings: [],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
        type: err.code,
      }));
      
      return {
        isValid: false,
        errors,
        warnings: [],
      };
    }
    
    return {
      isValid: false,
      errors: [{
        field: 'unknown',
        message: 'An unexpected validation error occurred',
        type: 'unknown',
      }],
      warnings: [],
    };
  }
};