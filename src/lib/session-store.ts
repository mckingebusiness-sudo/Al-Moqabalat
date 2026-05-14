import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  CandidateProfile,
  Evaluation,
  FinalReport,
  InterviewQuestion,
  InterviewSetup,
} from "./types";

type State = {
  sessionId: string;
  setup?: InterviewSetup;
  profile?: CandidateProfile;
  questions: InterviewQuestion[];
  answers: string[];
  evaluations: Evaluation[];
  currentIndex: number;
  finalReport?: FinalReport;
  setSetup: (s: InterviewSetup) => void;
  setProfile: (p: CandidateProfile) => void;
  addQuestion: (q: InterviewQuestion) => void;
  addQuestionAndAdvance: (q: InterviewQuestion, index: number) => void;
  startInterviewSession: (payload: {
    setup: InterviewSetup;
    profile: CandidateProfile;
    firstQuestion: InterviewQuestion;
  }) => void;
  addAnswer: (a: string) => void;
  addEvaluation: (e: Evaluation) => void;
  setCurrentIndex: (i: number) => void;
  setFinalReport: (r: FinalReport) => void;
  reset: () => void;
};

export const useSession = create<State>()(
  persist(
    (set) => ({
      sessionId: "",
      questions: [],
      answers: [],
      evaluations: [],
      currentIndex: 0,
      setSetup: (setup) => set({ setup }),
      setProfile: (profile) => set({ profile }),
      addQuestion: (q) => set((s) => ({ questions: [...s.questions, q] })),
      addQuestionAndAdvance: (q, currentIndex) =>
        set((s) => ({ questions: [...s.questions, q], currentIndex })),
      startInterviewSession: ({ setup, profile, firstQuestion }) =>
        set({
          sessionId: crypto.randomUUID(),
          setup,
          profile,
          questions: [firstQuestion],
          answers: [],
          evaluations: [],
          currentIndex: 0,
          finalReport: undefined,
        }),
      addAnswer: (a) => set((s) => ({ answers: [...s.answers, a] })),
      addEvaluation: (e) => set((s) => ({ evaluations: [...s.evaluations, e] })),
      setCurrentIndex: (currentIndex) => set({ currentIndex }),
      setFinalReport: (finalReport) => set({ finalReport }),
      reset: () =>
        set({
          sessionId: "",
          setup: undefined,
          profile: undefined,
          questions: [],
          answers: [],
          evaluations: [],
          currentIndex: 0,
          finalReport: undefined,
        }),
    }),
    {
      name: "ix-session",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : sessionStorage,
      ),
      skipHydration: true,
      partialize: (state) => ({
        sessionId: state.sessionId,
        setup: state.setup,
        profile: state.profile,
        questions: state.questions,
        answers: state.answers,
        evaluations: state.evaluations,
        currentIndex: state.currentIndex,
        finalReport: state.finalReport,
      }),
    },
  ),
);
