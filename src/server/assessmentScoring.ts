export interface AssessmentAnswerKeyItem {
  id: number;
  correctIndex: number;
  topic: string;
  explanation: string;
}

export interface AssessmentQuestionResult extends AssessmentAnswerKeyItem {
  selectedIndex: number;
  isCorrect: boolean;
}

export function gradeAssessment(
  questions: AssessmentAnswerKeyItem[],
  answers: Record<string, number>
): {
  score: number;
  percentage: number;
  passed: boolean;
  weakTopics: string[];
  questionResults: AssessmentQuestionResult[];
} {
  const questionResults = questions.map((question, index) => {
    const selectedIndex = answers[String(index)] ?? -1;
    return {
      ...question,
      selectedIndex,
      isCorrect: selectedIndex === question.correctIndex,
    };
  });
  const score = questionResults.filter((result) => result.isCorrect).length;
  const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;

  return {
    score,
    percentage,
    passed: percentage >= 70,
    weakTopics: Array.from(new Set(questionResults.filter((result) => !result.isCorrect).map((result) => result.topic).filter(Boolean))),
    questionResults,
  };
}