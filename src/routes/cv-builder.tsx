import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, Download, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GlassCard, GradientButton, GhostButton, FieldLabel, TextInput, TextArea, Select } from "@/components/UI";
import { useT, useLang } from "@/lib/i18n";
import { improveCv } from "@/lib/ai.functions";
import { downloadElementAsPdf } from "@/lib/pdf-export";
import type { CvData } from "@/lib/types";

export const Route = createFileRoute("/cv-builder")({
  head: () => ({
    meta: [
      { title: "CV Builder — InterviewX AI" },
      { name: "description", content: "Build a clean European-style CV in minutes." },
    ],
  }),
  component: CvBuilderPage,
});

const empty: CvData = {
  fullName: "",
  professionalTitle: "",
  phone: "",
  email: "",
  location: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  courses: [],
  projects: [],
  certificates: [],
};

const STEPS = ["personal", "summary", "experience", "education", "skills", "extras", "preview"] as const;
type Step = typeof STEPS[number];

function CvBuilderPage() {
  const t = useT();
  const { lang } = useLang();
  const [data, setData] = useState<CvData>(empty);
  const [step, setStep] = useState<Step>("personal");
  const [cvLang, setCvLang] = useState<"ar" | "en">(lang === "en" ? "en" : "ar");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [targetJob, setTargetJob] = useState("");
  const cvRef = useRef<HTMLDivElement>(null);
  const improve = useServerFn(improveCv);

  const stepIdx = STEPS.indexOf(step);
  const stepLabels: Record<Step, string> = {
    personal: t("step_personal"),
    summary: t("step_summary"),
    experience: t("step_experience"),
    education: t("step_education"),
    skills: t("step_skills"),
    extras: t("step_extras"),
    preview: t("step_preview"),
  };

  function update<K extends keyof CvData>(k: K, v: CvData[K]) {
    setData((p) => ({ ...p, [k]: v }));
  }

  async function runAi() {
    setAiError(null);
    setAiBusy(true);
    try {
      const res = await improve({
        data: { cvData: data, language: cvLang, targetJob: targetJob || undefined },
      });
      setData((p) => ({
        ...p,
        summary: res.professionalSummary || p.summary,
        experience: res.improvedExperience?.length
          ? p.experience.map((e, i) => ({
              ...e,
              description: res.improvedExperience[i]?.description || e.description,
            }))
          : p.experience,
        skills: Array.from(new Set([...(p.skills || []), ...(res.improvedSkills || [])])).slice(0, 30),
      }));
    } catch (e) {
      const m = (e as Error).message;
      setAiError(m.includes("LIMIT") ? t("err_limit") : t("err_temp"));
    } finally {
      setAiBusy(false);
    }
  }

  return (
    <AppShell>
      <section className="px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-5">
          <header className="text-center">
            <h1 className="text-3xl font-bold sm:text-4xl">{t("cv_title")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("cv_desc")}</p>
          </header>

          <div className="no-print flex flex-wrap items-center justify-center gap-2">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  step === s ? "btn-gradient" : "border border-border bg-background/40 text-muted-foreground hover:bg-accent"
                }`}
              >
                {i + 1}. {stepLabels[s]}
              </button>
            ))}
          </div>

          <GlassCard className="no-print space-y-4">
            {step === "personal" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("full_name")}><TextInput value={data.fullName} onChange={(e) => update("fullName", e.target.value)} /></Field>
                <Field label={t("prof_title")}><TextInput value={data.professionalTitle} onChange={(e) => update("professionalTitle", e.target.value)} /></Field>
                <Field label={t("email")}><TextInput type="email" value={data.email} onChange={(e) => update("email", e.target.value)} /></Field>
                <Field label={t("phone")}><TextInput value={data.phone} onChange={(e) => update("phone", e.target.value)} /></Field>
                <Field label={t("location")}><TextInput value={data.location} onChange={(e) => update("location", e.target.value)} /></Field>
              </div>
            )}

            {step === "summary" && (
              <Field label={t("summary")}>
                <TextArea rows={5} value={data.summary} onChange={(e) => update("summary", e.target.value.slice(0, 1500))} />
              </Field>
            )}

            {step === "experience" && (
              <div className="space-y-4">
                {data.experience.map((exp, i) => (
                  <div key={i} className="rounded-xl border border-border p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label={t("job_title")}><TextInput value={exp.title} onChange={(e) => mutateArr(setData, "experience", i, { ...exp, title: e.target.value })} /></Field>
                      <Field label={t("company")}><TextInput value={exp.company} onChange={(e) => mutateArr(setData, "experience", i, { ...exp, company: e.target.value })} /></Field>
                      <Field label={t("start_date")}><TextInput value={exp.startDate} onChange={(e) => mutateArr(setData, "experience", i, { ...exp, startDate: e.target.value })} /></Field>
                      <Field label={t("end_date")}><TextInput value={exp.endDate} onChange={(e) => mutateArr(setData, "experience", i, { ...exp, endDate: e.target.value })} /></Field>
                    </div>
                    <div className="mt-3">
                      <Field label={t("description")}>
                        <TextArea rows={3} value={exp.description} onChange={(e) => mutateArr(setData, "experience", i, { ...exp, description: e.target.value })} />
                      </Field>
                    </div>
                    <button onClick={() => removeArr(setData, "experience", i)} className="mt-2 inline-flex items-center gap-1 text-xs text-destructive">
                      <Trash2 className="h-3 w-3" /> {t("remove")}
                    </button>
                  </div>
                ))}
                <GhostButton onClick={() => update("experience", [...data.experience, { title: "", company: "", startDate: "", endDate: "", description: "" }])}>
                  <Plus className="h-4 w-4" /> {t("add")}
                </GhostButton>
              </div>
            )}

            {step === "education" && (
              <div className="space-y-4">
                {data.education.map((ed, i) => (
                  <div key={i} className="rounded-xl border border-border p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label={t("degree")}><TextInput value={ed.degree} onChange={(e) => mutateArr(setData, "education", i, { ...ed, degree: e.target.value })} /></Field>
                      <Field label={t("institution")}><TextInput value={ed.institution} onChange={(e) => mutateArr(setData, "education", i, { ...ed, institution: e.target.value })} /></Field>
                      <Field label={t("year")}><TextInput value={ed.year} onChange={(e) => mutateArr(setData, "education", i, { ...ed, year: e.target.value })} /></Field>
                      <Field label={t("details")}><TextInput value={ed.details} onChange={(e) => mutateArr(setData, "education", i, { ...ed, details: e.target.value })} /></Field>
                    </div>
                    <button onClick={() => removeArr(setData, "education", i)} className="mt-2 inline-flex items-center gap-1 text-xs text-destructive">
                      <Trash2 className="h-3 w-3" /> {t("remove")}
                    </button>
                  </div>
                ))}
                <GhostButton onClick={() => update("education", [...data.education, { degree: "", institution: "", year: "", details: "" }])}>
                  <Plus className="h-4 w-4" /> {t("add")}
                </GhostButton>
              </div>
            )}

            {step === "skills" && (
              <Field label={t("skills_label")}>
                <TextArea rows={3} value={data.skills.join(", ")} onChange={(e) => update("skills", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} />
              </Field>
            )}

            {step === "extras" && (
              <div className="space-y-4">
                <Field label={t("languages_label")}>
                  <TextInput value={data.languages.join(", ")} onChange={(e) => update("languages", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} />
                </Field>
                <Field label={t("courses_label")}>
                  <TextInput value={data.courses.join(", ")} onChange={(e) => update("courses", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} />
                </Field>
                <Field label={t("certificates_label")}>
                  <TextInput value={data.certificates.join(", ")} onChange={(e) => update("certificates", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} />
                </Field>
                <Field label={t("projects_label")}>
                  <TextInput value={data.projects.join(", ")} onChange={(e) => update("projects", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} />
                </Field>
              </div>
            )}

            {step === "preview" && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label={t("cv_lang")}>
                    <Select value={cvLang} onChange={(e) => setCvLang(e.target.value as "ar" | "en")}>
                      <option value="ar">{t("lang_ar")}</option>
                      <option value="en">{t("lang_en")}</option>
                    </Select>
                  </Field>
                  <Field label={t("target_job")}>
                    <TextInput value={targetJob} onChange={(e) => setTargetJob(e.target.value)} placeholder={t("target_job_ph")} />
                  </Field>
                  <div className="self-end">
                    <GhostButton onClick={runAi} disabled={aiBusy} className="w-full">
                      {aiBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      {aiBusy ? t("improving") : t("improve_ai")}
                    </GhostButton>
                  </div>
                </div>
                {aiError && <p className="text-sm text-destructive">{aiError}</p>}
                <p className="text-xs text-muted-foreground">{t("ai_optional")}</p>
              </div>
            )}

            {step !== "preview" && (
              <div className="flex justify-between gap-2 pt-2">
                <GhostButton
                  onClick={() => setStep(STEPS[Math.max(0, stepIdx - 1)])}
                  disabled={stepIdx === 0}
                >
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t("back")}
                </GhostButton>
                <GradientButton onClick={() => setStep(STEPS[Math.min(STEPS.length - 1, stepIdx + 1)])}>
                  {t("next")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </GradientButton>
              </div>
            )}
          </GlassCard>

          {step === "preview" && (
            <>
              <div className="no-print flex justify-center">
                <GradientButton
                  disabled={pdfBusy}
                  onClick={async () => {
                    if (!cvRef.current) return;
                    setPdfBusy(true);
                    try {
                      await downloadElementAsPdf(cvRef.current, `${data.fullName || "CV"}.pdf`);
                    } finally {
                      setPdfBusy(false);
                    }
                  }}
                >
                  {pdfBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {t("download_pdf")}
                </GradientButton>
              </div>
              <div ref={cvRef}>
                <CvPreview data={data} cvLang={cvLang} />
              </div>
            </>
          )}
        </div>
      </section>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </div>
  );
}

function mutateArr<K extends "experience" | "education">(
  setData: React.Dispatch<React.SetStateAction<CvData>>,
  key: K,
  idx: number,
  value: CvData[K][number],
) {
  setData((p) => {
    const arr = [...p[key]] as CvData[K];
    (arr as unknown[])[idx] = value;
    return { ...p, [key]: arr };
  });
}

function removeArr<K extends "experience" | "education">(
  setData: React.Dispatch<React.SetStateAction<CvData>>,
  key: K,
  idx: number,
) {
  setData((p) => {
    const arr = (p[key] as unknown[]).filter((_, i) => i !== idx) as CvData[K];
    return { ...p, [key]: arr };
  });
}

function CvPreview({ data, cvLang }: { data: CvData; cvLang: "ar" | "en" }) {
  const labels = cvLang === "ar"
    ? { contact: "بيانات التواصل", summary: "نبذة شخصية", exp: "الخبرات المهنية", edu: "التعليم والتدريب", skills: "المهارات", langs: "اللغات", courses: "الدورات", certs: "الشهادات", projects: "المشاريع" }
    : { contact: "Contact", summary: "Personal Profile", exp: "Work Experience", edu: "Education & Training", skills: "Skills", langs: "Languages", courses: "Courses", certs: "Certificates", projects: "Projects" };

  return (
    <div
      dir={cvLang === "ar" ? "rtl" : "ltr"}
      className="mx-auto max-w-3xl bg-white p-10 text-black shadow-2xl print:shadow-none print:p-8"
      style={{
        fontFamily: cvLang === "ar" ? "var(--font-arabic)" : "Georgia, 'Times New Roman', serif",
        minHeight: "1000px",
        colorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
      } as React.CSSProperties}
    >
      {/* Header — name + contact, classic Europass black & white */}
      <header className="border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-wide text-black">{data.fullName || "—"}</h1>
        {data.professionalTitle && (
          <p className="mt-1 text-base text-black">{data.professionalTitle}</p>
        )}
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-black">
          {data.email && <li>{cvLang === "ar" ? "البريد:" : "Email:"} {data.email}</li>}
          {data.phone && <li>{cvLang === "ar" ? "الهاتف:" : "Phone:"} {data.phone}</li>}
          {data.location && <li>{cvLang === "ar" ? "الموقع:" : "Address:"} {data.location}</li>}
        </ul>
      </header>

      {data.summary && (
        <Block title={labels.summary} cvLang={cvLang}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-black">{data.summary}</p>
        </Block>
      )}

      {data.experience.length > 0 && (
        <Block title={labels.exp} cvLang={cvLang}>
          <div className="space-y-4">
            {data.experience.map((e, i) => (
              <article key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-bold text-black">{e.title}</p>
                  <p className="text-xs text-black">{[e.startDate, e.endDate].filter(Boolean).join(" — ")}</p>
                </div>
                <p className="text-sm italic text-black">{e.company}</p>
                {e.description && (
                  <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-black">{e.description}</p>
                )}
              </article>
            ))}
          </div>
        </Block>
      )}

      {data.education.length > 0 && (
        <Block title={labels.edu} cvLang={cvLang}>
          <div className="space-y-3">
            {data.education.map((e, i) => (
              <article key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-bold text-black">{e.degree}</p>
                  {e.year && <p className="text-xs text-black">{e.year}</p>}
                </div>
                <p className="text-sm italic text-black">{e.institution}</p>
                {e.details && <p className="mt-1 text-sm text-black">{e.details}</p>}
              </article>
            ))}
          </div>
        </Block>
      )}

      {data.skills.length > 0 && (
        <Block title={labels.skills} cvLang={cvLang}>
          <p className="text-sm text-black">{data.skills.join(" • ")}</p>
        </Block>
      )}

      {data.languages.length > 0 && (
        <Block title={labels.langs} cvLang={cvLang}>
          <p className="text-sm text-black">{data.languages.join(" • ")}</p>
        </Block>
      )}

      {data.courses.length > 0 && (
        <Block title={labels.courses} cvLang={cvLang}>
          <ul className="list-disc ps-5 text-sm text-black space-y-1">
            {data.courses.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </Block>
      )}

      {data.certificates.length > 0 && (
        <Block title={labels.certs} cvLang={cvLang}>
          <ul className="list-disc ps-5 text-sm text-black space-y-1">
            {data.certificates.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </Block>
      )}

      {data.projects.length > 0 && (
        <Block title={labels.projects} cvLang={cvLang}>
          <ul className="list-disc ps-5 text-sm text-black space-y-1">
            {data.projects.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </Block>
      )}
    </div>
  );
}

function Block({ title, children, cvLang }: { title: string; children: React.ReactNode; cvLang: "ar" | "en" }) {
  return (
    <section className="mt-5">
      <h2
        className="mb-2 border-b border-black pb-1 text-xs font-bold uppercase tracking-[0.2em] text-black"
        style={{ fontFamily: cvLang === "ar" ? "var(--font-arabic)" : "Georgia, 'Times New Roman', serif" }}
      >
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}
