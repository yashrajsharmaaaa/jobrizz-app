import { v4 as uuidv4 } from 'uuid';
import type {
  ResumeData,
  PersonalInfo,
  ResumeSection,
  SectionType,
  ExperienceContent,
  EducationContent,
  SkillsContent,
  ProjectsContent,
  CertificationsContent,
  LanguagesContent,
  CustomContent,
  ResumeMetadata,
  CustomStyling,
} from '../../types/resume';

/**
 * Creates default personal information
 */
export const createDefaultPersonalInfo = (): PersonalInfo => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  github: '',
  summary: '',
});

/**
 * Creates default experience content
 */
export const createDefaultExperienceContent = (): ExperienceContent => ({
  entries: [],
});

/**
 * Creates default education content
 */
export const createDefaultEducationContent = (): EducationContent => ({
  entries: [],
});

/**
 * Creates default skills content
 */
export const createDefaultSkillsContent = (): SkillsContent => ({
  categories: [
    {
      id: uuidv4(),
      name: 'Technical Skills',
      skills: [],
    },
  ],
});

/**
 * Creates default projects content
 */
export const createDefaultProjectsContent = (): ProjectsContent => ({
  entries: [],
});

/**
 * Creates default certifications content
 */
export const createDefaultCertificationsContent = (): CertificationsContent => ({
  entries: [],
});

/**
 * Creates default languages content
 */
export const createDefaultLanguagesContent = (): LanguagesContent => ({
  entries: [],
});

/**
 * Creates default custom content
 */
export const createDefaultCustomContent = (): CustomContent => ({
  entries: [],
});

/**
 * Creates default content for a section type
 */
export const createDefaultSectionContent = (sectionType: SectionType) => {
  switch (sectionType) {
    case 'experience':
      return createDefaultExperienceContent();
    case 'education':
      return createDefaultEducationContent();
    case 'skills':
      return createDefaultSkillsContent();
    case 'projects':
      return createDefaultProjectsContent();
    case 'certifications':
      return createDefaultCertificationsContent();
    case 'languages':
      return createDefaultLanguagesContent();
    case 'custom':
      return createDefaultCustomContent();
    default:
      return createDefaultCustomContent();
  }
};

/**
 * Creates a default resume section
 */
export const createDefaultResumeSection = (
  type: SectionType,
  order: number,
  customTitle?: string
): ResumeSection => {
  const defaultTitles: Record<SectionType, string> = {
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certifications: 'Certifications',
    languages: 'Languages',
    custom: 'Additional Information',
  };

  return {
    id: uuidv4(),
    type,
    title: customTitle || defaultTitles[type],
    content: createDefaultSectionContent(type),
    order,
    isVisible: true,
    isCustom: type === 'custom',
  };
};

/**
 * Creates default resume sections
 */
export const createDefaultResumeSections = (): ResumeSection[] => [
  createDefaultResumeSection('experience', 0),
  createDefaultResumeSection('education', 1),
  createDefaultResumeSection('skills', 2),
];

/**
 * Creates default resume metadata
 */
export const createDefaultResumeMetadata = (): ResumeMetadata => ({
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1,
  wordCount: 0,
  pageCount: 1,
});

/**
 * Creates default custom styling
 */
export const createDefaultCustomStyling = (): CustomStyling => ({
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    text: '#1e293b',
    accent: '#3b82f6',
    background: '#ffffff',
  },
  fonts: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    sizes: {
      h1: 24,
      h2: 20,
      h3: 16,
      body: 12,
      small: 10,
    },
  },
  spacing: {
    sectionGap: 20,
    itemGap: 12,
    lineHeight: 1.5,
  },
  layout: {
    headerStyle: 'centered',
    sectionSpacing: 16,
    margins: {
      top: 40,
      right: 40,
      bottom: 40,
      left: 40,
    },
  },
});

/**
 * Creates a new resume with default values
 */
export const createDefaultResumeData = (templateId: string = 'default'): ResumeData => ({
  id: uuidv4(),
  templateId,
  personalInfo: createDefaultPersonalInfo(),
  sections: createDefaultResumeSections(),
  styling: createDefaultCustomStyling(),
  metadata: createDefaultResumeMetadata(),
  versions: [],
});

/**
 * Creates a sample resume with placeholder data for demonstration
 */
export const createSampleResumeData = (templateId: string = 'default'): ResumeData => {
  const resume = createDefaultResumeData(templateId);
  
  // Add sample personal info
  resume.personalInfo = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    website: 'https://johndoe.dev',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    summary: 'Experienced software developer with a passion for creating innovative solutions and leading high-performing teams.',
  };

  // Add sample experience
  const experienceSection = resume.sections.find(s => s.type === 'experience');
  if (experienceSection) {
    (experienceSection.content as ExperienceContent).entries = [
      {
        id: uuidv4(),
        jobTitle: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'New York, NY',
        startDate: '2022-01',
        endDate: '',
        isCurrent: true,
        description: [
          'Led development of microservices architecture serving 1M+ users',
          'Mentored junior developers and conducted code reviews',
          'Implemented CI/CD pipelines reducing deployment time by 60%',
        ],
        achievements: [
          'Increased system performance by 40% through optimization',
          'Reduced bug reports by 50% through improved testing practices',
        ],
      },
      {
        id: uuidv4(),
        jobTitle: 'Software Engineer',
        company: 'StartupXYZ',
        location: 'San Francisco, CA',
        startDate: '2020-06',
        endDate: '2021-12',
        isCurrent: false,
        description: [
          'Developed full-stack web applications using React and Node.js',
          'Collaborated with design team to implement responsive UI components',
          'Participated in agile development processes and sprint planning',
        ],
        achievements: [
          'Delivered 15+ features ahead of schedule',
          'Improved user engagement by 25% through UX improvements',
        ],
      },
    ];
  }

  // Add sample education
  const educationSection = resume.sections.find(s => s.type === 'education');
  if (educationSection) {
    (educationSection.content as EducationContent).entries = [
      {
        id: uuidv4(),
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Technology',
        location: 'Boston, MA',
        startDate: '2016-09',
        endDate: '2020-05',
        isCurrent: false,
        gpa: '3.8',
        honors: ['Magna Cum Laude', 'Dean\'s List'],
        coursework: ['Data Structures', 'Algorithms', 'Software Engineering', 'Database Systems'],
      },
    ];
  }

  // Add sample skills
  const skillsSection = resume.sections.find(s => s.type === 'skills');
  if (skillsSection) {
    (skillsSection.content as SkillsContent).categories = [
      {
        id: uuidv4(),
        name: 'Programming Languages',
        skills: [
          { id: uuidv4(), name: 'JavaScript', level: 'expert', yearsOfExperience: 5 },
          { id: uuidv4(), name: 'TypeScript', level: 'advanced', yearsOfExperience: 3 },
          { id: uuidv4(), name: 'Python', level: 'intermediate', yearsOfExperience: 2 },
          { id: uuidv4(), name: 'Java', level: 'intermediate', yearsOfExperience: 2 },
        ],
      },
      {
        id: uuidv4(),
        name: 'Frameworks & Libraries',
        skills: [
          { id: uuidv4(), name: 'React', level: 'expert', yearsOfExperience: 4 },
          { id: uuidv4(), name: 'Node.js', level: 'advanced', yearsOfExperience: 3 },
          { id: uuidv4(), name: 'Express.js', level: 'advanced', yearsOfExperience: 3 },
          { id: uuidv4(), name: 'Next.js', level: 'intermediate', yearsOfExperience: 2 },
        ],
      },
      {
        id: uuidv4(),
        name: 'Tools & Technologies',
        skills: [
          { id: uuidv4(), name: 'Git', level: 'expert', yearsOfExperience: 5 },
          { id: uuidv4(), name: 'Docker', level: 'advanced', yearsOfExperience: 3 },
          { id: uuidv4(), name: 'AWS', level: 'intermediate', yearsOfExperience: 2 },
          { id: uuidv4(), name: 'PostgreSQL', level: 'intermediate', yearsOfExperience: 3 },
        ],
      },
    ];
  }

  return resume;
};

/**
 * Gets the default section order for resume sections
 */
export const getDefaultSectionOrder = (): Record<SectionType, number> => ({
  experience: 0,
  education: 1,
  skills: 2,
  projects: 3,
  certifications: 4,
  languages: 5,
  custom: 6,
});

/**
 * Gets the display name for a section type
 */
export const getSectionDisplayName = (sectionType: SectionType): string => {
  const displayNames: Record<SectionType, string> = {
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certifications: 'Certifications',
    languages: 'Languages',
    custom: 'Additional Information',
  };

  return displayNames[sectionType];
};

/**
 * Gets the icon name for a section type (for UI components)
 */
export const getSectionIcon = (sectionType: SectionType): string => {
  const icons: Record<SectionType, string> = {
    experience: 'briefcase',
    education: 'academic-cap',
    skills: 'cog',
    projects: 'folder',
    certifications: 'badge-check',
    languages: 'globe',
    custom: 'plus',
  };

  return icons[sectionType];
};