import mammoth from 'mammoth';
import { getPDFDocument, initializePDFWorker } from '../utils/pdfWorker';
import { logPDFDebugInfo, testPDFWorkerAccess } from '../utils/pdfDebug';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { ResumeAnalysis, ATSScore, ContentAnalysis, Recommendation, ExtractedKeyword, DetectedSection } from '../types/analysis';

export class ResumeParser {
    /**
     * Parse resume file and extract text content
     * For now, we'll use a simplified approach that works with plain text
     */
    static async parseFile(file: File): Promise<string> {
        const fileType = file.type;

        if (fileType === 'application/pdf') {
            return this.parsePDF(file);
        } else if (fileType === 'application/msword' ||
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return this.parseWord(file);
        } else if (fileType === 'text/plain') {
            return this.parseText(file);
        } else {
            throw new Error('Unsupported file type. Please upload a PDF, Word document, or text file.');
        }
    }

    /**
     * Parse PDF file with robust worker configuration
     */
    private static async parsePDF(file: File): Promise<string> {
        try {
            // Log debug information
            logPDFDebugInfo();

            // Test worker accessibility
            const workerTest = await testPDFWorkerAccess();
            if (!workerTest.success) {
                console.warn('PDF worker accessibility test failed:', workerTest.error);
            }

            // Initialize PDF worker
            initializePDFWorker();

            const arrayBuffer = await file.arrayBuffer();

            // Validate file size and content
            if (arrayBuffer.byteLength === 0) {
                throw new Error('The uploaded file is empty or corrupted.');
            }

            if (arrayBuffer.byteLength > 50 * 1024 * 1024) { // 50MB limit
                throw new Error('PDF file is too large. Please upload a file smaller than 50MB.');
            }

            // Get PDF document using our robust worker configuration
            const pdf: PDFDocumentProxy = await getPDFDocument(arrayBuffer);

            if (!pdf || pdf.numPages === 0) {
                throw new Error('The PDF file appears to be empty or corrupted.');
            }

            let fullText = '';
            let successfulPages = 0;

            // Extract text from all pages
            for (let i = 1; i <= pdf.numPages; i++) {
                try {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();

                    // Process text items with better spacing
                    const pageText = textContent.items
                        .map((item: any) => {
                            if (item.str && typeof item.str === 'string') {
                                return item.str.trim();
                            }
                            return '';
                        })
                        .filter((text: string) => text.length > 0)
                        .join(' ');

                    if (pageText.trim()) {
                        fullText += pageText + '\n\n';
                        successfulPages++;
                    }
                } catch (pageError) {
                    console.warn(`Failed to extract text from page ${i}:`, pageError);
                    // Continue with other pages
                }
            }

            // Check if we successfully extracted text from at least some pages
            if (successfulPages === 0) {
                throw new Error('No text content found in PDF. The PDF might be image-based, scanned, or password-protected.');
            }

            // Clean up the extracted text
            const cleanedText = fullText
                .replace(/\s+/g, ' ') // Normalize whitespace
                .replace(/\n\s*\n/g, '\n') // Remove empty lines
                .trim();

            if (!cleanedText || cleanedText.length < 10) {
                throw new Error('Insufficient text content found in PDF. Please ensure the PDF contains readable text.');
            }

            console.log(`Successfully extracted text from ${successfulPages}/${pdf.numPages} pages`);
            return cleanedText;

        } catch (error) {
            console.error('PDF parsing error:', error);

            // Provide more specific error messages
            if (error instanceof Error) {
                // Re-throw our custom error messages
                if (error.message.includes('empty or corrupted') ||
                    error.message.includes('too large') ||
                    error.message.includes('image-based') ||
                    error.message.includes('Insufficient text')) {
                    throw error;
                }

                // Handle PDF.js specific errors
                if (error.message.includes('Invalid PDF structure') ||
                    error.message.includes('PDF header')) {
                    throw new Error('The uploaded file is not a valid PDF or is corrupted.');
                }

                if (error.message.includes('worker') ||
                    error.message.includes('fetch') ||
                    error.message.includes('network') ||
                    error.message.includes('timeout')) {
                    throw new Error('PDF processing failed. This might be due to network issues or browser restrictions. Please try uploading a text file or Word document instead.');
                }

                if (error.message.includes('password') ||
                    error.message.includes('encrypted')) {
                    throw new Error('This PDF is password-protected. Please upload an unprotected version.');
                }

                // Generic PDF error
                throw new Error(`Failed to parse PDF: ${error.message}`);
            }

            throw new Error('Failed to parse PDF: An unexpected error occurred. Please try a different file format.');
        }
    }

    /**
     * Parse Word document (simplified - returns placeholder for now)
     */
    private static async parseWord(file: File): Promise<string> {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            return result.value.trim();
        } catch (error) {
            throw new Error(`Failed to parse Word document: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Parse plain text file
     */
    private static async parseText(file: File): Promise<string> {
        try {
            const text = await file.text();
            return text.trim();
        } catch (error) {
            throw new Error(`Failed to parse text file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Analyze resume content and generate comprehensive analysis
     */
    static async analyzeResume(file: File, extractedText: string): Promise<ResumeAnalysis> {
        const startTime = Date.now();

        try {
            // Run all analysis in parallel for better performance
            const [
                atsScore,
                contentAnalysis,
                keywords,
                sections,
                recommendations
            ] = await Promise.all([
                this.calculateATSScore(extractedText),
                this.analyzeContent(extractedText),
                this.extractKeywords(extractedText),
                this.detectSections(extractedText),
                this.generateRecommendations(extractedText)
            ]);

            const analysis: ResumeAnalysis = {
                id: `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
                fileName: file.name,
                fileSize: file.size,
                uploadedAt: new Date(),
                extractedText,
                atsScore,
                contentAnalysis,
                recommendations,
                keywords,
                sections,
            };

            console.log(`Resume analysis completed in ${Date.now() - startTime}ms`);
            return analysis;

        } catch (error) {
            throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Calculate ATS compatibility score
     */
    private static async calculateATSScore(text: string): Promise<ATSScore> {
        const issues: any[] = [];
        let formattingScore = 100;
        let keywordsScore = 100;
        let structureScore = 100;
        let readabilityScore = 100;
        let lengthScore = 100;

        // Length analysis
        const wordCount = text.split(/\s+/).length;
        if (wordCount < 200) {
            lengthScore -= 30;
            issues.push({
                type: 'critical',
                category: 'content',
                message: 'Resume is too short (less than 200 words)',
                impact: 30,
                fix: 'Add more details about your experience and achievements'
            });
        } else if (wordCount > 800) {
            lengthScore -= 15;
            issues.push({
                type: 'warning',
                category: 'content',
                message: 'Resume might be too long (over 800 words)',
                impact: 15,
                fix: 'Consider condensing content to 1-2 pages'
            });
        }

        // Structure analysis
        const hasContactInfo = /\b[\w._%+-]+@[\w.-]+\.[A-Z|a-z]{2,}\b/.test(text);
        const hasPhoneNumber = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text);

        if (!hasContactInfo) {
            structureScore -= 25;
            issues.push({
                type: 'critical',
                category: 'structure',
                message: 'No email address found',
                impact: 25,
                fix: 'Add a professional email address'
            });
        }

        if (!hasPhoneNumber) {
            structureScore -= 15;
            issues.push({
                type: 'warning',
                category: 'structure',
                message: 'No phone number found',
                impact: 15,
                fix: 'Add a phone number for contact'
            });
        }

        // Keywords analysis
        const actionVerbs = [
            'achieved', 'built', 'created', 'developed', 'established', 'implemented',
            'improved', 'increased', 'led', 'managed', 'optimized', 'reduced'
        ];

        const foundActionVerbs = actionVerbs.filter(verb =>
            new RegExp(`\\b${verb}`, 'i').test(text)
        );

        if (foundActionVerbs.length < 3) {
            keywordsScore -= 20;
            issues.push({
                type: 'suggestion',
                category: 'keywords',
                message: 'Limited use of strong action verbs',
                impact: 20,
                fix: 'Use more action verbs like "achieved", "developed", "led"'
            });
        }

        // Readability analysis
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgWordsPerSentence = wordCount / sentences.length;

        if (avgWordsPerSentence > 25) {
            readabilityScore -= 15;
            issues.push({
                type: 'suggestion',
                category: 'formatting',
                message: 'Sentences are too long on average',
                impact: 15,
                fix: 'Break down long sentences for better readability'
            });
        }

        const overall = Math.round(
            (formattingScore + keywordsScore + structureScore + readabilityScore + lengthScore) / 5
        );

        return {
            overall,
            breakdown: {
                formatting: formattingScore,
                keywords: keywordsScore,
                structure: structureScore,
                readability: readabilityScore,
                length: lengthScore,
            },
            issues,
            improvements: [
                'Use more quantifiable achievements (numbers, percentages)',
                'Include relevant industry keywords',
                'Ensure consistent formatting throughout',
                'Add a professional summary section'
            ]
        };
    }

    /**
     * Analyze content metrics
     */
    private static async analyzeContent(text: string): Promise<ContentAnalysis> {
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

        // Estimate page count (roughly 250 words per page)
        const pageCount = Math.max(1, Math.ceil(words.length / 250));

        // Find action verbs
        const actionVerbs = [
            'achieved', 'built', 'created', 'developed', 'established', 'implemented',
            'improved', 'increased', 'led', 'managed', 'optimized', 'reduced',
            'designed', 'launched', 'delivered', 'executed', 'coordinated', 'analyzed'
        ];

        const foundActionVerbs = actionVerbs.filter(verb =>
            new RegExp(`\\b${verb}`, 'i').test(text)
        );

        // Find quantifiable results
        const quantifiableResults = this.extractQuantifiableResults(text);

        // Calculate readability score (simplified Flesch Reading Ease)
        const avgWordsPerSentence = words.length / sentences.length;
        const avgSyllablesPerWord = 1.5; // Simplified estimate
        const readabilityScore = Math.max(0, Math.min(100,
            206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
        ));

        return {
            wordCount: words.length,
            characterCount: text.length,
            pageCount,
            readabilityScore: Math.round(readabilityScore),
            sentenceCount: sentences.length,
            averageWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
            complexWords: words.filter(word => word.length > 6).length,
            actionVerbs: foundActionVerbs,
            quantifiableResults,
        };
    }

    /**
     * Extract quantifiable results from text
     */
    private static extractQuantifiableResults(text: string): any[] {
        const results: any[] = [];

        // Percentage patterns
        const percentageRegex = /(\d+(?:\.\d+)?)\s*%/g;
        let match;
        while ((match = percentageRegex.exec(text)) !== null) {
            results.push({
                text: match[0],
                type: 'percentage',
                value: match[1],
                context: this.getContext(text, match.index, 50)
            });
        }

        // Currency patterns
        const currencyRegex = /\$[\d,]+(?:\.\d{2})?/g;
        while ((match = currencyRegex.exec(text)) !== null) {
            results.push({
                text: match[0],
                type: 'currency',
                value: match[0],
                context: this.getContext(text, match.index, 50)
            });
        }

        // Number patterns
        const numberRegex = /\b(\d{1,3}(?:,\d{3})*|\d+)\s*(million|thousand|k|m|billion)?\b/gi;
        while ((match = numberRegex.exec(text)) !== null) {
            if (!match[0].includes('%') && !match[0].includes('$')) {
                results.push({
                    text: match[0],
                    type: 'number',
                    value: match[0],
                    context: this.getContext(text, match.index, 50)
                });
            }
        }

        return results.slice(0, 10); // Limit to top 10 results
    }

    /**
     * Get context around a match
     */
    private static getContext(text: string, index: number, length: number): string {
        const start = Math.max(0, index - length);
        const end = Math.min(text.length, index + length);
        return text.substring(start, end).trim();
    }

    /**
     * Extract keywords from resume text
     */
    private static async extractKeywords(text: string): Promise<ExtractedKeyword[]> {
        const words = text.toLowerCase().split(/\s+/);
        const wordFreq: { [key: string]: number } = {};

        // Count word frequency
        words.forEach(word => {
            const cleanWord = word.replace(/[^\w]/g, '');
            if (cleanWord.length > 2) {
                wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
            }
        });

        // Common skill keywords
        const skillKeywords = [
            'javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker',
            'kubernetes', 'git', 'agile', 'scrum', 'leadership', 'management',
            'analysis', 'design', 'development', 'testing', 'deployment'
        ];

        const keywords: ExtractedKeyword[] = [];

        Object.entries(wordFreq)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 20)
            .forEach(([word, frequency]) => {
                const isSkill = skillKeywords.includes(word);
                keywords.push({
                    word,
                    frequency,
                    category: isSkill ? 'skill' : 'general',
                    importance: isSkill ? 0.8 : Math.min(0.6, frequency / 10),
                    context: [this.getContext(text, text.indexOf(word), 30)]
                });
            });

        return keywords;
    }

    /**
     * Detect resume sections
     */
    private static async detectSections(text: string): Promise<DetectedSection[]> {
        const sections: DetectedSection[] = [];

        const sectionPatterns = [
            { type: 'contact', patterns: [/contact/i, /email/i, /phone/i] },
            { type: 'summary', patterns: [/summary/i, /profile/i, /objective/i] },
            { type: 'experience', patterns: [/experience/i, /employment/i, /work/i] },
            { type: 'education', patterns: [/education/i, /degree/i, /university/i] },
            { type: 'skills', patterns: [/skills/i, /competencies/i, /technologies/i] },
            { type: 'projects', patterns: [/projects/i, /portfolio/i] },
            { type: 'certifications', patterns: [/certifications/i, /certificates/i] },
        ];

        sectionPatterns.forEach(({ type, patterns }) => {
            patterns.forEach(pattern => {
                const match = text.match(pattern);
                if (match) {
                    sections.push({
                        type: type as any,
                        title: match[0],
                        content: this.getContext(text, match.index || 0, 200),
                        startIndex: match.index || 0,
                        endIndex: (match.index || 0) + match[0].length,
                        confidence: 0.8,
                        issues: []
                    });
                }
            });
        });

        return sections;
    }

    /**
     * Generate recommendations based on analysis
     */
    private static async generateRecommendations(text: string): Promise<Recommendation[]> {
        const recommendations: Recommendation[] = [];

        // Check for quantifiable results
        const hasNumbers = /\d+/.test(text);
        if (!hasNumbers) {
            recommendations.push({
                id: 'add-quantifiable-results',
                type: 'important',
                category: 'content',
                title: 'Add Quantifiable Results',
                description: 'Include specific numbers, percentages, or metrics to demonstrate your impact.',
                impact: 'high',
                effort: 'moderate',
                examples: [
                    'Increased sales by 25%',
                    'Managed a team of 10 developers',
                    'Reduced processing time by 2 hours'
                ]
            });
        }

        // Check for action verbs
        const actionVerbs = ['achieved', 'built', 'created', 'developed', 'led', 'managed'];
        const hasActionVerbs = actionVerbs.some(verb =>
            new RegExp(`\\b${verb}`, 'i').test(text)
        );

        if (!hasActionVerbs) {
            recommendations.push({
                id: 'use-action-verbs',
                type: 'important',
                category: 'content',
                title: 'Use Strong Action Verbs',
                description: 'Start bullet points with powerful action verbs to make your achievements more impactful.',
                impact: 'high',
                effort: 'easy',
                examples: [
                    'Led cross-functional team...',
                    'Developed innovative solution...',
                    'Achieved 95% customer satisfaction...'
                ]
            });
        }

        // Check for professional summary
        const hasSummary = /summary|profile|objective/i.test(text);
        if (!hasSummary) {
            recommendations.push({
                id: 'add-professional-summary',
                type: 'suggestion',
                category: 'structure',
                title: 'Add Professional Summary',
                description: 'Include a brief professional summary at the top of your resume to grab attention.',
                impact: 'medium',
                effort: 'easy',
                examples: [
                    'Experienced software engineer with 5+ years developing scalable web applications...'
                ]
            });
        }

        return recommendations;
    }
}