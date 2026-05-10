export type Language = "ar" | "en" | "mixed";

export type ApplicationContext = {
  candidateName?: string;
  experienceLevel?: string;
  education?: string;
  mainSkills?: string;
  targetJob: string;
  targetCompany?: string;
  companyType?: string;
  jobDescription?: string;
  motivation?: string;
};

export type InterviewType =
  | "friendly_hr"
  | "strict_hr"
  | "technical"
  | "behavioral"
  | "fresh_graduate"
  | "career_change";

export type CandidateProfile = {
  candidateName?: string;
  estimatedLevel?: string;
  targetJob?: string;
  candidateSummary?: string;
  strengthsForThisJob?: string[];
  weaknessesForThisJob?: string[];
  interviewFocus?: string[];
  suggestedQuestionTopics?: string[];
  jobFitScore?: number;
};

export type InterviewQuestion = {
  question: string;
  questionType?: string;
  whyThisQuestion?: string;
  expectedGoodAnswerPoints?: string[];
};

export type Evaluation = {
  score: number;
  shortFeedback: string;
  strengths: string[];
  weaknesses: string[];
  improvedAnswer: string;
  practicalAdvice: string;
  nextTip: string;
};

export type FinalReport = {
  overallScore: number;
  verdict: string;
  topStrengths: string[];
  topWeaknesses: string[];
  mostImportantImprovements: string[];
  recommendedPracticePlan: string[];
  bestAnswerTemplate: string;
  cvImprovementTips: string[];
  nextInterviewTips: string[];
};

export type CvData = {
  fullName: string;
  professionalTitle: string;
  phone?: string;
  email?: string;
  location?: string;
  summary?: string;
  experience: Array<{
    title: string;
    company: string;
    startDate?: string;
    endDate?: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year?: string;
    details?: string;
  }>;
  skills: string[];
  languages: string[];
  courses: string[];
  projects: string[];
  certificates: string[];
};

export type InterviewSetup = {
  applicationContext: ApplicationContext;
  cvText?: string;
  language: Language;
  interviewType: InterviewType;
  totalQuestions: 5;
};
