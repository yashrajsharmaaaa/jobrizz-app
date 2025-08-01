import type {
  ResumeData,
  ResumeSection,
  SectionType,
  SectionContent,
  ExperienceContent,
  EducationContent,
  SkillsContent,
  ProjectsContent,
  CertificationsContent,
  LanguagesContent,
  CustomContent,
  CustomStyling,
  ColorScheme,
  FontSizes,
  SpacingConfig,
  LayoutOverrides,
  MarginConfig,
} from '../../types/resume';

/**
 * Calculates the word count for resume content
 */
export const calculateWordCount = (resumeData: ResumeData): number => {
  let wordCount = 0;

  // Count words in personal info
  const personalInfo = resumeData.personalInfo;
  wordCount += countWordsInText(personalInfo.firstName);
  wordCount += countWordsInText(personalInfo.lastName);
  wordCount += countWordsInText(personalInfo.location);
  wordCount += countWordsInText(personalInfo.summary || '');

  // Count words in sections
  resumeData.sections.forEach(section => {
    if (section.isVisible) {
      wordCount += countWordsInText(section.title);
      wordCount += countWordsInSectionContent(section.content, section.type);
    }
  });

  return wordCount;
};

/**
 * Counts words in a text string
 */
const countWordsInText = (text: string): number => {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Counts words in section content based on section type
 */
const countWordsInSectionContent = (content: SectionContent, type: SectionType): number => {
  let wordCount = 0;

  switch (type) {
    case 'experience':
      const expContent = content as ExperienceContent;
      expContent.entries.forEach(entry => {
        wordCount += countWordsInText(entry.jobTitle);
        wordCount += countWordsInText(entry.company);
        wordCount += countWordsInText(entry.location);
        entry.description.forEach(desc => wordCount += countWordsInText(desc));
        entry.achievements.forEach(achievement => wordCount += countWordsInText(achievement));
      });
      break;

    case 'education':
      const eduContent = content as EducationContent;
      eduContent.entries.forEach(entry => {
        wordCount += countWordsInText(entry.degree);
        wordCount += countWordsInText(entry.institution);
        wordCount += countWordsInText(entry.location);
        wordCount += countWordsInText(entry.gpa || '');
        entry.honors?.forEach(honor => wordCount += countWordsInText(honor));
        entry.coursework?.forEach(course => wordCount += countWordsInText(course));
      });
      break;

    case 'skills':
      const skillsContent = content as SkillsContent;
      skillsContent.categories.forEach(category => {
        wordCount += countWordsInText(category.name);
        category.skills.forEach(skill => wordCount += countWordsInText(skill.name));
      });
      break;

    case 'projects':
      const projectsContent = content as ProjectsContent;
      projectsContent.entries.forEach(entry => {
        wordCount += countWordsInText(entry.name);
        wordCount += countWordsInText(entry.description);
        entry.technologies.forEach(tech => wordCount += countWordsInText(tech));
        entry.highlights.forEach(highlight => wordCount += countWordsInText(highlight));
      });
      break;

    case 'certifications':
      const certsContent = content as CertificationsContent;
      certsContent.entries.forEach(entry => {
        wordCount += countWordsInText(entry.name);
        wordCount += countWordsInText(entry.issuer);
        wordCount += countWordsInText(entry.credentialId || '');
      });
      break;

    case 'languages':
      const langsContent = content as LanguagesContent;
      langsContent.entries.forEach(entry => {
        wordCount += countWordsInText(entry.language);
        wordCount += countWordsInText(entry.proficiency);
        entry.certifications?.forEach(cert => wordCount += countWordsInText(cert));
      });
      break;

    case 'custom':
      const customContent = content as CustomContent;
      customContent.entries.forEach(entry => {
        wordCount += countWordsInText(entry.title);
        wordCount += countWordsInText(entry.subtitle || '');
        wordCount += countWordsInText(entry.description);
        entry.details.forEach(detail => wordCount += countWordsInText(detail));
      });
      break;
  }

  return wordCount;
};

/**
 * Estimates the page count based on word count and layout
 */
export const estimatePageCount = (wordCount: number, templateType: 'single-column' | 'two-column' = 'single-column'): number => {
  // Rough estimates based on typical resume layouts
  const wordsPerPage = templateType === 'two-column' ? 400 : 300;
  return Math.max(1, Math.ceil(wordCount / wordsPerPage));
};

/**
 * Gets all sections of a specific type from resume data
 */
export const getSectionsByType = (resumeData: ResumeData, sectionType: SectionType): ResumeSection[] => {
  return resumeData.sections.filter(section => section.type === sectionType);
};

/**
 * Gets a section by its ID
 */
export const getSectionById = (resumeData: ResumeData, sectionId: string): ResumeSection | undefined => {
  return resumeData.sections.find(section => section.id === sectionId);
};

/**
 * Gets visible sections sorted by order
 */
export const getVisibleSections = (resumeData: ResumeData): ResumeSection[] => {
  return resumeData.sections
    .filter(section => section.isVisible)
    .sort((a, b) => a.order - b.order);
};

/**
 * Reorders sections based on new order array
 */
export const reorderSections = (sections: ResumeSection[], newOrder: string[]): ResumeSection[] => {
  const sectionMap = new Map(sections.map(section => [section.id, section]));

  return newOrder
    .map((id, index) => {
      const section = sectionMap.get(id);
      if (section) {
        return { ...section, order: index };
      }
      return null;
    })
    .filter((section): section is ResumeSection => section !== null);
};

/**
 * Validates that all required sections are present
 */
export const validateRequiredSections = (resumeData: ResumeData): { isValid: boolean; missingSections: SectionType[] } => {
  const requiredSections: SectionType[] = ['experience', 'education'];
  const presentSections = resumeData.sections.map(section => section.type);
  const missingSections = requiredSections.filter(type => !presentSections.includes(type));

  return {
    isValid: missingSections.length === 0,
    missingSections,
  };
};

/**
 * Checks if resume has sufficient content for export
 */
export const validateResumeCompleteness = (resumeData: ResumeData): {
  isComplete: boolean;
  missingFields: string[];
  warnings: string[];
} => {
  const missingFields: string[] = [];
  const warnings: string[] = [];

  // Check personal info
  const personalInfo = resumeData.personalInfo;
  if (!personalInfo.firstName.trim()) missingFields.push('First Name');
  if (!personalInfo.lastName.trim()) missingFields.push('Last Name');
  if (!personalInfo.email.trim()) missingFields.push('Email');
  if (!personalInfo.phone.trim()) missingFields.push('Phone');
  if (!personalInfo.location.trim()) missingFields.push('Location');

  // Check for at least one experience entry
  const experienceSections = getSectionsByType(resumeData, 'experience');
  const hasExperience = experienceSections.some(section => {
    const content = section.content as ExperienceContent;
    return content.entries.length > 0;
  });
  if (!hasExperience) missingFields.push('Work Experience');

  // Check for at least one education entry
  const educationSections = getSectionsByType(resumeData, 'education');
  const hasEducation = educationSections.some(section => {
    const content = section.content as EducationContent;
    return content.entries.length > 0;
  });
  if (!hasEducation) missingFields.push('Education');

  // Warnings for optional but recommended fields
  if (!personalInfo.summary?.trim()) {
    warnings.push('Consider adding a professional summary');
  }

  const skillsSections = getSectionsByType(resumeData, 'skills');
  const hasSkills = skillsSections.some(section => {
    const content = section.content as SkillsContent;
    return content.categories.some(category => category.skills.length > 0);
  });
  if (!hasSkills) {
    warnings.push('Consider adding a skills section');
  }

  const wordCount = calculateWordCount(resumeData);
  if (wordCount < 100) {
    warnings.push('Resume content seems too brief - consider adding more details');
  } else if (wordCount > 800) {
    warnings.push('Resume content is quite lengthy - consider condensing for better readability');
  }

  return {
    isComplete: missingFields.length === 0,
    missingFields,
    warnings,
  };
};

/**
 * Cleans up empty sections and entries
 */
export const cleanupResumeData = (resumeData: ResumeData): ResumeData => {
  const cleanedSections = resumeData.sections.map(section => {
    const cleanedSection = { ...section };

    switch (section.type) {
      case 'experience':
        const expContent = section.content as ExperienceContent;
        cleanedSection.content = {
          entries: expContent.entries.filter(entry =>
            entry.jobTitle.trim() || entry.company.trim() || entry.description.some(d => d.trim())
          ),
        };
        break;

      case 'education':
        const eduContent = section.content as EducationContent;
        cleanedSection.content = {
          entries: eduContent.entries.filter(entry =>
            entry.degree.trim() || entry.institution.trim()
          ),
        };
        break;

      case 'skills':
        const skillsContent = section.content as SkillsContent;
        cleanedSection.content = {
          categories: skillsContent.categories
            .map(category => ({
              ...category,
              skills: category.skills.filter(skill => skill.name.trim()),
            }))
            .filter(category => category.skills.length > 0),
        };
        break;

      case 'projects':
        const projectsContent = section.content as ProjectsContent;
        cleanedSection.content = {
          entries: projectsContent.entries.filter(entry =>
            entry.name.trim() || entry.description.trim()
          ),
        };
        break;

      case 'certifications':
        const certsContent = section.content as CertificationsContent;
        cleanedSection.content = {
          entries: certsContent.entries.filter(entry =>
            entry.name.trim() || entry.issuer.trim()
          ),
        };
        break;

      case 'languages':
        const langsContent = section.content as LanguagesContent;
        cleanedSection.content = {
          entries: langsContent.entries.filter(entry => entry.language.trim()),
        };
        break;

      case 'custom':
        const customContent = section.content as CustomContent;
        cleanedSection.content = {
          entries: customContent.entries.filter(entry =>
            entry.title.trim() || entry.description.trim()
          ),
        };
        break;
    }

    return cleanedSection;
  });

  return {
    ...resumeData,
    sections: cleanedSections,
    metadata: {
      ...resumeData.metadata,
      updatedAt: new Date(),
      wordCount: calculateWordCount({ ...resumeData, sections: cleanedSections }),
      pageCount: estimatePageCount(calculateWordCount({ ...resumeData, sections: cleanedSections })),
    },
  };
};

/**
 * Creates a deep copy of resume data
 */
export const cloneResumeData = (resumeData: ResumeData): ResumeData => {
  return JSON.parse(JSON.stringify(resumeData));
};

/**
 * Filters out undefined values from an object
 */
const filterUndefined = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const filtered: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      (filtered as any)[key] = value;
    }
  }
  return filtered;
};
 
/**
 * Merges two resume data objects, with the second taking precedence
 */
export const mergeResumeData = (base: ResumeData, updates: Partial<ResumeData>): ResumeData => {
  const mergedStyling: CustomStyling = {
    ...base.styling,
    ...updates.styling,
  };

  // Handle colors with proper type safety
  if (base.styling.colors || updates.styling?.colors) {
    const mergedColors = {
      ...base.styling.colors,
      ...updates.styling?.colors,
    };
    // Only include colors if all required properties are present
    if (mergedColors.primary && mergedColors.secondary && mergedColors.text &&
      mergedColors.accent && mergedColors.background) {
      mergedStyling.colors = mergedColors as ColorScheme;
    }
  }

  // Handle fonts with proper type safety
  if (base.styling.fonts || updates.styling?.fonts) {
    const mergedFonts = {
      ...base.styling.fonts,
      ...updates.styling?.fonts,
    };
    if (mergedFonts.headingFont && mergedFonts.bodyFont && mergedFonts.sizes) {
      const mergedSizes = {
        ...base.styling.fonts?.sizes,
        ...updates.styling?.fonts?.sizes,
      };
      if (mergedSizes.h1 !== undefined && mergedSizes.h2 !== undefined &&
        mergedSizes.h3 !== undefined && mergedSizes.body !== undefined &&
        mergedSizes.small !== undefined) {
        mergedStyling.fonts = {
          headingFont: mergedFonts.headingFont,
          bodyFont: mergedFonts.bodyFont,
          sizes: mergedSizes as FontSizes,
        };
      }
    }
  }

  // Handle spacing
  if (base.styling.spacing || updates.styling?.spacing) {
    const mergedSpacing = {
      ...base.styling.spacing,
      ...updates.styling?.spacing,
    };
    if (mergedSpacing.sectionGap !== undefined && mergedSpacing.itemGap !== undefined &&
      mergedSpacing.lineHeight !== undefined) {
      mergedStyling.spacing = mergedSpacing as SpacingConfig;
    }
  }

  // Handle layout
  if (base.styling.layout || updates.styling?.layout) {
    const mergedLayout = {
      ...base.styling.layout,
      ...updates.styling?.layout,
    };

    if (mergedLayout.margins && (base.styling.layout?.margins || updates.styling?.layout?.margins)) {
      const mergedMargins = {
        ...base.styling.layout?.margins,
        ...updates.styling?.layout?.margins,
      };
      mergedLayout.margins = filterUndefined(mergedMargins) as MarginConfig;
    }

    mergedStyling.layout = filterUndefined(mergedLayout) as LayoutOverrides;
  }

  return {
    ...base,
    ...updates,
    personalInfo: {
      ...base.personalInfo,
      ...updates.personalInfo,
    },
    sections: updates.sections || base.sections,
    styling: mergedStyling,
    metadata: {
      ...base.metadata,
      ...updates.metadata,
      updatedAt: new Date(),
    },
  };
};