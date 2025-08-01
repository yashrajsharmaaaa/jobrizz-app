import { z } from 'zod';

// Personal Information Schema
export const personalInfoSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20, 'Phone number must be less than 20 characters'),
    location: z.string().min(1, 'Location is required').max(100, 'Location must be less than 100 characters'),
    website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
    github: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
    summary: z.string().max(500, 'Summary must be less than 500 characters').optional(),
});

// Experience Entry Schema
export const experienceEntrySchema = z.object({
    id: z.string(),
    jobTitle: z.string().min(1, 'Job title is required').max(100, 'Job title must be less than 100 characters'),
    company: z.string().min(1, 'Company name is required').max(100, 'Company name must be less than 100 characters'),
    location: z.string().min(1, 'Location is required').max(100, 'Location must be less than 100 characters'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    isCurrent: z.boolean(),
    description: z.array(z.string().max(200, 'Each description point must be less than 200 characters')).max(10, 'Maximum 10 description points'),
    achievements: z.array(z.string().max(200, 'Each achievement must be less than 200 characters')).max(10, 'Maximum 10 achievements'),
}).refine((data) => {
    if (!data.isCurrent && !data.endDate) {
        return false;
    }
    return true;
}, {
    message: 'End date is required when position is not current',
    path: ['endDate'],
});

// Education Entry Schema
export const educationEntrySchema = z.object({
    id: z.string(),
    degree: z.string().min(1, 'Degree is required').max(100, 'Degree must be less than 100 characters'),
    institution: z.string().min(1, 'Institution is required').max(100, 'Institution must be less than 100 characters'),
    location: z.string().min(1, 'Location is required').max(100, 'Location must be less than 100 characters'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    isCurrent: z.boolean(),
    gpa: z.string().optional(),
    honors: z.array(z.string().max(100, 'Each honor must be less than 100 characters')).optional(),
    coursework: z.array(z.string().max(100, 'Each course must be less than 100 characters')).optional(),
}).refine((data) => {
    if (!data.isCurrent && !data.endDate) {
        return false;
    }
    return true;
}, {
    message: 'End date is required when education is not current',
    path: ['endDate'],
});

// Skill Schema
export const skillSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Skill name is required').max(50, 'Skill name must be less than 50 characters'),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
    yearsOfExperience: z.number().min(0, 'Years of experience must be positive').max(50, 'Years of experience must be less than 50').optional(),
});

// Skill Category Schema
export const skillCategorySchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Category name is required').max(50, 'Category name must be less than 50 characters'),
    skills: z.array(skillSchema).min(1, 'At least one skill is required').max(20, 'Maximum 20 skills per category'),
});

// Project Entry Schema
export const projectEntrySchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters'),
    description: z.string().min(1, 'Project description is required').max(500, 'Description must be less than 500 characters'),
    technologies: z.array(z.string().max(30, 'Each technology must be less than 30 characters')).max(20, 'Maximum 20 technologies'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    isCurrent: z.boolean(),
    url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    githubUrl: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
    highlights: z.array(z.string().max(200, 'Each highlight must be less than 200 characters')).max(10, 'Maximum 10 highlights'),
});

// Certification Entry Schema
export const certificationEntrySchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Certification name is required').max(100, 'Certification name must be less than 100 characters'),
    issuer: z.string().min(1, 'Issuer is required').max(100, 'Issuer must be less than 100 characters'),
    issueDate: z.string().min(1, 'Issue date is required'),
    expirationDate: z.string().optional(),
    credentialId: z.string().max(100, 'Credential ID must be less than 100 characters').optional(),
    url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

// Language Entry Schema
export const languageEntrySchema = z.object({
    id: z.string(),
    language: z.string().min(1, 'Language is required').max(50, 'Language must be less than 50 characters'),
    proficiency: z.enum(['basic', 'conversational', 'fluent', 'native']),
    certifications: z.array(z.string().max(100, 'Each certification must be less than 100 characters')).optional(),
});

// Custom Entry Schema
export const customEntrySchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    subtitle: z.string().max(100, 'Subtitle must be less than 100 characters').optional(),
    description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
    date: z.string().optional(),
    url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    details: z.array(z.string().max(200, 'Each detail must be less than 200 characters')).max(10, 'Maximum 10 details'),
});

// Section Content Schemas
export const experienceContentSchema = z.object({
    entries: z.array(experienceEntrySchema).max(20, 'Maximum 20 experience entries'),
});

export const educationContentSchema = z.object({
    entries: z.array(educationEntrySchema).max(10, 'Maximum 10 education entries'),
});

export const skillsContentSchema = z.object({
    categories: z.array(skillCategorySchema).min(1, 'At least one skill category is required').max(10, 'Maximum 10 skill categories'),
});

export const projectsContentSchema = z.object({
    entries: z.array(projectEntrySchema).max(15, 'Maximum 15 project entries'),
});

export const certificationsContentSchema = z.object({
    entries: z.array(certificationEntrySchema).max(20, 'Maximum 20 certification entries'),
});

export const languagesContentSchema = z.object({
    entries: z.array(languageEntrySchema).max(10, 'Maximum 10 language entries'),
});

export const customContentSchema = z.object({
    entries: z.array(customEntrySchema).max(15, 'Maximum 15 custom entries'),
});

// Resume Section Schema
export const resumeSectionSchema = z.object({
    id: z.string(),
    type: z.enum(['experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'custom']),
    title: z.string().min(1, 'Section title is required').max(50, 'Section title must be less than 50 characters'),
    content: z.union([
        experienceContentSchema,
        educationContentSchema,
        skillsContentSchema,
        projectsContentSchema,
        certificationsContentSchema,
        languagesContentSchema,
        customContentSchema,
    ]),
    order: z.number().min(0, 'Order must be non-negative'),
    isVisible: z.boolean(),
    isCustom: z.boolean(),
});

// Color Schema
export const colorSchemeSchema = z.object({
    primary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Primary color must be a valid hex color'),
    secondary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Secondary color must be a valid hex color'),
    text: z.string().regex(/^#[0-9A-F]{6}$/i, 'Text color must be a valid hex color'),
    accent: z.string().regex(/^#[0-9A-F]{6}$/i, 'Accent color must be a valid hex color'),
    background: z.string().regex(/^#[0-9A-F]{6}$/i, 'Background color must be a valid hex color'),
});

// Font Configuration Schema
export const fontConfigSchema = z.object({
    headingFont: z.string().min(1, 'Heading font is required'),
    bodyFont: z.string().min(1, 'Body font is required'),
    sizes: z.object({
        h1: z.number().min(12, 'H1 size must be at least 12px').max(72, 'H1 size must be at most 72px'),
        h2: z.number().min(10, 'H2 size must be at least 10px').max(48, 'H2 size must be at most 48px'),
        h3: z.number().min(8, 'H3 size must be at least 8px').max(36, 'H3 size must be at most 36px'),
        body: z.number().min(8, 'Body size must be at least 8px').max(24, 'Body size must be at most 24px'),
        small: z.number().min(6, 'Small size must be at least 6px').max(18, 'Small size must be at most 18px'),
    }),
});

// Custom Styling Schema
export const customStylingSchema = z.object({
    colors: colorSchemeSchema.optional(),
    fonts: fontConfigSchema.optional(),
    spacing: z.object({
        sectionGap: z.number().min(0, 'Section gap must be non-negative').max(100, 'Section gap must be at most 100px'),
        itemGap: z.number().min(0, 'Item gap must be non-negative').max(50, 'Item gap must be at most 50px'),
        lineHeight: z.number().min(1, 'Line height must be at least 1').max(3, 'Line height must be at most 3'),
    }).optional(),
    layout: z.object({
        headerStyle: z.enum(['centered', 'left', 'split']).optional(),
        sectionSpacing: z.number().min(0, 'Section spacing must be non-negative').max(100, 'Section spacing must be at most 100px').optional(),
        margins: z.object({
            top: z.number().min(0, 'Top margin must be non-negative').max(100, 'Top margin must be at most 100px'),
            right: z.number().min(0, 'Right margin must be non-negative').max(100, 'Right margin must be at most 100px'),
            bottom: z.number().min(0, 'Bottom margin must be non-negative').max(100, 'Bottom margin must be at most 100px'),
            left: z.number().min(0, 'Left margin must be non-negative').max(100, 'Left margin must be at most 100px'),
        }).optional(),
    }).optional(),
});

// Resume Metadata Schema
export const resumeMetadataSchema = z.object({
    createdAt: z.date(),
    updatedAt: z.date(),
    version: z.number().min(1, 'Version must be at least 1'),
    lastAutoSave: z.date().optional(),
    wordCount: z.number().min(0, 'Word count must be non-negative').optional(),
    pageCount: z.number().min(1, 'Page count must be at least 1').optional(),
});

// Complete Resume Data Schema
export const resumeDataSchema: z.ZodType<any> = z.object({
    id: z.string().min(1, 'Resume ID is required'),
    templateId: z.string().min(1, 'Template ID is required'),
    personalInfo: personalInfoSchema,
    sections: z.array(resumeSectionSchema).min(1, 'At least one section is required').max(20, 'Maximum 20 sections'),
    styling: customStylingSchema,
    metadata: resumeMetadataSchema,
    versions: z.array(z.object({
        id: z.string(),
        name: z.string().min(1, 'Version name is required').max(100, 'Version name must be less than 100 characters'),
        createdAt: z.date(),
        resumeData: z.lazy(() => resumeDataSchema),
        thumbnail: z.string().optional(),
    })).max(10, 'Maximum 10 versions'),
});

// Export Types
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type ExperienceEntryInput = z.infer<typeof experienceEntrySchema>;
export type EducationEntryInput = z.infer<typeof educationEntrySchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type SkillCategoryInput = z.infer<typeof skillCategorySchema>;
export type ProjectEntryInput = z.infer<typeof projectEntrySchema>;
export type CertificationEntryInput = z.infer<typeof certificationEntrySchema>;
export type LanguageEntryInput = z.infer<typeof languageEntrySchema>;
export type CustomEntryInput = z.infer<typeof customEntrySchema>;
export type ResumeSectionInput = z.infer<typeof resumeSectionSchema>;
export type ResumeDataInput = z.infer<typeof resumeDataSchema>;