import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, Play, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GlassCard, GradientButton, GhostButton, FieldLabel, TextInput, TextArea, Select } from "@/components/UI";
import { useT, useLang } from "@/lib/i18n";
import { useSession } from "@/lib/session-store";
import { startInterview } from "@/lib/ai.functions";
import { extractTextFromFile } from "@/lib/pdf-parse.client";
import type { ApplicationContext, Language } from "@/lib/types";

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
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [cvParsing, setCvParsing] = useState(false);
  const [language, setLanguage] = useState<Language>(lang === "en" ? "en" : "ar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File | null) {
    if (!file) return;
    setError(null);
    setCvFileName(file.name);
    setCvParsing(true);
    try {
      const text = await extractTextFromFile(file);
      setCvText(text.slice(0, 12000));
    } catch {
      setError(t("cv_parse_error"));
      setCvFileName(null);
    } finally {
      setCvParsing(false);
    }
  }

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
        interviewType: "balanced" as const,
        totalQuestions: 8 as const,
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
              <FieldLabel>{t("cv_upload_label")}</FieldLabel>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background/30 px-4 py-4 text-sm transition hover:border-primary/60 hover:bg-accent/40"
              >
                {cvParsing ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : cvFileName ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Upload className="h-4 w-4 text-primary" />
                )}
                <span className="font-medium">
                  {cvParsing
                    ? t("cv_parsing")
                    : cvFileName
                      ? `${t("cv_loaded")} — ${cvFileName}`
                      : t("cv_upload_hint")}
                </span>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.txt,application/pdf,text/plain"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
              <TextArea
                rows={4}
                value={cvText}
                onChange={(e) => setCvText(e.target.value.slice(0, 12000))}
                placeholder={lang === "ar" ? "أو الصق نص الـ CV هنا…" : "Or paste CV text here…"}
              />
              {cvText.length > 0 && (
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{cvText.length}/12000</span>
                  {cvFileName && (
                    <GhostButton
                      onClick={() => {
                        setCvText("");
                        setCvFileName(null);
                      }}
                    >
                      {lang === "ar" ? "مسح" : "Clear"}
                    </GhostButton>
                  )}
                </div>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
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
              <div>
                <FieldLabel>{t("questions_count")}</FieldLabel>
                <Select
                  value={String(totalQuestions)}
                  onChange={(e) => setTotalQuestions(Number(e.target.value) as 5 | 8 | 10)}
                >
                  <option value="8">{t("q_standard")}</option>
                  <option value="5">{t("q_quick")}</option>
                  <option value="10">{lang === "ar" ? "كاملة (10)" : "Full (10)"}</option>
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
