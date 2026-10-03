import { getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { randomUUID } from 'node:crypto';
import { AssessmentQuestion } from '@/types/student';
import { gradeAssessment } from '@/server/assessmentScoring';

const ATTEMPT_TTL_MS = 60 * 60 * 1000;
const localAttempts = new Map<string, {
  userId: string;
  skillId: string;
  skillName: string;
  skillTier: string;
  skillCategory: string;
  questions: AssessmentQuestion[];
  expiresAt: number;
  submitted: boolean;
}>();

function shouldUseLocalAttemptStore() {
  const hasCredentials = Boolean(
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
  );
  return process.env.NODE_ENV !== 'production' && !process.env.FIRESTORE_EMULATOR_HOST && !hasCredentials;
}

function getAdminDb() {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const app = getApps()[0] || initializeApp(projectId ? { projectId } : undefined);
  return getFirestore(app);
}

export async function createAssessmentAttempt(input: {
  userId: string;
  skillId: string;
  skillName: string;
  skillTier: string;
  skillCategory: string;
  questions: AssessmentQuestion[];
}) {
  const expiresAt = Date.now() + ATTEMPT_TTL_MS;
  let attemptId: string;
  if (shouldUseLocalAttemptStore()) {
    attemptId = randomUUID().replace(/-/g, '').slice(0, 20);
    localAttempts.set(attemptId, {
      userId: input.userId,
      skillId: input.skillId,
      skillName: input.skillName,
      skillTier: input.skillTier,
      skillCategory: input.skillCategory,
      questions: input.questions,
      expiresAt,
      submitted: false,
    });
  } else {
    const attemptRef = getAdminDb().collection('skillAssessmentAttempts').doc();
    attemptId = attemptRef.id;
    await attemptRef.create({
      uid: input.userId,
      skillId: input.skillId,
      skillName: input.skillName,
      skillTier: input.skillTier,
      skillCategory: input.skillCategory,
      questions: input.questions,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt,
      submittedAt: null,
    });
  }

  return {
    attemptId,
    questions: input.questions.map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options,
      topic: question.topic,
      correctIndex: -1,
      explanation: '',
    })),
  };
}

export async function submitAssessmentAttempt(input: {
  userId: string;
  attemptId: string;
  answers: Record<string, number>;
}) {
  if (shouldUseLocalAttemptStore()) {
    const attempt = localAttempts.get(input.attemptId);
    if (!attempt) throw new Error('Assessment attempt was not found. Generate a new assessment.');
    if (attempt.userId !== input.userId) throw new Error('Assessment attempt does not belong to this user.');
    if (attempt.submitted) throw new Error('This assessment attempt has already been submitted.');
    if (attempt.expiresAt < Date.now()) throw new Error('Assessment attempt expired. Generate a new assessment.');

    const result = gradeAssessment(attempt.questions, input.answers);
    attempt.submitted = true;
    localAttempts.set(input.attemptId, attempt);
    return {
      ...result,
      totalQuestions: attempt.questions.length,
      submissionId: randomUUID().replace(/-/g, ''),
      skillName: attempt.skillName,
    };
  }

  const db = getAdminDb();
  const attemptRef = db.collection('skillAssessmentAttempts').doc(input.attemptId);
  const resultRef = db.collection('skillAssessments').doc();

  return db.runTransaction(async (transaction) => {
    const attemptSnapshot = await transaction.get(attemptRef);
    if (!attemptSnapshot.exists) throw new Error('Assessment attempt was not found. Generate a new assessment.');
    const attempt = attemptSnapshot.data();
    if (attempt?.uid !== input.userId) throw new Error('Assessment attempt does not belong to this user.');
    if (attempt.submittedAt) throw new Error('This assessment attempt has already been submitted.');
    if (typeof attempt.expiresAt !== 'number' || attempt.expiresAt < Date.now()) {
      throw new Error('Assessment attempt expired. Generate a new assessment.');
    }
    if (!Array.isArray(attempt.questions) || attempt.questions.length !== 10) {
      throw new Error('Assessment attempt is invalid. Generate a new assessment.');
    }

    const questions = attempt.questions as AssessmentQuestion[];
    const result = gradeAssessment(questions, input.answers);
    const createdAt = FieldValue.serverTimestamp();
    transaction.create(resultRef, {
      uid: input.userId,
      skillId: attempt.skillId,
      skillName: attempt.skillName,
      skillTier: attempt.skillTier,
      skillCategory: attempt.skillCategory,
      score: result.score,
      passed: result.passed,
      percentage: result.percentage,
      weakTopics: result.weakTopics,
      totalQuestions: questions.length,
      answers: input.answers,
      createdAt,
      verified: result.passed,
    });
    transaction.update(attemptRef, { submittedAt: createdAt, submissionId: resultRef.id });

    return {
      ...result,
      totalQuestions: questions.length,
      submissionId: resultRef.id,
      skillName: attempt.skillName,
    };
  });
}