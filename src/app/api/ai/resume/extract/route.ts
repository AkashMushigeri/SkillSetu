import { NextRequest, NextResponse } from 'next/server';
import { extractResumeData, validateResumeBuffer } from '@/server/ai/resumeExtractionService';
import { Skill } from '@/types/student';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Scenario A: Multipart form upload (File)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const rawText = formData.get('text') as string | null;
      const rawExistingSkills = formData.get('existingSkills') as string | null;

      let existingSkills: Skill[] = [];
      if (rawExistingSkills) {
        try {
          existingSkills = JSON.parse(rawExistingSkills);
        } catch (e) {
          // ignore parsing error
        }
      }

      if (!file && (!rawText || !rawText.trim())) {
        return NextResponse.json(
          { error: 'No resume file or text content provided in the request.' },
          { status: 400 }
        );
      }

      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const validation = validateResumeBuffer(buffer, file.name, file.type);
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error || 'Invalid resume file format.' },
            { status: 400 }
          );
        }

        const result = await extractResumeData({
          fileBuffer: buffer,
          fileName: file.name,
          mimeType: file.type,
          existingSkills,
        });

        return NextResponse.json(result);
      }

      if (rawText && rawText.trim()) {
        const result = await extractResumeData({
          rawText: rawText.trim(),
          existingSkills,
        });
        return NextResponse.json(result);
      }
    }

    // Scenario B: JSON payload
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const text = body.text || body.rawText;
      const existingSkills = Array.isArray(body.existingSkills) ? body.existingSkills : [];

      if (!text || typeof text !== 'string' || text.trim().length < 10) {
        return NextResponse.json(
          { error: 'Text content is required and must contain at least 10 characters.' },
          { status: 400 }
        );
      }

      const result = await extractResumeData({
        rawText: text.trim(),
        existingSkills,
      });

      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'Unsupported Content-Type. Please use multipart/form-data or application/json.' },
      { status: 415 }
    );
  } catch (err: any) {
    console.error('[API /api/ai/resume/extract] Error:', err);
    return NextResponse.json(
      { error: 'Failed to extract resume data', details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
