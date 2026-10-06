export interface TheoryCoreConcept {
  title: string;
  description: string;
}

export interface TheoryTerminology {
  term: string;
  definition: string;
}

export interface TheorySyntaxSection {
  title: string;
  explanation: string;
  codeSnippet?: string;
  language?: string;
}

export interface TheoryWorkflowStep {
  step: number;
  title: string;
  description: string;
}

export interface TheoryExample {
  title: string;
  description: string;
  codeOrDiagram?: string;
  language?: string;
  outputExplanation?: string;
}

export interface TheoryCommonMistake {
  mistake: string;
  whyWrong: string;
  correctApproach: string;
}

export interface SkillTheoryNote {
  skillId: string;
  skillName: string;
  category: string;
  coreTopics: string[];
  whatIs: string;
  whyImportant: string;
  coreConcepts: TheoryCoreConcept[];
  importantTerminology: TheoryTerminology[];
  syntaxStructure?: TheorySyntaxSection;
  howItWorks: TheoryWorkflowStep[];
  simpleExamples: TheoryExample[];
  realWorldApplications: string[];
  commonMistakes: TheoryCommonMistake[];
  keyPointsToRemember: string[];
}
