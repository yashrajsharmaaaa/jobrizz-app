/**
 * AI Resume Corrector Service
 * Automatically applies AI recommendations to improve resume content
 */

// Types are handled inline to avoid import issues
import { logger } from '../utils/logger';
import { ErrorHandler } from '../utils/errorHandler';

export interface CorrectionResult {
  originalText: string;
  correctedText: string;
  appliedRecommendations: string[];
  improvementScore: number;
  changes: TextChange[];
}

export interface TextChange {
  type: 'replacement' | 'addition' | 'removal' | 'enhancement';
  original: string;
  corrected: string;
  reason: string;
  position: { start: number; end: number };
}

export class AIResumeCorrector {
  /**
   * Apply AI recommendations to automatically correct resume text
   */
  static async correctResume(
    originalText: string,
    recommendations: any[] // Using any[] to match existing Recommendation type
  ): Promise<CorrectionResult> {
    logger.info('Starting AI resume correction', {
      textLength: originalText.length,
      recommendationCount: recommendations.length
    });

    try {
      let correctedText = originalText;
      const appliedRecommendations: string[] = [];
      const changes: TextChange[] = [];
      let improvementScore = 0;

      // Apply recommendations in order of priority
      const sortedRecommendations = recommendations.sort((a, b) => {
        const priorityOrder: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1);
      });

      for (const recommendation of sortedRecommendations) {
        const result = await this.applyRecommendation(correctedText, recommendation);

        if (result.applied) {
          correctedText = result.text;
          appliedRecommendations.push(recommendation.id);
          changes.push(...result.changes);
          improvementScore += this.calculateImprovementScore(recommendation);

          logger.debug('Applied recommendation', {
            id: recommendation.id,
            type: recommendation.type
          });
        }
      }

      const result: CorrectionResult = {
        originalText,
        correctedText,
        appliedRecommendations,
        improvementScore: Math.min(improvementScore, 100),
        changes,
      };

      logger.info('AI resume correction completed', {
        appliedCount: appliedRecommendations.length,
        improvementScore: result.improvementScore,
        changeCount: changes.length
      });

      return result;

    } catch (error) {
      throw ErrorHandler.handleAIError(error, 'correctResume');
    }
  }

  /**
   * Apply a specific recommendation to the text
   */
  private static async applyRecommendation(
    text: string,
    recommendation: any
  ): Promise<{ applied: boolean; text: string; changes: TextChange[] }> {
    const changes: TextChange[] = [];
    let modifiedText = text;
    let applied = false;

    switch (recommendation.type) {
      case 'content_enhancement':
        const contentResult = this.enhanceContent(modifiedText, recommendation);
        modifiedText = contentResult.text;
        changes.push(...contentResult.changes);
        applied = contentResult.changes.length > 0;
        break;

      case 'skills_optimization':
        const skillsResult = this.optimizeSkills(modifiedText, recommendation);
        modifiedText = skillsResult.text;
        changes.push(...skillsResult.changes);
        applied = skillsResult.changes.length > 0;
        break;

      case 'impact_measurement':
        const impactResult = this.addQuantifiableResults(modifiedText, recommendation);
        modifiedText = impactResult.text;
        changes.push(...impactResult.changes);
        applied = impactResult.changes.length > 0;
        break;

      case 'industry_alignment':
        const industryResult = this.alignWithIndustry(modifiedText, recommendation);
        modifiedText = industryResult.text;
        changes.push(...industryResult.changes);
        applied = industryResult.changes.length > 0;
        break;
    }

    return { applied, text: modifiedText, changes };
  }

  /**
   * Enhance content by improving action verbs and language
   */
  private static enhanceContent(
    text: string,
    _recommendation: any
  ): { text: string; changes: TextChange[] } {
    const changes: TextChange[] = [];
    let enhancedText = text;

    // Replace weak action verbs with stronger ones
    const verbReplacements = {
      'worked on': 'developed',
      'helped with': 'collaborated on',
      'was responsible for': 'managed',
      'did': 'executed',
      'made': 'created',
      'used': 'leveraged',
      'handled': 'managed',
      'dealt with': 'resolved',
      'assisted': 'supported',
      'participated in': 'contributed to'
    };

    Object.entries(verbReplacements).forEach(([weak, strong]) => {
      const regex = new RegExp(`\\b${weak}\\b`, 'gi');
      const matches = [...enhancedText.matchAll(regex)];

      matches.forEach(match => {
        if (match.index !== undefined) {
          changes.push({
            type: 'replacement',
            original: match[0],
            corrected: strong,
            reason: 'Replaced weak action verb with stronger alternative',
            position: { start: match.index, end: match.index + match[0].length }
          });
        }
      });

      enhancedText = enhancedText.replace(regex, strong);
    });

    // Improve passive voice to active voice
    const passivePatterns = [
      { pattern: /was ([\w]+ed) by/gi, replacement: '$1' },
      { pattern: /were ([\w]+ed) by/gi, replacement: '$1' },
      { pattern: /has been ([\w]+ed)/gi, replacement: '$1' },
      { pattern: /have been ([\w]+ed)/gi, replacement: '$1' }
    ];

    passivePatterns.forEach(({ pattern, replacement }) => {
      const matches = [...enhancedText.matchAll(pattern)];
      matches.forEach(match => {
        if (match.index !== undefined) {
          changes.push({
            type: 'replacement',
            original: match[0],
            corrected: match[0].replace(pattern, replacement),
            reason: 'Converted passive voice to active voice',
            position: { start: match.index, end: match.index + match[0].length }
          });
        }
      });

      enhancedText = enhancedText.replace(pattern, replacement);
    });

    return { text: enhancedText, changes };
  }

  /**
   * Optimize skills section by adding relevant keywords
   */
  private static optimizeSkills(
    text: string,
    recommendation: any
  ): { text: string; changes: TextChange[] } {
    const changes: TextChange[] = [];
    let optimizedText = text;

    // Find skills section
    const skillsMatch = optimizedText.match(/(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES)[:\s]*\n([\s\S]*?)(?=\n[A-Z]|\n\n|$)/i);

    if (skillsMatch && skillsMatch[2]) {
      const skillsSection = skillsMatch[2];
      const skillsStart = skillsMatch.index! + skillsMatch[1].length;

      // Add trending skills based on recommendation
      const trendingSkills = this.getTrendingSkills(recommendation);
      const existingSkills = skillsSection.toLowerCase();

      const newSkills = trendingSkills.filter(skill =>
        !existingSkills.includes(skill.toLowerCase())
      );

      if (newSkills.length > 0) {
        const skillsToAdd = newSkills.slice(0, 3); // Add max 3 new skills
        const addition = skillsSection.trim().endsWith(',')
          ? ` ${skillsToAdd.join(', ')}`
          : `, ${skillsToAdd.join(', ')}`;

        optimizedText = optimizedText.replace(
          skillsMatch[0],
          skillsMatch[0] + addition
        );

        changes.push({
          type: 'addition',
          original: skillsSection,
          corrected: skillsSection + addition,
          reason: `Added trending skills: ${skillsToAdd.join(', ')}`,
          position: { start: skillsStart, end: skillsStart + skillsSection.length }
        });
      }
    }

    return { text: optimizedText, changes };
  }

  /**
   * Add quantifiable results to experience descriptions
   */
  private static addQuantifiableResults(
    text: string,
    _recommendation: any
  ): { text: string; changes: TextChange[] } {
    const changes: TextChange[] = [];
    let enhancedText = text;

    // Find bullet points that could benefit from quantification
    const bulletRegex = /^[\s]*[•\-\*]\s*([^•\-\*\n]+)/gm;
    const matches = [...enhancedText.matchAll(bulletRegex)];

    matches.forEach(match => {
      const bulletText = match[1].trim();

      // Skip if already has numbers
      if (/\d/.test(bulletText)) return;

      // Add quantification suggestions based on common patterns
      let enhancement = '';

      if (/develop|build|create|implement/i.test(bulletText)) {
        enhancement = this.addDevelopmentMetrics(bulletText);
      } else if (/manage|lead|supervise/i.test(bulletText)) {
        enhancement = this.addLeadershipMetrics(bulletText);
      } else if (/improve|optimize|enhance/i.test(bulletText)) {
        enhancement = this.addImprovementMetrics(bulletText);
      } else if (/reduce|decrease|cut/i.test(bulletText)) {
        enhancement = this.addReductionMetrics(bulletText);
      }

      if (enhancement && enhancement !== bulletText) {
        enhancedText = enhancedText.replace(match[0], match[0].replace(bulletText, enhancement));

        changes.push({
          type: 'enhancement',
          original: bulletText,
          corrected: enhancement,
          reason: 'Added quantifiable metrics to demonstrate impact',
          position: { start: match.index!, end: match.index! + match[0].length }
        });
      }
    });

    return { text: enhancedText, changes };
  }

  /**
   * Align content with industry trends
   */
  private static alignWithIndustry(
    text: string,
    _recommendation: any
  ): { text: string; changes: TextChange[] } {
    const changes: TextChange[] = [];
    let alignedText = text;

    // Add industry-specific keywords where appropriate
    // const industryKeywords = this.getIndustryKeywords();

    // Look for technology mentions and enhance them
    const techPatterns = [
      { old: 'javascript', new: 'JavaScript (ES6+)' },
      { old: 'react', new: 'React.js' },
      { old: 'node', new: 'Node.js' },
      { old: 'aws', new: 'Amazon Web Services (AWS)' },
      { old: 'docker', new: 'Docker containerization' },
      { old: 'git', new: 'Git version control' }
    ];

    techPatterns.forEach(({ old, new: enhanced }) => {
      const regex = new RegExp(`\\b${old}\\b(?!\\s*\\(|\\s*\\.js|\\s*containerization|\\s*version\\s*control)`, 'gi');
      const matches = [...alignedText.matchAll(regex)];

      matches.forEach(match => {
        if (match.index !== undefined) {
          changes.push({
            type: 'enhancement',
            original: match[0],
            corrected: enhanced,
            reason: 'Enhanced technology mention with industry-standard terminology',
            position: { start: match.index, end: match.index + match[0].length }
          });
        }
      });

      alignedText = alignedText.replace(regex, enhanced);
    });

    return { text: alignedText, changes };
  }

  // Helper methods
  private static calculateImprovementScore(recommendation: any): number {
    const scores: { [key: string]: number } = { high: 15, medium: 10, low: 5 };
    return scores[recommendation.priority] || 5;
  }

  private static getTrendingSkills(_recommendation: any): string[] {
    return [
      'Cloud Computing', 'DevOps', 'Agile Methodology', 'CI/CD',
      'Microservices', 'API Development', 'Data Analysis',
      'Machine Learning', 'Cybersecurity', 'Mobile Development'
    ];
  }

  // private static getIndustryKeywords(): string[] {
  //   return [
  //     'scalable', 'performance optimization', 'cross-functional collaboration',
  //     'stakeholder management', 'data-driven decisions', 'user experience',
  //     'business requirements', 'technical leadership', 'innovation'
  //   ];
  // }

  private static addDevelopmentMetrics(text: string): string {
    const metrics = [
      'serving 10,000+ users',
      'processing 1M+ transactions daily',
      'with 99.9% uptime',
      'reducing load time by 40%',
      'supporting 50+ concurrent users'
    ];

    const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
    return `${text} ${randomMetric}`;
  }

  private static addLeadershipMetrics(text: string): string {
    const metrics = [
      'team of 5-8 developers',
      'cross-functional team of 12 members',
      'budget of $500K+',
      'delivering 15+ projects annually',
      'mentoring 3-5 junior developers'
    ];

    const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
    return text.replace(/(manage|lead|supervise)/i, `$1 ${randomMetric} and`);
  }

  private static addImprovementMetrics(text: string): string {
    const metrics = [
      'by 35%',
      'by 50%',
      'by 25%',
      'resulting in $100K+ savings',
      'increasing efficiency by 40%'
    ];

    const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
    return `${text} ${randomMetric}`;
  }

  private static addReductionMetrics(text: string): string {
    const metrics = [
      'by 30%',
      'by 45%',
      'from 2 hours to 30 minutes',
      'saving $50K annually',
      'by 60% through automation'
    ];

    const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
    return `${text} ${randomMetric}`;
  }
}