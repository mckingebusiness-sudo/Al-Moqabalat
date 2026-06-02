import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ApplicationStatus = "wishlist" | "applied" | "interview" | "offer" | "rejected";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  url: string;
  status: ApplicationStatus;
  dateApplied: string;
  notes: string;
  followUpDate?: string;
  // AI related fields
  jobDescription?: string;
  aiDiagnosis?: {
    gaps: string[];
    questionsForRecruiter: string[];
    followUpEmailDraft?: string;
  };
}

interface ApplicationState {
  masterCv: string;
  setMasterCv: (cv: string) => void;
  applications: JobApplication[];
  addApplication: (app: Omit<JobApplication, "id" | "dateApplied">) => void;
  updateApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteApplication: (id: string) => void;
  setAiDiagnosis: (id: string, diagnosis: JobApplication["aiDiagnosis"]) => void;
  clearAll: () => void;
}

export const useAppStore = create<ApplicationState>()(
  persist(
    (set) => ({
      masterCv: "",
      setMasterCv: (cv) => set({ masterCv: cv }),
      applications: [],
      addApplication: (app) =>
        set((state) => ({
          applications: [
            ...state.applications,
            {
              ...app,
              id: crypto.randomUUID(),
              dateApplied: new Date().toISOString(),
            },
          ],
        })),
      updateApplication: (id, updates) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, ...updates } : app
          ),
        })),
      deleteApplication: (id) =>
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
        })),
      setAiDiagnosis: (id, diagnosis) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, aiDiagnosis: diagnosis } : app
          ),
        })),
      clearAll: () => set({ applications: [] }),
    }),
    {
      name: "ix-applications",
    }
  )
);
