import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Copy,
  FileText,
  Loader2,
  Sparkles,
  Upload,
  Wand2,
  AlertOctagon,
  Info,
  Lightbulb,
  Check,
  ListFilter
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  GlassCard,
  GradientButton,
  GhostButton,
  FieldLabel,
  TextInput,
  TextArea,
  Select,
  ToolHelp,
} from "@/components/UI";
import { Reveal, PageFade } from "@/components/Motion";
import { useT, useLang } from "@/lib/i18n";
import { analyzeCv, type CvAnalysis } from "@/lib/ai.functions";
import { extractTextFromFile } from "@/lib/pdf-parse";
import { MAX_CV_CHARS } from "@/lib/constants";

export const Route = createFileRoute("/cv-improve")({
  head: () => ({
    meta: [
      { title: "Improve CV with AI — InterviewX AI" },
      {
        name: "description",
        content:
          "Upload your CV (PDF or text) and get instant AI feedback: real flaws found, weak phrases rewritten, and a fully improved version.",
      },
    ],
  }),
  component: CvImprovePage,
});

function CvImprovePage() {
  const t = useT();
  const { lang } = useLang();
  const [cvText, setCvText] = useState("");
  const [targetJob, setTargetJob] = useState("");
  const [aiLang, setAiLang] = useState<"ar" | "en">(lang === "en" ? "en" : "ar");
  const [busy, setBusy] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<CvAnalysis | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<"all" | "high" | "medium" | "low">("all");
  const [resolvedFlaws, setResolvedFlaws] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const analyze = useServerFn(analyzeCv);

  async function onFile(file: File | null) {
    if (!file) return;
    setError(null);
    
    if (file.size > 5 * 1024 * 1024) {
      setError(lang === "ar" ? "حجم الملف كبير جداً (الحد الأقصى 5 ميجابايت)." : "File size is too large (max 5MB).");
      return;
    }
    
    const validTypes = ["application/pdf", "text/plain"];
    if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.txt')) {
      setError(lang === "ar" ? "نوع الملف غير مدعوم (فقط PDF أو TXT)." : "Unsupported file type (PDF or TXT only).");
      return;
    }

    setFileName(file.name);
    setParsing(true);
    try {
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length < 30) {
        setError(t("cvi_err_empty"));
        return;
      }
      setCvText(text.slice(0, MAX_CV_CHARS));
    } catch (e) {
      const msg = (e as Error).message || "";
      if (msg.includes("PDF_TOO_SHORT")) {
        setError(lang === "ar"
          ? "الـ PDF ده ممكن يكون صورة — رفّع نسخة text-based أو Word."
          : "This PDF might be image-based — upload a text-based PDF or Word.");
      } else {
        setError(t("cvi_err_file"));
      }
    } finally {
      setParsing(false);
    }
  }

  async function onAnalyze() {
    if (cvText.trim().length < 30) {
      setError(t("cvi_err_short"));
      return;
    }
    setError(null);
    setBusy(true);
    setResult(null);
    setResolvedFlaws([]);
    setFilterSeverity("all");
    try {
      const res = await analyze({
        data: {
          cvText: cvText.trim(),
          language: aiLang,
          targetJob: targetJob.trim() || undefined,
        },
      });
      setResult(res);
      setTimeout(() => {
        document.getElementById("cv-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (e) {
      const m = (e as Error).message;
      setError(m.includes("LIMIT") ? t("err_limit") : t("err_temp"));
    } finally {
      setBusy(false);
    }
  }

  function copy(text: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }

  return (
    <AppShell>
      <PageFade>
        <section className="px-4 pt-10 pb-6 sm:pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-1.5 text-xs font-medium backdrop-blur"
            >
              <Wand2 className="h-3.5 w-3.5 text-primary" />
              {t("cvi_badge")}
            </motion.div>
            <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              <span className="text-gradient-animated">{t("cvi_title")}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-foreground/80">{t("cvi_sub")}</p>
          </div>
        </section>
      </PageFade>

      <section className="px-4 pb-10">
        <ToolHelp>
          {lang === "ar" ? "ارفع سيرتك الذاتية أو الصق النص، وسيقوم الذكاء الاصطناعي بتحليلها واكتشاف نقاط الضعف وصياغة الكلمات بشكل أفضل، وتجهيز نسخة محسنة بالكامل." : "Upload your CV or paste the text. AI will analyze it, detect weaknesses, rewrite weak phrases, and generate a fully improved version."}
        </ToolHelp>
        <div className="mx-auto max-w-4xl">
          <GlassCard className="space-y-5">
            <div>
              <FieldLabel>{t("cvi_upload")}</FieldLabel>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="group flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-background/30 px-6 py-8 text-center transition hover:border-primary/60 hover:bg-accent/40"
              >
                {parsing ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : (
                  <Upload className="h-8 w-8 text-primary transition group-hover:scale-110" />
                )}
                <p className="text-sm font-medium">
                  {fileName ? fileName : t("cvi_upload_hint")}
                </p>
                <p className="text-xs text-muted-foreground">{t("cvi_upload_types")}</p>
              </button>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.txt,application/pdf,text/plain"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="text-center text-xs uppercase tracking-wider text-muted-foreground">
              {t("cvi_or_paste")}
            </div>

            <div>
              <FieldLabel>{t("cvi_text_label")}</FieldLabel>
              <TextArea
                rows={8}
                value={cvText}
                onChange={(e) => setCvText(e.target.value.slice(0, MAX_CV_CHARS))}
                placeholder={t("cvi_text_ph")}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {cvText.length}/{MAX_CV_CHARS}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>{t("cvi_target")}</FieldLabel>
                <TextInput
                  value={targetJob}
                  onChange={(e) => setTargetJob(e.target.value)}
                  placeholder={t("target_job_ph")}
                />
              </div>
              <div>
                <FieldLabel>{t("cvi_lang")}</FieldLabel>
                <Select value={aiLang} onChange={(e) => setAiLang(e.target.value as "ar" | "en")}>
                  <option value="ar">{t("lang_ar")}</option>
                  <option value="en">{t("lang_en")}</option>
                </Select>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <GradientButton onClick={onAnalyze} disabled={busy || parsing} className="w-full">
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {t("cvi_analyzing")}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> {t("cvi_analyze")}
                </>
              )}
            </GradientButton>
          </GlassCard>

          {result && (
            <div id="cv-result" className="mt-8 space-y-5">
              <Reveal>
                <GlassCard>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <ScoreBox label={t("cvi_overall")} value={result.overallScore} />
                    <ScoreBox label={t("cvi_ats")} value={result.atsScore} />
                    <div className="rounded-xl border border-border bg-background/40 p-4">
                      <p className="text-xs font-medium text-muted-foreground">
                        {t("cvi_verdict")}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed">{result.shortVerdict}</p>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>

              {(result.flaws ?? []).length > 0 && (
                <Reveal>
                  <GlassCard className="p-0 overflow-hidden">
                    <div className="bg-background/40 p-5 sm:p-6 border-b border-border">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <AlertTriangle className="h-6 w-6 text-amber-500" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold">{t("cvi_flaws")}</h2>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {lang === "ar" ? "حددنا هذه النقاط كأخطاء تضعف سيرتك الذاتية." : "We identified these points as weaknesses."}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => setFilterSeverity("all")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${filterSeverity === "all" ? "bg-primary/20 text-primary border-primary/30" : "bg-background/30 border-border text-foreground/70 hover:bg-background/50"}`}
                          >
                            {lang === "ar" ? "الكل" : "All"} <span className="opacity-70 ml-1">({result.flaws.length})</span>
                          </button>
                          <button
                            onClick={() => setFilterSeverity("high")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${filterSeverity === "high" ? "bg-destructive/20 text-destructive border-destructive/30" : "bg-background/30 border-border text-foreground/70 hover:bg-background/50"}`}
                          >
                            {lang === "ar" ? "حرج" : "High"} <span className="opacity-70 ml-1">({result.flaws.filter(f => f.severity === "high").length})</span>
                          </button>
                          <button
                            onClick={() => setFilterSeverity("medium")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${filterSeverity === "medium" ? "bg-amber-500/20 text-amber-500 border-amber-500/30" : "bg-background/30 border-border text-foreground/70 hover:bg-background/50"}`}
                          >
                            {lang === "ar" ? "متوسط" : "Medium"} <span className="opacity-70 ml-1">({result.flaws.filter(f => f.severity === "medium").length})</span>
                          </button>
                          <button
                            onClick={() => setFilterSeverity("low")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${filterSeverity === "low" ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" : "bg-background/30 border-border text-foreground/70 hover:bg-background/50"}`}
                          >
                            {lang === "ar" ? "بسيط" : "Low"} <span className="opacity-70 ml-1">({result.flaws.filter(f => f.severity === "low").length})</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 bg-background/20">
                      <div className="grid gap-4">
                        {(result.flaws ?? [])
                          .map((f, i) => ({ ...f, originalIndex: i }))
                          .filter(f => filterSeverity === "all" || f.severity === filterSeverity)
                          .map((f) => {
                            const isResolved = resolvedFlaws.includes(f.originalIndex);
                            const toggleResolve = () => {
                              setResolvedFlaws(prev => prev.includes(f.originalIndex) ? prev.filter(id => id !== f.originalIndex) : [...prev, f.originalIndex]);
                            };
                            
                            const severityStyles = {
                              high: { border: "border-destructive/30", bg: "bg-destructive/5", iconText: "text-destructive", iconBg: "bg-destructive/10" },
                              medium: { border: "border-amber-500/30", bg: "bg-amber-500/5", iconText: "text-amber-500", iconBg: "bg-amber-500/10" },
                              low: { border: "border-emerald-500/30", bg: "bg-emerald-500/5", iconText: "text-emerald-500", iconBg: "bg-emerald-500/10" },
                            };
                            const s = severityStyles[f.severity] || severityStyles.medium;
                            
                            return (
                              <motion.div 
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: isResolved ? 0.6 : 1, y: 0 }}
                                key={f.originalIndex} 
                                className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${isResolved ? 'border-border bg-background/20 grayscale-[0.3]' : `${s.border} ${s.bg} shadow-sm`}`}
                              >
                                {isResolved && (
                                  <div className="absolute inset-0 z-0 bg-background/40 pointer-events-none" />
                                )}
                                
                                <div className="relative z-10 flex flex-col sm:flex-row gap-5 p-5">
                                  {/* Icon & Toggle */}
                                  <div className="flex shrink-0 flex-row sm:flex-col items-center justify-between sm:justify-start gap-4">
                                    <div className={`p-3 rounded-full border ${isResolved ? 'border-border bg-muted text-muted-foreground' : `${s.iconBg} ${s.border} ${s.iconText}`}`}>
                                      {f.severity === 'high' ? <AlertOctagon className="h-5 w-5" /> : f.severity === 'medium' ? <AlertTriangle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                                    </div>
                                    
                                    <button
                                      onClick={toggleResolve}
                                      className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-all sm:h-10 sm:w-10 sm:justify-center sm:px-0 sm:text-transparent ${
                                        isResolved 
                                          ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] border-transparent hover:bg-emerald-600" 
                                          : "bg-background border border-border text-foreground hover:border-primary/50 hover:bg-accent"
                                      }`}
                                      title={isResolved ? "Mark as unresolved" : "Mark as resolved"}
                                    >
                                      <Check className={`h-4 w-4 ${isResolved ? 'sm:text-white' : 'sm:text-foreground'}`} strokeWidth={3} />
                                      <span className="sm:hidden">{isResolved ? (lang === "ar" ? "تم الحل" : "Resolved") : (lang === "ar" ? "حل؟" : "Fix?")}</span>
                                    </button>
                                  </div>
                                  
                                  {/* Content */}
                                  <div className="flex-1 space-y-4">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`text-lg font-bold leading-tight ${isResolved ? 'line-through decoration-muted-foreground/40' : ''}`}>
                                          {f.title}
                                        </h3>
                                        <SeverityChip s={f.severity} />
                                      </div>
                                      <p className="text-sm text-foreground/80 leading-relaxed">{f.explanation}</p>
                                    </div>
                                    
                                    <div className={`rounded-xl p-4 border transition-colors ${isResolved ? 'bg-background/30 border-border/50' : 'bg-primary/5 border-primary/20 shadow-[inset_0_1px_4px_rgba(0,0,0,0.03)]'}`}>
                                      <div className="flex items-start gap-3">
                                        <Lightbulb className={`h-5 w-5 shrink-0 mt-0.5 ${isResolved ? 'text-muted-foreground' : 'text-primary'}`} />
                                        <div>
                                          <p className="text-xs font-bold uppercase tracking-wider mb-1 text-primary/80">
                                            {t("cvi_fix")}
                                          </p>
                                          <p className="text-sm font-medium leading-relaxed">
                                            {f.fix}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                          
                        {(result.flaws ?? []).filter(f => filterSeverity === "all" || f.severity === filterSeverity).length === 0 && (
                          <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-xl">
                            <CheckCircle2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                            <p>{lang === "ar" ? "لا توجد عيوب بهذا التصنيف." : "No flaws found in this category."}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </Reveal>
              )}

              {(result.weakPhrases ?? []).length > 0 && (
                <Reveal>
                  <GlassCard>
                    <h2 className="mb-3 text-lg font-bold">{t("cvi_weak")}</h2>
                    <div className="space-y-3">
                      {(result.weakPhrases ?? []).map((w, i) => (
                        <div key={i} className="grid gap-2 rounded-xl border border-border bg-background/30 p-3 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-medium text-destructive">{t("cvi_before")}</p>
                            <p className="mt-1 text-sm line-through opacity-80">{w.original}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-emerald-500">{t("cvi_after")}</p>
                            <p className="mt-1 text-sm font-medium">{w.better}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </Reveal>
              )}

              {(result.missingSections ?? []).length > 0 && (
                <Reveal>
                  <GlassCard>
                    <h2 className="mb-3 text-lg font-bold">{t("cvi_missing")}</h2>
                    <ul className="flex flex-wrap gap-2">
                      {(result.missingSections ?? []).map((m, i) => (
                        <li
                          key={i}
                          className="rounded-full border border-border bg-background/40 px-3 py-1 text-xs font-medium"
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </Reveal>
              )}

              {result.improvedSummary && (
                <Reveal>
                  <GlassCard>
                    <div className="mb-2 flex items-center justify-between">
                      <h2 className="flex items-center gap-2 text-lg font-bold">
                        <Sparkles className="h-5 w-5 text-primary" />
                        {t("cvi_new_summary")}
                      </h2>
                      <GhostButton onClick={() => copy(result.improvedSummary)}>
                        <Copy className="h-4 w-4" />
                      </GhostButton>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.improvedSummary}</p>
                  </GlassCard>
                </Reveal>
              )}

              {result.improvedFullCv && (
                <Reveal>
                  <GlassCard>
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="flex items-center gap-2 text-lg font-bold">
                        <FileText className="h-5 w-5 text-primary" />
                        {t("cvi_full")}
                      </h2>
                      <GhostButton onClick={() => copy(result.improvedFullCv)}>
                        <Copy className="h-4 w-4" /> {t("cvi_copy")}
                      </GhostButton>
                    </div>
                    <pre
                      dir={aiLang === "ar" ? "rtl" : "ltr"}
                      className="whitespace-pre-wrap rounded-xl border border-border bg-background/40 p-4 text-sm leading-relaxed font-sans"
                    >
                      {result.improvedFullCv}
                    </pre>
                  </GlassCard>
                </Reveal>
              )}

              {(result.topActionItems ?? []).length > 0 && (
                <Reveal>
                  <GlassCard>
                    <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      {t("cvi_actions")}
                    </h2>
                    <ul className="space-y-2">
                      {(result.topActionItems ?? []).map((a, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                            {i + 1}
                          </span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </Reveal>
              )}

              <Reveal>
                <GlassCard>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">{t("cvi_next_cta")}</p>
                    <Link to="/interview">
                      <GradientButton>
                        {t("cvi_go_interview")}{" "}
                        <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                      </GradientButton>
                    </Link>
                  </div>
                </GlassCard>
              </Reveal>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}

function ScoreBox({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 10) * 100));
  const color = value >= 8 ? "text-emerald-500" : value >= 6 ? "text-primary" : value >= 4 ? "text-amber-500" : "text-destructive";
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={`mt-1 text-3xl font-extrabold ${color}`}>{value.toFixed(1)}<span className="text-base text-muted-foreground">/10</span></p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full btn-gradient transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SeverityChip({ s }: { s: "high" | "medium" | "low" }) {
  const t = useT();
  const map = {
    high: { cls: "bg-destructive/15 text-destructive border-destructive/30", label: t("sev_high") },
    medium: { cls: "bg-amber-500/15 text-amber-600 border-amber-500/30", label: t("sev_med") },
    low: { cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", label: t("sev_low") },
  } as const;
  const it = map[s];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${it.cls}`}>
      {it.label}
    </span>
  );
}
