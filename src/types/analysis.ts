// Resume Analysis Types
export interface ResumeAnalysis {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  extractedText: string;
  atsScore: ATSScore;
  contentAnalysis: ContentAnalysis;
  recommendations: Recommendation[];
  keywords: ExtractedKeyword[];
  sections: DetectedSection[];
}

export interface ATSScore {
  overall: number; // 0-100
  breakdown: {
    formatting: number;
    keywords: number;
    structure: number;
    readability: number;
    length: number;
  };
  issues: ATSIssue[];
  improvements: string[];
}

export interface ATSIssue {
  type: 'critical' | 'warning' | 'suggestion';
  category: 'formatting' | 'content' | 'structure' | 'keywords';
  message: string;
  impact: number; // Points lost
  fix?: string;
}

export interface ContentAnalysis {
  wordCount: number;
  characterCount: number;
  pageCount: number;
  readabilityScore: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  complexWords: number;
  actionVerbs: string[];
  quantifiableResults: QuantifiableResult[];
}

export interface QuantifiableResult {
  text: string;
  type: 'percentage' | 'number' | 'currency' | 'time';
  value: string;
  context: string;
}

export interface Recommendation {
  id: string;
  type: 'critical' | 'important' | 'suggestion';
  category: 'content' | 'formatting' | 'keywords' | 'structure';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'moderate' | 'difficult';
  examples?: string[];
  before?: string;
  after?: string;
}

export interface ExtractedKeyword {
  word: string;
  frequency: number;
  category: 'skill' | 'technology' | 'industry' | 'role' | 'general';
  importance: number; // 0-1
  context: string[];
}

export interface DetectedSection {
  type: 'contact' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'other';
  title: string;
  content: string;
  startIndex: number;
  endIndex: number;
  confidence: number; // 0-1
  issues: string[];
}

// Job Matching Types
export interface JobMatch {
  id: string;
  jobTitle: string;
  company?: string;
  jobDescription: string;
  matchScore: number; // 0-100
  keywordMatches: KeywordMatch[];
  skillsGap: SkillGap[];
  recommendations: JobMatchRecommendation[];
  createdAt: Date;
}

export interface KeywordMatch {
  keyword: string;
  inResume: boolean;
  inJob: boolean;
  frequency: {
    resume: number;
    job: number;
  };
  importance: number;
  category: string;
}

export interface SkillGap {
  skill: string;
  category: string;
  importance: 'critical' | 'important' | 'nice-to-have';
  suggestions: string[];
  learningResources?: string[];
}

export interface JobMatchRecommendation {
  type: 'add_keyword' | 'emphasize_skill' | 'add_experience' | 'reformat_section';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  examples?: string[];
}

// Upload Types
export interface FileUploadState {
  file: File;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

export interface UploadResult {
  success: boolean;
  analysis?: ResumeAnalysis;
  error?: string;
  processingTime: number;
}

// AI-Powered Features
export interface AIRecommendation {
  id: string;
  type: 'content_enhancement' | 'skills_optimization' | 'impact_measurement' | 'industry_alignment';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  aiGenerated: boolean;
  suggestions: string[];
  impact: string;
  confidence: number; // 0-1
}

export interface AIInsight {
  id: string;
  type: 'personality_analysis' | 'compensation_analysis' | 'interview_preparation' | 'career_analysis';
  title: string;
  description: string;
  score: number; // 0-1 for scored insights, 0 for informational
  details: string[];
  aiGenerated: boolean;
  confidence: number; // 0-1
}

export interface AIContentSuggestion {
  type: 'summary' | 'experience' | 'skills' | 'achievement';
  suggestions: string[];
  context: string;
  confidence: number;
}

export interface AIKeywordOptimization {
  recommended: string[];
  toRemove: string[];
  alternatives: { [key: string]: string[] };
  confidence: number;
}

// Analysis Configuration
export interface AnalysisConfig {
  enableATSScoring: boolean;
  enableContentAnalysis: boolean;
  enableKeywordExtraction: boolean;
  enableSectionDetection: boolean;
  enableAIRecommendations: boolean;
  strictMode: boolean;
  industry?: string;
  targetRole?: string;
}

// Dashboard Types
export interface AnalysisDashboard {
  currentAnalysis?: ResumeAnalysis;
  jobMatches: JobMatch[];
  history: ResumeAnalysis[];
  stats: {
    totalUploads: number;
    averageATSScore: number;
    topIssues: string[];
    improvementTrend: number;
  };
}