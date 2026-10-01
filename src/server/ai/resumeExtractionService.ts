/**
 * src/server/ai/resumeExtractionService.ts
 * 
 * Production-ready AI & NLP Resume Skill Extraction Engine for SkillSetu.
 * Handles PDF, DOCX, TXT/Markdown resume ingestion, security validations,
 * Gemini 1.5 Flash extraction with high-fidelity offline fallback,
 * skill taxonomy normalization, and unverified-by-default profile linking.
 */

import zlib from 'zlib';
import {
  Skill,
  SkillProficiencyLevel,
  ExtractedSkillItem,
  ExtractedProjectItem,
  ExtractedExperienceItem,
  ExtractedEducationItem,
  ResumeExtractionResult,
} from '@/types/student';
import { SKILL_TAXONOMY, normalizeSkill, normalizeSkillName, findTaxonomyGroup } from './skillTaxonomy';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface ResumeExtractionInput {
  fileBuffer?: Buffer | Uint8Array;
  fileName?: string;
  mimeType?: string;
  rawText?: string;
  existingSkills?: Skill[];
}

/**
 * Validates buffer integrity, size limit, and detects true MIME magic bytes.
 */
export function validateResumeBuffer(
  buffer: Buffer,
  fileName: string = '',
  mimeType: string = ''
): { valid: boolean; format: 'pdf' | 'docx' | 'txt'; error?: string } {
  if (!buffer || buffer.length === 0) {
    return { valid: false, format: 'txt', error: 'Uploaded file is empty.' };
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      format: 'txt',
      error: 'File size exceeds the 5MB limit. Please upload a smaller resume.',
    };
  }

  // Magic bytes check
  // PDF: starts with %PDF- (0x25, 0x50, 0x44, 0x46)
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return { valid: true, format: 'pdf' };
  }

  // DOCX / ZIP: starts with PK\x03\x04 (0x50, 0x4B, 0x03, 0x04)
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04
  ) {
    return { valid: true, format: 'docx' };
  }

  // Plain text / Markdown
  const lowerName = fileName.toLowerCase();
  const lowerMime = mimeType.toLowerCase();
  const isTextExtension =
    lowerName.endsWith('.txt') ||
    lowerName.endsWith('.md') ||
    lowerName.endsWith('.text') ||
    lowerMime.includes('text/plain') ||
    lowerMime.includes('text/markdown');

  // Verify whether the buffer is printable text
  let nonPrintableCount = 0;
  const sampleLength = Math.min(buffer.length, 1024);
  for (let i = 0; i < sampleLength; i++) {
    const byte = buffer[i];
    // Allow ASCII printable (32-126), tab (9), newline (10), carriage return (13), and UTF-8 continuation
    if (byte < 9 || (byte > 13 && byte < 32)) {
      nonPrintableCount++;
    }
  }

  if (nonPrintableCount / sampleLength < 0.05 || isTextExtension) {
    return { valid: true, format: 'txt' };
  }

  return {
    valid: false,
    format: 'txt',
    error:
      'Unsupported or corrupted file format. Please upload a valid PDF, DOCX, or TXT resume document.',
  };
}

/**
 * Extracts plain text from a DOCX buffer by decompressing word/document.xml
 */
export function extractTextFromDocx(buffer: Buffer): string {
  try {
    let offset = 0;
    while (offset + 30 <= buffer.length) {
      if (buffer.readUInt32LE(offset) !== 0x04034b50) {
        offset++;
        continue;
      }
      const method = buffer.readUInt16LE(offset + 8);
      const compSize = buffer.readUInt32LE(offset + 18);
      const nameLen = buffer.readUInt16LE(offset + 26);
      const extraLen = buffer.readUInt16LE(offset + 28);
      const name = buffer.toString('utf8', offset + 30, offset + 30 + nameLen);
      const dataOffset = offset + 30 + nameLen + extraLen;

      if (name === 'word/document.xml') {
        const compData = buffer.subarray(dataOffset, dataOffset + compSize);
        let xml = '';
        if (method === 8) {
          xml = zlib.inflateRawSync(compData).toString('utf8');
        } else {
          xml = compData.toString('utf8');
        }
        return xml
          .replace(/<w:p[^>]*>/gi, '\n')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'")
          .replace(/\r\n/g, '\n')
          .replace(/[ \t]+/g, ' ')
          .trim();
      }
      offset = dataOffset + compSize;
    }
  } catch (err) {
    console.warn('[Resume Extraction] DOCX XML parsing error, attempting string scan:', err);
  }

  // Fallback: extract printable strings
  return buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
}

/**
 * Extracts text from a PDF buffer using pdf-parse, with fallback stream scan.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const { PDFParse } = require('pdf-parse');
    if (PDFParse) {
      const parser = new PDFParse({ data: buffer });
      const res = await parser.getText();
      await parser.destroy();
      if (res && res.text && res.text.trim().length > 20) {
        return res.text;
      }
    }
  } catch (err) {
    console.warn('[Resume Extraction] pdf-parse getText error, using stream fallback:', err);
  }

  // Fallback: extract text blocks from PDF stream
  try {
    const raw = buffer.toString('latin1');
    const textMatches: string[] = [];
    const tjRegex = /\(([^)]+)\)\s*Tj/g;
    let match: RegExpExecArray | null;
    while ((match = tjRegex.exec(raw)) !== null) {
      if (match[1] && match[1].trim()) {
        textMatches.push(match[1]);
      }
    }
    if (textMatches.length > 10) {
      return textMatches.join(' ');
    }
  } catch (fallbackErr) {
    console.warn('[Resume Extraction] PDF stream scan error:', fallbackErr);
  }

  return buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
}

/**
 * Extracts raw text from the input (buffer or text string).
 */
export async function extractRawTextFromInput(input: ResumeExtractionInput): Promise<{
  text: string;
  format: 'pdf' | 'docx' | 'txt';
}> {
  if (input.rawText && input.rawText.trim().length > 0) {
    return { text: input.rawText.trim(), format: 'txt' };
  }

  if (!input.fileBuffer) {
    throw new Error('No resume file or text content provided.');
  }

  const buf = Buffer.isBuffer(input.fileBuffer)
    ? input.fileBuffer
    : Buffer.from(input.fileBuffer);

  const validation = validateResumeBuffer(buf, input.fileName, input.mimeType);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid file format');
  }

  let text = '';
  if (validation.format === 'pdf') {
    text = await extractTextFromPdf(buf);
  } else if (validation.format === 'docx') {
    text = extractTextFromDocx(buf);
  } else {
    text = buf.toString('utf-8');
  }

  return { text: text.trim(), format: validation.format };
}

/**
 * Extract Gemini API Key if available.
 */
function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY;
}

/**
 * AI extraction using Gemini 1.5 Flash.
 */
async function extractWithGemini(
  text: string
): Promise<Partial<ResumeExtractionResult> | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  try {
    const prompt = `You are SkillSetu's AI Career and Skill Extraction Engine.
Analyze the following resume text and extract all technical and professional data into a strict JSON object.

RESUME TEXT:
"""
${text.slice(0, 12000)}
"""

RULES:
1. Extract all technical skills, programming languages, libraries, frameworks, databases, cloud platforms, AI/ML tools, and soft skills.
2. For each skill, include:
   - "name": The skill name as mentioned or canonical
   - "category": One of "Programming", "Web Development", "Mobile", "Databases", "Cloud & DevOps", "Artificial Intelligence", "Data Science", "Core Aptitude", "Tools"
   - "proficiency": "Beginner", "Intermediate", "Advanced", or "Expert" (estimate based on years of experience, projects, or self-claim)
   - "evidenceSnippet": A brief quote or context sentence from the resume demonstrating where/how this skill was used
   - "confidence": A number from 0.70 to 0.99
3. Extract projects with title, description, and techStack.
4. Extract work experience with title, company, period, description, and technologies.
5. Extract education with degree, institution, year, fieldOfStudy, and score/GPA.
6. Extract certifications as an array of strings.
7. Extract candidate contact info: candidateName, email, phone, links (github, linkedin, portfolio), and summary.

Respond ONLY with valid JSON in this exact structure:
{
  "candidateName": "...",
  "email": "...",
  "phone": "...",
  "links": { "github": "...", "linkedin": "...", "portfolio": "..." },
  "summary": "...",
  "skills": [
    {
      "name": "Python",
      "category": "Programming",
      "proficiency": "Intermediate",
      "evidenceSnippet": "Built REST APIs with Python and FastAPI",
      "confidence": 0.95
    }
  ],
  "projects": [
    { "title": "...", "description": "...", "techStack": ["..."] }
  ],
  "experience": [
    { "title": "...", "company": "...", "period": "...", "description": "...", "technologies": ["..."] }
  ],
  "education": [
    { "degree": "...", "institution": "...", "year": "...", "fieldOfStudy": "...", "score": "..." }
  ],
  "certifications": ["..."]
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!res.ok) {
      console.warn(`[Resume Extraction] Gemini API HTTP error: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) return null;

    const cleaned = rawJson
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (err) {
    console.warn('[Resume Extraction] Gemini extraction error, falling back to local engine:', err);
    return null;
  }
}

/**
 * Escapes regex special characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * High-fidelity offline NLP & Taxonomy Fallback Engine.
 * Extracts contact info, education, experience, projects, certifications,
 * and detects taxonomy-aligned skills with context evidence snippets.
 */
export function extractWithOfflineEngine(text: string): Partial<ResumeExtractionResult> {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 1. Candidate Name
  let candidateName = '';
  for (const line of lines.slice(0, 8)) {
    // Avoid headers like "Curriculum Vitae", "Resume", emails, or phones
    if (
      !line.match(/resume|curriculum|vitae|contact|profile|page|email|phone/i) &&
      line.length >= 3 &&
      line.length <= 40 &&
      !line.includes('@') &&
      !line.match(/^\+?\d/)
    ) {
      candidateName = line;
      break;
    }
  }

  // 2. Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : undefined;

  // 3. Phone
  const phoneMatch = text.match(
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+91[-.\s]?[6-9]\d{9}|\b[6-9]\d{9}\b/
  );
  const phone = phoneMatch ? phoneMatch[0] : undefined;

  // 4. Links
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const linkedinMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i
  );
  const portfolioMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9_-]+\.(?:dev|io|me|app|vercel\.app|netlify\.app)\b/i
  );

  const links = {
    github: githubMatch ? githubMatch[0] : undefined,
    linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
    portfolio: portfolioMatch ? portfolioMatch[0] : undefined,
  };

  // 5. Summary / Objective
  let summary = '';
  const summaryHeader = text.match(
    /(?:professional summary|profile summary|about me|summary|objective)[\s:]*\n+([^]+?)(?=\n\s*(?:education|experience|skills|projects|certifications|$))/i
  );
  if (summaryHeader && summaryHeader[1]) {
    summary = summaryHeader[1].trim().slice(0, 400);
  }

  // 6. Skills extraction using SKILL_TAXONOMY + regex heuristics
  const rawSkillsMap = new Map<string, ExtractedSkillItem>();

  for (const group of SKILL_TAXONOMY) {
    const termsToTest = [group.canonical, ...group.synonyms];
    for (const term of termsToTest) {
      const cleanTerm = term.trim();
      if (!cleanTerm) continue;

      let regex: RegExp;
      // Handle special characters in tech terms like C++, C#, .NET
      if (cleanTerm === 'C++') {
        regex = /(?:^|[\s,;/()|])(c\+\+)(?:[\s,;/()|]|$)/i;
      } else if (cleanTerm === 'C#') {
        regex = /(?:^|[\s,;/()|])(c\#)(?:[\s,;/()|]|$)/i;
      } else if (cleanTerm === '.NET') {
        regex = /(?:^|[\s,;/()|])(\.net)(?:[\s,;/()|]|$)/i;
      } else if (cleanTerm.toLowerCase() === 'c') {
        regex = /(?:^|[\s,;/()|])(C)(?:[\s,;/()|]|$)/;
      } else if (cleanTerm.toLowerCase() === 'r') {
        regex = /(?:^|[\s,;/()|])(R)(?:[\s,;/()|]|$)/;
      } else {
        regex = new RegExp(`\\b${escapeRegex(cleanTerm)}\\b`, 'i');
      }

      const match = regex.exec(text);
      if (match) {
        // Extract evidence snippet around match
        const matchIdx = match.index;
        const startIdx = Math.max(0, matchIdx - 40);
        const endIdx = Math.min(text.length, matchIdx + cleanTerm.length + 60);
        let snippet = text.slice(startIdx, endIdx).replace(/\s+/g, ' ').trim();
        if (startIdx > 0) snippet = '...' + snippet;
        if (endIdx < text.length) snippet = snippet + '...';

        // Proficiency estimation from surrounding context
        const windowContext = text
          .slice(Math.max(0, matchIdx - 100), Math.min(text.length, matchIdx + 100))
          .toLowerCase();

        let proficiency: SkillProficiencyLevel = 'Intermediate';
        if (
          windowContext.match(/expert|advanced|architect|lead|head|specialist|mastery|senior/)
        ) {
          proficiency = 'Advanced';
        } else if (
          windowContext.match(/basic|beginner|fundamentals|familiar|elementary|exposure|novice/)
        ) {
          proficiency = 'Beginner';
        }

        // Canonical mapping
        const canonical = group.canonical;
        if (!rawSkillsMap.has(canonical)) {
          rawSkillsMap.set(canonical, {
            name: canonical,
            canonicalName: canonical,
            category: group.category,
            proficiency,
            evidenceSnippet: snippet,
            confidence: 0.9,
          });
        }
        break; // Matched this canonical group, move to next
      }
    }
  }

  // Common additional technologies dictionary
  const additionalTech = [
    { name: 'GraphQL', category: 'Web Development' },
    { name: 'Redis', category: 'Databases' },
    { name: 'Vue.js', category: 'Web Development' },
    { name: 'Angular', category: 'Web Development' },
    { name: 'Kafka', category: 'Cloud & DevOps' },
    { name: 'Linux', category: 'Tools' },
    { name: 'CI/CD', category: 'Cloud & DevOps' },
    { name: 'Kubernetes', category: 'Cloud & DevOps' },
    { name: 'Figma', category: 'Design' },
    { name: 'Go', category: 'Programming' },
    { name: 'Rust', category: 'Programming' },
    { name: 'Flask', category: 'Web Development' },
    { name: 'FastAPI', category: 'Web Development' },
    { name: 'Pandas', category: 'Data Science' },
    { name: 'NumPy', category: 'Data Science' },
    { name: 'Scikit-Learn', category: 'Artificial Intelligence' },
    { name: 'PyTorch', category: 'Artificial Intelligence' },
    { name: 'Postman', category: 'Tools' },
    { name: 'REST APIs', category: 'Web Development' },
  ];

  for (const item of additionalTech) {
    const canonical = item.name;
    if (!rawSkillsMap.has(canonical)) {
      const reg = new RegExp(`\\b${escapeRegex(item.name)}\\b`, 'i');
      const m = reg.exec(text);
      if (m) {
        const start = Math.max(0, m.index - 30);
        const end = Math.min(text.length, m.index + item.name.length + 50);
        const snippet = text.slice(start, end).replace(/\s+/g, ' ').trim();
        rawSkillsMap.set(canonical, {
          name: canonical,
          canonicalName: canonical,
          category: item.category,
          proficiency: 'Intermediate',
          evidenceSnippet: snippet,
          confidence: 0.85,
        });
      }
    }
  }

  // 7. Projects Extraction
  const projects: ExtractedProjectItem[] = [];
  const projectSection = text.match(
    /(?:projects|academic projects|key projects)[\s:]*\n+([^]+?)(?=\n\s*(?:experience|education|skills|certifications|achievements|$))/i
  );
  if (projectSection && projectSection[1]) {
    const rawProjText = projectSection[1];
    const projectBlocks = rawProjText.split(/\n\s*(?=[•\-\*]|\d+\.|\b[A-Z][A-Za-z0-9\s]{3,30}:)/);
    for (const block of projectBlocks) {
      const bLines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      if (bLines.length > 0) {
        const titleLine = bLines[0].replace(/^[•\-\*\d\.\s]+/, '').trim();
        if (titleLine.length >= 3 && titleLine.length <= 60) {
          const desc = bLines.slice(1).join(' ').trim() || titleLine;
          // Detect tech stack in project description
          const detectedStack: string[] = [];
          for (const s of Array.from(rawSkillsMap.values())) {
            if (new RegExp(`\\b${escapeRegex(s.canonicalName)}\\b`, 'i').test(block)) {
              detectedStack.push(s.canonicalName);
            }
          }
          projects.push({
            title: titleLine,
            description: desc.slice(0, 300),
            techStack: detectedStack.slice(0, 6),
          });
        }
      }
    }
  }

  // 8. Experience Extraction
  const experience: ExtractedExperienceItem[] = [];
  const expSection = text.match(
    /(?:experience|work experience|employment history|internships)[\s:]*\n+([^]+?)(?=\n\s*(?:education|projects|skills|certifications|achievements|$))/i
  );
  if (expSection && expSection[1]) {
    const expBlocks = expSection[1].split(/\n\s*(?=[•\-\*]|\d+\.|\b[A-Z][A-Za-z0-9\s]{3,30}:)/);
    for (const block of expBlocks) {
      const bLines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      if (bLines.length > 0) {
        const titleLine = bLines[0].replace(/^[•\-\*\d\.\s]+/, '').trim();
        if (titleLine.length >= 3 && titleLine.length <= 80) {
          const companyMatch = titleLine.match(/(?:at|@|,)\s*([A-Za-z0-9\s&]+)/i);
          const company = companyMatch ? companyMatch[1].trim() : 'Organization';
          const periodMatch = block.match(
            /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})\s*(?:[-–to]+)\s*(?:present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})/i
          );
          experience.push({
            title: titleLine.replace(/(?:at|@|,)\s*[A-Za-z0-9\s&]+/i, '').trim() || titleLine,
            company,
            period: periodMatch ? periodMatch[0] : undefined,
            description: bLines.slice(1).join(' ').slice(0, 300),
          });
        }
      }
    }
  }

  // 9. Education Extraction
  const education: ExtractedEducationItem[] = [];
  const eduSection = text.match(
    /(?:education|academic background|qualifications)[\s:]*\n+([^]+?)(?=\n\s*(?:experience|projects|skills|certifications|achievements|$))/i
  );
  if (eduSection && eduSection[1]) {
    const eduLines = eduSection[1].split('\n').map((l) => l.trim()).filter(Boolean);
    for (const l of eduLines) {
      if (l.match(/b\.?tech|b\.?e|m\.?tech|m\.?s|b\.?sc|bachelor|master|diploma|degree/i)) {
        const yearMatch = l.match(/\b(20\d{2})\b/);
        const gpaMatch = l.match(/(?:gpa|cgpa|score|percentage)[\s:]*([0-9.]+(?:\s*\/10|\s*%)?)/i);
        education.push({
          degree: l.split(/[,\-|]/)[0].trim(),
          institution: l.split(/[,\-|]/)[1]?.trim() || 'University / College',
          year: yearMatch ? yearMatch[1] : undefined,
          score: gpaMatch ? gpaMatch[1] : undefined,
        });
      }
    }
  }

  // 10. Certifications Extraction
  const certifications: string[] = [];
  const certSection = text.match(
    /(?:certifications|licenses & certifications|certificates)[\s:]*\n+([^]+?)(?=\n\s*(?:education|experience|projects|skills|achievements|$))/i
  );
  if (certSection && certSection[1]) {
    const cLines = certSection[1].split('\n').map((l) => l.trim()).filter(Boolean);
    for (const c of cLines) {
      const clean = c.replace(/^[•\-\*\d\.\s]+/, '').trim();
      if (clean.length > 5 && clean.length < 100) {
        certifications.push(clean);
      }
    }
  }

  return {
    candidateName,
    email,
    phone,
    links,
    summary,
    skills: Array.from(rawSkillsMap.values()),
    projects,
    experience,
    education,
    certifications,
  };
}

/**
 * Main Resume Skill Extraction Engine function.
 * Coordinates input validation, Gemini AI extraction with fallback,
 * skill canonicalization via taxonomy, and cross-referencing against existing profile.
 */
export async function extractResumeData(
  input: ResumeExtractionInput
): Promise<ResumeExtractionResult> {
  const startTime = Date.now();

  // 1. Ingest text
  const { text, format } = await extractRawTextFromInput(input);
  if (!text || text.length < 15) {
    throw new Error('Resume content contains insufficient text for skill extraction.');
  }

  // 2. Extract structured data via Gemini AI or Offline Engine
  let rawResult: Partial<ResumeExtractionResult> | null = null;
  let source: 'ai' | 'offline_fallback' = 'offline_fallback';

  if (getGeminiApiKey()) {
    try {
      rawResult = await extractWithGemini(text);
      if (rawResult && rawResult.skills && rawResult.skills.length > 0) {
        source = 'ai';
      }
    } catch (aiErr) {
      console.warn('[Resume Extraction] AI extraction failed, falling back to local engine:', aiErr);
    }
  }

  if (!rawResult || !rawResult.skills || rawResult.skills.length === 0) {
    rawResult = extractWithOfflineEngine(text);
    source = 'offline_fallback';
  }

  // 3. Taxonomy Normalization & Canonical Grouping
  const normalizedSkillsMap = new Map<string, ExtractedSkillItem>();
  const inputSkills = rawResult.skills || [];

  for (const rawItem of inputSkills) {
    if (!rawItem.name) continue;

    const norm = normalizeSkillName(rawItem.name);
    const canonical = norm.canonical || rawItem.name.trim();
    const category = norm.category || rawItem.category || 'Technical';

    // Build or merge extracted skill
    if (!normalizedSkillsMap.has(canonical.toLowerCase())) {
      normalizedSkillsMap.set(canonical.toLowerCase(), {
        name: canonical,
        canonicalName: canonical,
        category,
        proficiency: rawItem.proficiency || 'Intermediate',
        evidenceSnippet: rawItem.evidenceSnippet,
        confidence: Math.min(1.0, Math.max(0.5, rawItem.confidence ?? 0.85)),
      });
    } else {
      // If already present, merge with higher confidence
      const existing = normalizedSkillsMap.get(canonical.toLowerCase())!;
      if ((rawItem.confidence ?? 0) > existing.confidence) {
        existing.confidence = rawItem.confidence!;
        if (rawItem.evidenceSnippet) existing.evidenceSnippet = rawItem.evidenceSnippet;
      }
    }
  }

  // 4. Cross-reference with existing profile skills
  // IMPORTANT REQUIREMENT:
  // - Never auto-verify extracted skills (isVerified MUST be false for newly added skills)
  // - Never downgrade existing verified skills if the candidate already has them verified!
  const existingSkills = input.existingSkills || [];
  const processedSkills: ExtractedSkillItem[] = Array.from(normalizedSkillsMap.values()).map(
    (skill) => {
      const matchInProfile = existingSkills.find(
        (s) =>
          normalizeSkill(s.name) === normalizeSkill(skill.canonicalName) ||
          normalizeSkill(s.name) === normalizeSkill(skill.name)
      );

      const isAlreadyInProfile = !!matchInProfile;
      const isAlreadyVerified = !!(matchInProfile && matchInProfile.isVerified);

      return {
        ...skill,
        isAlreadyInProfile,
        isAlreadyVerified,
        // Default selected: pre-check all skills that are not already verified
        selected: !isAlreadyVerified,
      };
    }
  );

  // Sort: unverified / new skills first, then by confidence descending
  processedSkills.sort((a, b) => {
    if (a.isAlreadyVerified !== b.isAlreadyVerified) {
      return a.isAlreadyVerified ? 1 : -1;
    }
    return b.confidence - a.confidence;
  });

  const durationMs = Date.now() - startTime;

  return {
    candidateName: rawResult.candidateName,
    email: rawResult.email,
    phone: rawResult.phone,
    links: rawResult.links,
    summary: rawResult.summary,
    skills: processedSkills,
    projects: rawResult.projects || [],
    experience: rawResult.experience || [],
    education: rawResult.education || [],
    certifications: rawResult.certifications || [],
    extractionSource: source,
    extractionTimeMs: durationMs,
    rawTextPreview: text.slice(0, 500),
  };
}
