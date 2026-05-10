import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Play } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GlassCard, GradientButton, FieldLabel, TextInput, TextArea, Select } from "@/components/UI";
import { useT, useLang } from "@/lib/i18n";
import { useSession } from "@/lib/session-store";
import { startInterview } from "@/lib/ai.functions";
import type { ApplicationContext, InterviewType, Language } from "@/lib/types";

export const Route = createFileRoute("/interview")({
  head: () => ({
    meta: [
      { title: "AI Mock Interview — InterviewX AI" },
      { name: "description", content: "Practice realistic interviews for any job with AI feedback." },
    ],
  }),
  component: InterviewRouteShell,
});

function InterviewRouteShell() {
  const location = useLocation();
  if (location.pathname !== "/interview") return <Outlet />;
  return <InterviewSetupPage />;
}

function InterviewSetupPage() {
  const t = useT();
  const { lang } = useLang();
  const navigate = useNavigate();
  const session = useSession();
  const start = useServerFn(startInterview);

  const [form, setForm] = useState<ApplicationContext>({
    candidateName: "",
    experienceLevel: "",
    education: "",
    mainSkills: "",
    targetJob: "",
    targetCompany: "",
    companyType: "",
    jobDescription: "",
    motivation: "",
  });
  const [cvText, setCvText] = useState("");
  const [language, setLanguage] = useState<Language>(lang === "en" ? "en" : "ar");
  const [interviewType, setInterviewType] = useState<InterviewType>("friendly_hr");
  const totalQuestions = 5 as const;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ApplicationContext>(k: K, v: ApplicationContext[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  async function onStart() {
    if (!form.targetJob.trim()) {
      setError(lang === "ar" ? "اكتب الوظيفة المستهدفة" : "Please enter the target job");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const setup = {
        applicationContext: form,
        cvText: cvText.trim() || undefined,
        language,
        interviewType,
        totalQuestions,
      };
      const res = await start({
        data: setup,
      });
      session.startInterviewSession({
        setup,
        profile: res.profile,
        firstQuestion: res.firstQuestion,
      });
      navigate({ to: "/interview/session" });
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.includes("RATE_LIMIT") || msg.includes("DAILY_TOKEN_LIMIT")) {
        setError(t("err_limit"));
      } else {
        setError(t("err_temp"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <section className="px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-bold sm:text-4xl">{t("setup_title")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("setup_desc")}</p>
          </header>

          <GlassCard className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>{t("candidate_name")}</FieldLabel>
                <TextInput value={form.candidateName} onChange={(e) => set("candidateName", e.target.value)} />
              </div>
              <div>
                <FieldLabel>{t("experience_level")}</FieldLabel>
                <Select value={form.experienceLevel} onChange={(e) => set("experienceLevel", e.target.value)}>
                  <option value="">—</option>
                  <option value="no_experience">{t("exp_none")}</option>
                  <option value="fresh_graduate">{t("exp_fresh")}</option>
                  <option value="junior">{t("exp_junior")}</option>
                  <option value="mid">{t("exp_mid")}</option>
                  <option value="senior">{t("exp_senior")}</option>
                </Select>
              </div>
              <div>
                <FieldLabel>{t("education")}</FieldLabel>
                <TextInput value={form.education} onChange={(e) => set("education", e.target.value)} />
              </div>
              <div>
                <FieldLabel>{t("main_skills")}</FieldLabel>
                <TextInput value={form.mainSkills} onChange={(e) => set("mainSkills", e.target.value)} />
              </div>
            </div>
            <div>
              <FieldLabel>{t("target_job")}</FieldLabel>
              <TextInput
                value={form.targetJob}
                onChange={(e) => set("targetJob", e.target.value)}
                placeholder={lang === "ar" ? "مثال: كاشير، فني صيانة، محاسب، Frontend Developer" : "Example: Cashier, Technician, Accountant, Frontend Developer"}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>{t("target_company")}</FieldLabel>
                <TextInput value={form.targetCompany} onChange={(e) => set("targetCompany", e.target.value)} />
              </div>
              <div>
                <FieldLabel>{t("company_type")}</FieldLabel>
                <TextInput value={form.companyType} onChange={(e) => set("companyType", e.target.value)} />
              </div>
            </div>
            <div>
              <FieldLabel>{t("job_description")}</FieldLabel>
              <TextArea rows={3} value={form.jobDescription} onChange={(e) => set("jobDescription", e.target.value)} />
            </div>
            <div>
              <FieldLabel>{t("motivation")}</FieldLabel>
              <TextArea rows={2} value={form.motivation} onChange={(e) => set("motivation", e.target.value)} />
            </div>
            <div>
              <FieldLabel>{t("cv_optional")}</FieldLabel>
              <TextArea
                rows={5}
                value={cvText}
                onChange={(e) => setCvText(e.target.value.slice(0, 12000))}
                placeholder={lang === "ar" ? "الصق نص الـ CV هنا…" : "Paste CV text here…"}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>{t("language_label")}</FieldLabel>
                <Select value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
                  <option value="ar">{t("lang_ar")}</option>
                  <option value="en">{t("lang_en")}</option>
                  <option value="mixed">{t("lang_mixed")}</option>
                </Select>
              </div>
              <div>
                <FieldLabel>{t("interview_type")}</FieldLabel>
                <Select value={interviewType} onChange={(e) => setInterviewType(e.target.value as InterviewType)}>
                  <option value="friendly_hr">{t("type_friendly")}</option>
                  <option value="strict_hr">{t("type_strict")}</option>
                  <option value="technical">{t("type_technical")}</option>
                  <option value="behavioral">{t("type_behavioral")}</option>
                  <option value="fresh_graduate">{t("type_fresh")}</option>
                  <option value="career_change">{t("type_career")}</option>
                </Select>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <GradientButton onClick={onStart} disabled={loading} className="w-full">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {t("preparing")}</> : <><Play className="h-4 w-4" /> {t("start_interview")}</>}
            </GradientButton>
          </GlassCard>
        </div>
      </section>
    </AppShell>
  );
}
