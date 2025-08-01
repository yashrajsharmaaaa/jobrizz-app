import type {
    JobMatch,
    ResumeAnalysis,
    KeywordMatch,
    SkillGap,
    JobMatchRecommendation
} from '../types/analysis';

export class JobMatchingService {
    /**
     * Analyze how well a resume matches a job posting
     */
    static async analyzeJobMatch(
        resume: ResumeAnalysis,
        jobTitle: string,
        company: string,
        jobDescription: string
    ): Promise<JobMatch> {
        const startTime = Date.now();

        try {
            // Extract keywords from both resume and job description
            const resumeKeywords = this.extractKeywords(resume.extractedText);
            const jobKeywords = this.extractKeywords(jobDescription);

            // Analyze keyword matches
            const keywordMatches = this.analyzeKeywordMatches(resumeKeywords, jobKeywords);

            // Calculate overall match score
            const matchScore = this.calculateMatchScore(keywordMatches, resume, jobDescription);

            // Identify skills gaps
            const skillsGap = this.identifySkillsGap(resumeKeywords, jobKeywords);

            // Generate recommendations
            const recommendations = this.generateJobMatchRecommendations(
                keywordMatches,
                skillsGap,
                resume,
                jobDescription
            );

            const jobMatch: JobMatch = {
                id: `job_match_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
                jobTitle,
                company,
                jobDescription,
                matchScore,
                keywordMatches,
                skillsGap,
                recommendations,
                createdAt: new Date(),
            };

            console.log(`Job match analysis completed in ${Date.now() - startTime}ms`);
            return jobMatch;

        } catch (error) {
            throw new Error(`Job match analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Extract keywords from text with categorization
     */
    private static extractKeywords(text: string): { [category: string]: string[] } {
        const lowerText = text.toLowerCase();

        // Define keyword categories with common terms
        const keywordCategories = {
            technologies: [
                'javascript', 'typescript', 'react', 'angular', 'vue', 'node.js', 'nodejs', 'python',
                'java', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'html', 'css', 'sass',
                'less', 'bootstrap', 'tailwind', 'jquery', 'express', 'fastapi', 'django', 'flask',
                'spring', 'laravel', 'rails', 'asp.net', 'graphql', 'rest', 'api', 'sql', 'nosql',
                'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch'
            ],
            frameworks: [
                'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'gatsby', 'express', 'fastapi',
                'django', 'flask', 'spring', 'laravel', 'rails', 'asp.net', 'electron', 'react native',
                'flutter', 'xamarin', 'ionic'
            ],
            tools: [
                'git', 'github', 'gitlab', 'bitbucket', 'docker', 'kubernetes', 'jenkins', 'circleci',
                'travis', 'webpack', 'vite', 'rollup', 'babel', 'eslint', 'prettier', 'jest', 'cypress',
                'selenium', 'postman', 'insomnia', 'figma', 'sketch', 'adobe', 'jira', 'confluence',
                'slack', 'teams', 'zoom'
            ],
            cloud: [
                'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'vercel', 'netlify', 'digitalocean',
                'linode', 'cloudflare', 's3', 'ec2', 'lambda', 'cloudformation', 'terraform', 'ansible'
            ],
            methodologies: [
                'agile', 'scrum', 'kanban', 'waterfall', 'devops', 'ci/cd', 'tdd', 'bdd', 'pair programming',
                'code review', 'continuous integration', 'continuous deployment', 'microservices', 'mvc',
                'mvp', 'solid', 'dry', 'clean code'
            ],
            soft_skills: [
                'leadership', 'communication', 'teamwork', 'collaboration', 'problem solving', 'analytical',
                'creative', 'innovative', 'adaptable', 'flexible', 'organized', 'detail oriented',
                'time management', 'project management', 'mentoring', 'training', 'presentation'
            ],
            experience_levels: [
                'junior', 'senior', 'lead', 'principal', 'architect', 'manager', 'director', 'vp',
                'entry level', 'mid level', 'experienced', 'expert', '1 year', '2 years', '3 years',
                '4 years', '5 years', '5+ years', '10+ years'
            ]
        };

        const extractedKeywords: { [category: string]: string[] } = {};

        // Extract keywords by category
        Object.entries(keywordCategories).forEach(([category, keywords]) => {
            extractedKeywords[category] = keywords.filter(keyword => {
                const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                return regex.test(lowerText);
            });
        });

        // Extract general keywords (high-frequency meaningful words)
        const words = lowerText.match(/\b[a-z]{3,}\b/g) || [];
        const wordFreq: { [key: string]: number } = {};

        words.forEach(word => {
            if (!this.isStopWord(word)) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });

        // Get top frequent words as general keywords
        extractedKeywords.general = Object.entries(wordFreq)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 20)
            .map(([word]) => word);

        return extractedKeywords;
    }

    /**
     * Check if a word is a stop word
     */
    private static isStopWord(word: string): boolean {
        const stopWords = [
            'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
            'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between',
            'among', 'throughout', 'despite', 'towards', 'upon', 'concerning', 'under', 'within',
            'without', 'throughout', 'against', 'across', 'behind', 'beyond', 'except', 'since',
            'until', 'while', 'where', 'when', 'why', 'how', 'what', 'which', 'who', 'whom',
            'whose', 'that', 'this', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
            'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'mine',
            'yours', 'hers', 'ours', 'theirs', 'myself', 'yourself', 'himself', 'herself', 'itself',
            'ourselves', 'yourselves', 'themselves', 'am', 'is', 'are', 'was', 'were', 'being',
            'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
            'should', 'may', 'might', 'must', 'can', 'shall', 'need', 'dare', 'ought', 'used'
        ];

        return stopWords.includes(word.toLowerCase());
    }

    /**
     * Analyze keyword matches between resume and job description
     */
    private static analyzeKeywordMatches(
        resumeKeywords: { [category: string]: string[] },
        jobKeywords: { [category: string]: string[] }
    ): KeywordMatch[] {
        const matches: KeywordMatch[] = [];
        const allJobKeywords = new Set<string>();
        const allResumeKeywords = new Set<string>();

        // Collect all keywords
        Object.values(jobKeywords).forEach(keywords =>
            keywords.forEach(keyword => allJobKeywords.add(keyword))
        );
        Object.values(resumeKeywords).forEach(keywords =>
            keywords.forEach(keyword => allResumeKeywords.add(keyword))
        );

        // Analyze matches for each category
        Object.keys(jobKeywords).forEach(category => {
            const jobCategoryKeywords = jobKeywords[category] || [];
            const resumeCategoryKeywords = resumeKeywords[category] || [];

            // Find matches in this category
            jobCategoryKeywords.forEach(keyword => {
                const inResume = resumeCategoryKeywords.includes(keyword);
                const importance = this.getKeywordImportance(keyword, category);

                matches.push({
                    keyword,
                    inResume,
                    inJob: true,
                    frequency: {
                        resume: inResume ? 1 : 0,
                        job: 1
                    },
                    importance,
                    category
                });
            });

            // Find resume keywords not in job (less important but still relevant)
            resumeCategoryKeywords.forEach(keyword => {
                if (!jobCategoryKeywords.includes(keyword)) {
                    matches.push({
                        keyword,
                        inResume: true,
                        inJob: false,
                        frequency: {
                            resume: 1,
                            job: 0
                        },
                        importance: 0.3,
                        category
                    });
                }
            });
        });

        // Sort by importance and remove duplicates
        const uniqueMatches = matches.filter((match, index, self) =>
            index === self.findIndex(m => m.keyword === match.keyword)
        );

        return uniqueMatches.sort((a, b) => b.importance - a.importance);
    }

    /**
     * Get importance score for a keyword based on category
     */
    private static getKeywordImportance(_keyword: string, category: string): number {
        const categoryWeights = {
            technologies: 0.9,
            frameworks: 0.85,
            tools: 0.7,
            cloud: 0.8,
            methodologies: 0.6,
            soft_skills: 0.5,
            experience_levels: 0.75,
            general: 0.3
        };

        return categoryWeights[category as keyof typeof categoryWeights] || 0.3;
    }

    /**
     * Calculate overall match score
     */
    private static calculateMatchScore(
        keywordMatches: KeywordMatch[],
        resume: ResumeAnalysis,
        jobDescription: string
    ): number {
        const jobKeywords = keywordMatches.filter(match => match.inJob);
        const matchedKeywords = keywordMatches.filter(match => match.inJob && match.inResume);

        if (jobKeywords.length === 0) return 0;

        // Calculate weighted match score
        const totalJobWeight = jobKeywords.reduce((sum, match) => sum + match.importance, 0);
        const matchedWeight = matchedKeywords.reduce((sum, match) => sum + match.importance, 0);

        const keywordScore = (matchedWeight / totalJobWeight) * 100;

        // Factor in resume quality (ATS score)
        const resumeQualityBonus = (resume.atsScore.overall - 50) * 0.2; // -10 to +10 bonus

        // Factor in content length match
        const jobWordCount = jobDescription.split(/\s+/).length;
        const resumeWordCount = resume.contentAnalysis.wordCount;
        const lengthRatio = Math.min(resumeWordCount / Math.max(jobWordCount * 0.3, 200), 1);
        const lengthBonus = lengthRatio * 5; // 0 to 5 bonus

        const finalScore = Math.max(0, Math.min(100, keywordScore + resumeQualityBonus + lengthBonus));

        return Math.round(finalScore);
    }

    /**
     * Identify skills gaps
     */
    private static identifySkillsGap(
        resumeKeywords: { [category: string]: string[] },
        jobKeywords: { [category: string]: string[] }
    ): SkillGap[] {
        const skillsGap: SkillGap[] = [];

        // Focus on important categories for skills gap analysis
        const importantCategories = ['technologies', 'frameworks', 'tools', 'cloud', 'methodologies'];

        importantCategories.forEach(category => {
            const jobSkills = jobKeywords[category] || [];
            const resumeSkills = resumeKeywords[category] || [];

            jobSkills.forEach(skill => {
                if (!resumeSkills.includes(skill)) {
                    const importance = this.getSkillImportance(skill, category);

                    skillsGap.push({
                        skill,
                        category,
                        importance,
                        suggestions: this.getSkillSuggestions(skill, category),
                        learningResources: this.getLearningResources(skill)
                    });
                }
            });
        });

        // Sort by importance
        return skillsGap.sort((a, b) => {
            const importanceOrder = { critical: 3, important: 2, 'nice-to-have': 1 };
            return importanceOrder[b.importance] - importanceOrder[a.importance];
        });
    }

    /**
     * Get skill importance level
     */
    private static getSkillImportance(skill: string, category: string): 'critical' | 'important' | 'nice-to-have' {
        const criticalSkills = [
            'javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'sql', 'git', 'html', 'css'
        ];

        const importantSkills = [
            'angular', 'vue', 'express', 'mongodb', 'postgresql', 'docker', 'aws', 'azure', 'agile', 'scrum'
        ];

        if (criticalSkills.includes(skill.toLowerCase())) {
            return 'critical';
        } else if (importantSkills.includes(skill.toLowerCase()) || category === 'technologies') {
            return 'important';
        } else {
            return 'nice-to-have';
        }
    }

    /**
     * Get suggestions for acquiring a skill
     */
    private static getSkillSuggestions(skill: string, _category: string): string[] {
        const suggestions: { [key: string]: string[] } = {
            'react': [
                'Add React projects to your portfolio',
                'Mention React components you\'ve built',
                'Include React hooks experience'
            ],
            'typescript': [
                'Convert existing JavaScript projects to TypeScript',
                'Mention type safety improvements you\'ve implemented',
                'Add TypeScript to your skills section'
            ],
            'docker': [
                'Containerize your existing applications',
                'Mention Docker in deployment experience',
                'Add container orchestration experience'
            ],
            'aws': [
                'Get AWS certification',
                'Deploy projects using AWS services',
                'Mention cloud architecture experience'
            ],
            'agile': [
                'Describe your experience with sprint planning',
                'Mention collaboration with cross-functional teams',
                'Add Scrum or Kanban methodology experience'
            ]
        };

        return suggestions[skill.toLowerCase()] || [
            `Add ${skill} to your skills section`,
            `Include projects that demonstrate ${skill} usage`,
            `Mention ${skill} in your experience descriptions`
        ];
    }

    /**
     * Get learning resources for a skill
     */
    private static getLearningResources(skill: string): string[] {
        const resources: { [key: string]: string[] } = {
            'react': [
                'React Official Documentation',
                'freeCodeCamp React Course',
                'React Developer Roadmap'
            ],
            'typescript': [
                'TypeScript Handbook',
                'TypeScript Deep Dive',
                'Execute Program TypeScript Course'
            ],
            'docker': [
                'Docker Official Tutorial',
                'Docker for Beginners Course',
                'Play with Docker'
            ],
            'aws': [
                'AWS Free Tier',
                'AWS Cloud Practitioner Certification',
                'A Cloud Guru AWS Courses'
            ]
        };

        return resources[skill.toLowerCase()] || [
            `${skill} Official Documentation`,
            `${skill} Tutorial on YouTube`,
            `${skill} Course on Coursera/Udemy`
        ];
    }

    /**
     * Generate job match recommendations
     */
    private static generateJobMatchRecommendations(
        keywordMatches: KeywordMatch[],
        skillsGap: SkillGap[],
        resume: ResumeAnalysis,
        _jobDescription: string
    ): JobMatchRecommendation[] {
        const recommendations: JobMatchRecommendation[] = [];

        // Missing critical keywords
        const missingCriticalKeywords = keywordMatches.filter(
            match => match.inJob && !match.inResume && match.importance > 0.8
        );

        if (missingCriticalKeywords.length > 0) {
            recommendations.push({
                type: 'add_keyword',
                priority: 'high',
                title: 'Add Missing Key Technologies',
                description: `Your resume is missing ${missingCriticalKeywords.length} important keywords from the job posting.`,
                impact: `Could increase match score by ${Math.min(missingCriticalKeywords.length * 5, 25)} points`,
                examples: missingCriticalKeywords.slice(0, 3).map(match =>
                    `Add "${match.keyword}" to your skills or experience sections`
                )
            });
        }

        // Skills gap recommendations
        const criticalSkillsGap = skillsGap.filter(gap => gap.importance === 'critical');
        if (criticalSkillsGap.length > 0) {
            recommendations.push({
                type: 'add_experience',
                priority: 'high',
                title: 'Address Critical Skills Gap',
                description: `You're missing ${criticalSkillsGap.length} critical skills mentioned in the job requirements.`,
                impact: 'Essential for meeting minimum job requirements',
                examples: criticalSkillsGap.slice(0, 3).map(gap =>
                    `Learn ${gap.skill} - ${gap.suggestions[0]}`
                )
            });
        }

        // Quantifiable results
        if (resume.contentAnalysis.quantifiableResults.length < 3) {
            recommendations.push({
                type: 'emphasize_skill',
                priority: 'medium',
                title: 'Add More Quantifiable Results',
                description: 'Include specific numbers and metrics to demonstrate your impact.',
                impact: 'Makes your achievements more compelling and measurable',
                examples: [
                    'Led a team of X developers',
                    'Improved performance by X%',
                    'Reduced costs by $X or X%'
                ]
            });
        }

        // Action verbs
        if (resume.contentAnalysis.actionVerbs.length < 5) {
            recommendations.push({
                type: 'reformat_section',
                priority: 'medium',
                title: 'Use Stronger Action Verbs',
                description: 'Start bullet points with powerful action verbs to make your experience more impactful.',
                impact: 'Improves readability and demonstrates proactive approach',
                examples: [
                    'Replace "Worked on" with "Developed" or "Built"',
                    'Replace "Helped with" with "Collaborated on" or "Contributed to"',
                    'Replace "Was responsible for" with "Led" or "Managed"'
                ]
            });
        }

        return recommendations.slice(0, 5); // Limit to top 5 recommendations
    }
}