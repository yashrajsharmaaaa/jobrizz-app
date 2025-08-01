import jsPDF from 'jspdf';

export interface PDFExportOptions {
    fileName?: string;
    pageSize?: 'a4' | 'letter';
    margins?: {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    // Future server-side options
    serverSide?: boolean;
    userId?: string;
    templateId?: string;
    quality?: 'draft' | 'standard' | 'high';
}

export interface PDFExportRequest {
    content: string;
    fileName: string;
    options: PDFExportOptions;
    userId?: string;
    resumeId?: string;
    version: 'original' | 'corrected';
}

export interface PDFExportResponse {
    success: boolean;
    downloadUrl?: string;
    fileId?: string;
    error?: string;
    metadata?: {
        fileSize: number;
        pageCount: number;
        generatedAt: Date;
        expiresAt?: Date;
    };
}

interface ResumeStructure {
    header: {
        name?: string;
        contact: string[];
        position?: number;
    };
    sections: Array<{
        title: string;
        content: string[];
        type: 'header' | 'section' | 'subsection' | 'bullet' | 'paragraph';
        indentLevel: number;
        position: number;
        originalLine: string;
    }>;
    formatting: {
        lineSpacing: number;
        sectionSpacing: number;
        indentSize: number;
        bulletStyle: string;
    };
}

export class PDFExportService {
    private static readonly DEFAULT_OPTIONS = {
        fileName: 'resume.pdf',
        pageSize: 'a4' as const,
        margins: {
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
        },
    };

    // API endpoints for future server integration
    private static readonly API_ENDPOINTS = {
        EXPORT_PDF: '/api/resume/export/pdf',
        GET_EXPORT_STATUS: '/api/resume/export/status',
        DOWNLOAD_PDF: '/api/resume/download',
    };

    /**
     * Analyze the original resume structure to preserve formatting
     */
    private static analyzeResumeStructure(content: string): ResumeStructure {
        const lines = content.split('\n');
        const structure: ResumeStructure = {
            header: { contact: [], position: 0 },
            sections: [],
            formatting: {
                lineSpacing: 1.2,
                sectionSpacing: 1.5,
                indentSize: 10,
                bulletStyle: '•'
            }
        };

        let currentSection: string | null = null;
        let headerDetected = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            if (!trimmedLine) continue;

            // Detect header information (first few lines with contact info)
            if (!headerDetected && i < 8) {
                if (this.isContactInfo(trimmedLine)) {
                    structure.header.contact.push(trimmedLine);
                    continue;
                } else if (this.isPossibleName(trimmedLine) && !structure.header.name) {
                    structure.header.name = trimmedLine;
                    structure.header.position = i;
                    continue;
                }
            }

            // Mark header as complete after first few lines or when we hit a clear section
            if (i >= 8 || this.isSectionHeader(trimmedLine)) {
                headerDetected = true;
            }

            // Detect section headers
            if (this.isSectionHeader(trimmedLine)) {
                currentSection = trimmedLine;
                structure.sections.push({
                    title: trimmedLine,
                    content: [trimmedLine],
                    type: 'section',
                    indentLevel: 0,
                    position: i,
                    originalLine: line
                });
                continue;
            }

            // Detect bullet points
            if (this.isBulletPoint(line)) {
                const indentLevel = this.getIndentLevel(line);
                const bulletContent = this.extractBulletContent(line);
                structure.sections.push({
                    title: currentSection || '',
                    content: [bulletContent],
                    type: 'bullet',
                    indentLevel,
                    position: i,
                    originalLine: line
                });
                continue;
            }

            // Detect subsections (job titles, company names, etc.)
            if (this.isSubsection(trimmedLine)) {
                structure.sections.push({
                    title: currentSection || '',
                    content: [trimmedLine],
                    type: 'subsection',
                    indentLevel: this.getIndentLevel(line),
                    position: i,
                    originalLine: line
                });
                continue;
            }

            // Regular paragraph content
            if (trimmedLine.length > 0) {
                const indentLevel = this.getIndentLevel(line);
                structure.sections.push({
                    title: currentSection || '',
                    content: [trimmedLine],
                    type: 'paragraph',
                    indentLevel,
                    position: i,
                    originalLine: line
                });
            }
        }

        return structure;
    }

    /**
     * Check if line contains contact information
     */
    private static isContactInfo(line: string): boolean {
        const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
        const phonePattern = /\b(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/;
        const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+|linkedin\.com\/[^\s]+/;
        const addressPattern = /\b\d+\s+[A-Za-z\s]+,\s*[A-Za-z\s]+,?\s*[A-Z]{2}\s*\d{5}/;

        return emailPattern.test(line) || phonePattern.test(line) || urlPattern.test(line) || addressPattern.test(line);
    }

    /**
     * Check if line is likely a person's name
     */
    private static isPossibleName(line: string): boolean {
        // Simple heuristic: 2-4 words, each capitalized, no special characters except spaces and periods
        const words = line.trim().split(/\s+/);
        if (words.length < 2 || words.length > 4) return false;

        return words.every(word =>
            /^[A-Z][a-z]+\.?$/.test(word) || // Capitalized word, possibly with period
            /^[A-Z]\.?$/.test(word) // Single letter (middle initial)
        );
    }

    /**
     * Check if line is a section header
     */
    private static isSectionHeader(line: string): boolean {
        const sectionKeywords = [
            'experience', 'education', 'skills', 'summary', 'objective', 'profile',
            'projects', 'certifications', 'achievements', 'awards', 'languages',
            'professional experience', 'work experience', 'employment history',
            'technical skills', 'core competencies', 'qualifications',
            'professional summary', 'career objective', 'personal projects'
        ];

        const lowerLine = line.toLowerCase().trim();

        // Check for exact matches or lines ending with colon
        return (
            sectionKeywords.some(keyword => lowerLine === keyword || lowerLine === keyword + ':') ||
            (line.length < 40 && line.endsWith(':') && !line.includes('@')) ||
            (line === line.toUpperCase() && line.length < 50 && line.length > 3 && !this.isContactInfo(line))
        );
    }

    /**
     * Check if line is a bullet point
     */
    private static isBulletPoint(line: string): boolean {
        const trimmed = line.trim();
        return /^[•·▪▫◦‣⁃-]\s+/.test(trimmed) || /^\*\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed);
    }

    /**
     * Get indentation level of a line
     */
    private static getIndentLevel(line: string): number {
        const leadingSpaces = line.length - line.trimStart().length;
        return Math.floor(leadingSpaces / 4); // Assume 4 spaces per indent level
    }

    /**
     * Extract content from bullet point (remove bullet character)
     */
    private static extractBulletContent(line: string): string {
        return line.trim().replace(/^[•·▪▫◦‣⁃-]\s*/, '').replace(/^\*\s*/, '').replace(/^\d+\.\s*/, '');
    }

    /**
     * Check if line is a subsection (job title, company, etc.)
     */
    private static isSubsection(line: string): boolean {
        // Heuristics for job titles, company names, etc.
        const hasDatePattern = /\b(19|20)\d{2}\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b|\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/i;
        const hasCompanyIndicators = /\b(Inc|LLC|Corp|Company|Ltd|Organization|University|College|School)\b/i;
        const isAllCaps = line === line.toUpperCase() && line.length > 5;
        const isBold = line.includes('**') || (line.length < 60 && !line.includes('.') && !this.isBulletPoint(line));

        return hasDatePattern.test(line) || hasCompanyIndicators.test(line) || isAllCaps || isBold;
    }

    /**
     * Export text content preserving original structure and formatting
     */
    static async exportTextToPDF(
        content: string,
        options: PDFExportOptions = {}
    ): Promise<void> {
        const config = { ...this.DEFAULT_OPTIONS, ...options };

        try {
            // Analyze the resume structure
            const structure = this.analyzeResumeStructure(content);

            // Create new PDF document
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: config.pageSize,
            });

            // Calculate page dimensions
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const textWidth = pageWidth - config.margins.left - config.margins.right;
            let currentY = config.margins.top;

            // Render header
            if (structure.header.name) {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(18);
                doc.setTextColor(0, 0, 0);

                const nameLines = doc.splitTextToSize(structure.header.name, textWidth);
                for (const nameLine of nameLines) {
                    doc.text(nameLine, config.margins.left, currentY);
                    currentY += 9;
                }
                currentY += 4;
            }

            // Render contact information
            if (structure.header.contact.length > 0) {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(60, 60, 60);

                // Try to fit contact info on one line, separated by | or •
                const contactLine = structure.header.contact.join(' • ');
                const contactLines = doc.splitTextToSize(contactLine, textWidth);

                for (const line of contactLines) {
                    doc.text(line, config.margins.left, currentY);
                    currentY += 5;
                }
                currentY += 8;
            }

            // Group sections by title to maintain structure
            const groupedSections = this.groupSectionsByTitle(structure.sections);

            // Render sections
            for (const [sectionTitle, sectionItems] of groupedSections) {
                // Skip empty sections
                if (sectionItems.length === 0) continue;

                // Check if we need a new page
                if (currentY + 25 > pageHeight - config.margins.bottom) {
                    doc.addPage();
                    currentY = config.margins.top;
                }

                // Render section header if it exists and is not empty
                if (sectionTitle && sectionTitle.trim() !== '') {
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(13);
                    doc.setTextColor(0, 0, 0);

                    const headerLines = doc.splitTextToSize(sectionTitle.replace(':', ''), textWidth);
                    for (const headerLine of headerLines) {
                        doc.text(headerLine, config.margins.left, currentY);
                        currentY += 7;
                    }

                    // Add underline for section headers
                    doc.setLineWidth(0.3);
                    doc.setDrawColor(100, 100, 100);
                    doc.line(config.margins.left, currentY, config.margins.left + textWidth * 0.3, currentY);
                    currentY += 6;
                }

                // Render section content
                for (const item of sectionItems) {
                    if (item.type !== 'section') { // Skip section headers as we already rendered them
                        currentY = this.renderSectionItem(doc, item, currentY, config, textWidth, pageHeight);
                    }
                }

                currentY += 4; // Extra spacing between sections
            }

            // Save the PDF
            doc.save(config.fileName);

        } catch (error) {
            console.error('PDF export failed:', error);
            throw new Error('Failed to generate PDF. Please try again.');
        }
    }

    /**
     * Group sections by their title to maintain structure
     */
    private static groupSectionsByTitle(sections: ResumeStructure['sections']): Map<string, ResumeStructure['sections']> {
        const grouped = new Map<string, ResumeStructure['sections']>();

        for (const section of sections) {
            const key = section.title || 'content';
            if (!grouped.has(key)) {
                grouped.set(key, []);
            }
            grouped.get(key)!.push(section);
        }

        return grouped;
    }

    /**
     * Render individual section items with proper formatting
     */
    private static renderSectionItem(
        doc: jsPDF,
        item: ResumeStructure['sections'][0],
        currentY: number,
        config: { fileName: string; pageSize: 'a4' | 'letter'; margins: { top: number; left: number; right: number; bottom: number; } },
        textWidth: number,
        pageHeight: number
    ): number {
        const margins = config.margins;

        for (const content of item.content) {
            // Check if we need a new page
            if (currentY + 15 > pageHeight - margins.bottom) {
                doc.addPage();
                currentY = margins.top;
            }

            const leftMargin = margins.left + (item.indentLevel * 6);
            const availableWidth = textWidth - (item.indentLevel * 6);

            switch (item.type) {
                case 'subsection':
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(11);
                    doc.setTextColor(20, 20, 20);
                    break;
                case 'bullet':
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);
                    doc.setTextColor(40, 40, 40);
                    // Add bullet point
                    doc.text('•', leftMargin, currentY);
                    break;
                default:
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);
                    doc.setTextColor(40, 40, 40);
            }

            const textX = item.type === 'bullet' ? leftMargin + 4 : leftMargin;
            const textLines = doc.splitTextToSize(content, availableWidth - (item.type === 'bullet' ? 4 : 0));

            for (const textLine of textLines) {
                doc.text(textLine, textX, currentY);
                currentY += item.type === 'subsection' ? 6 : 5;
            }

            // Add spacing after subsections
            if (item.type === 'subsection') {
                currentY += 2;
            }
        }

        return currentY;
    }

    /**
     * Export resume analysis content as PDF (client-side for now, server-side ready)
     */
    static async exportAnalysisToPDF(
        fileName: string,
        content: string,
        isOriginal: boolean = true,
        userId?: string
    ): Promise<void> {
        const suffix = isOriginal ? '_original' : '_corrected';
        const cleanFileName = fileName.replace(/\.[^/.]+$/, '');

        // For now, use client-side generation
        // TODO: Switch to server-side when backend is ready
        await this.exportTextToPDF(content, {
            fileName: `${cleanFileName}${suffix}.pdf`,
            userId,
        });
    }

    /**
     * Future server-side PDF export method
     * This will be used when backend is integrated
     */
    static async exportPDFServerSide(request: PDFExportRequest): Promise<PDFExportResponse> {
        try {
            // This will make API call to backend
            const response = await fetch(this.API_ENDPOINTS.EXPORT_PDF, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth headers when authentication is implemented
                    // 'Authorization': `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Server-side PDF export failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown server error',
            };
        }
    }

    /**
     * Check export status (for async server-side processing)
     */
    static async getExportStatus(fileId: string): Promise<PDFExportResponse> {
        try {
            const response = await fetch(`${this.API_ENDPOINTS.GET_EXPORT_STATUS}/${fileId}`);
            return await response.json();
        } catch (error) {
            return {
                success: false,
                error: 'Failed to check export status',
            };
        }
    }

    /**
     * Download PDF from server
     */
    static async downloadFromServer(fileId: string): Promise<void> {
        try {
            const response = await fetch(`${this.API_ENDPOINTS.DOWNLOAD_PDF}/${fileId}`);

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `resume_${fileId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            throw error;
        }
    }

    /**
     * Hybrid export method - tries server-side first, falls back to client-side
     */
    static async exportPDFHybrid(
        fileName: string,
        content: string,
        isOriginal: boolean = true,
        userId?: string
    ): Promise<void> {
        // Check if server-side export is available
        const serverAvailable = await this.isServerAvailable();

        if (serverAvailable && userId) {
            try {
                const request: PDFExportRequest = {
                    content,
                    fileName,
                    options: {
                        serverSide: true,
                        userId,
                        quality: 'standard',
                    },
                    userId,
                    version: isOriginal ? 'original' : 'corrected',
                };

                const response = await this.exportPDFServerSide(request);

                if (response.success && response.downloadUrl) {
                    // Redirect to download URL or trigger download
                    window.open(response.downloadUrl, '_blank');
                    return;
                }
            } catch (error) {
                console.warn('Server-side export failed, falling back to client-side:', error);
            }
        }

        // Fallback to client-side export
        await this.exportAnalysisToPDF(fileName, content, isOriginal, userId);
    }

    /**
     * Check if server-side export is available
     */
    private static async isServerAvailable(): Promise<boolean> {
        try {
            const response = await fetch('/api/health', { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }
}