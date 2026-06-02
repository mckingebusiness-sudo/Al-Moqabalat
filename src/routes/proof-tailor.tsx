import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useLang, useT } from "../lib/i18n";
import { runProofTailor } from "../lib/proof-tailor.functions";
import { AppShell } from "../components/AppShell";
import { PageFade } from "../components/Motion";
import { GradientButton, GlassCard, Pill, ScoreRing, ToolHelp } from "../components/UI";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/proof-tailor")({
  component: ProofTailorPage,
});

function ProofTailorPage() {
  const t = useT();
  const { lang } = useLang();
  const [masterCv, setMasterCv] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    if (!masterCv || !jobDescription || !targetRole) {
      toast.error(
        lang === "ar"
          ? "الرجاء إدخال السيرة الذاتية ووصف الوظيفة والمسمى الوظيفي"
          : "Please enter your CV, Job Description, and Target Role"
      );
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await runProofTailor({
        data: {
          masterCv,
          jobDescription,
          targetRole,
          language: lang,
        },
      });

      if (res.finalWarning && res.fitScore === 0) {
        throw new Error(res.finalWarning);
      }
      setResult(res);
      toast.success(
        lang === "ar" ? "تم التحليل بنجاح!" : "Analysis complete!"
      );
    } catch (error: any) {
      const msg = error?.message || (lang === "ar" ? "حدث خطأ" : "Error occurred");
      if (msg === "RATE_LIMIT") {
        toast.error(
          lang === "ar"
            ? "لقد تجاوزت الحد اليومي. حاول غداً."
            : "Daily limit reached. Try again tomorrow."
        );
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <PageFade>
        <section className="px-4 pt-10 pb-6 sm:pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-1.5 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {lang === "ar" ? "تفصيل السيرة الذاتية بالدليل" : "Proof-Based Tailor"}
            </div>
            <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              <span className="text-gradient-animated">
                {lang === "ar" ? "حلل الوظيفة ضد سيرتك" : "Audit your CV against a job"}
              </span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-foreground/80">
              {lang === "ar"
                ? "قبل أي تعديل. بدون كذب أو هلوسة."
                : "with evidence before rewriting. No hallucinated experience."}
            </p>
          </div>
        </section>

        <section className="px-4 pb-10">
          <ToolHelp>
            {lang === "ar"
              ? "هذه الأداة تقوم بمقارنة سيرتك الذاتية الحالية مع الوصف الوظيفي للوظيفة التي ترغب في التقديم عليها. ستكتشف الأداة المهارات الناقصة، وتؤكد على خبراتك الموجودة مسبقاً بطريقة تتوافق مع متطلبات الوظيفة. فقط أدخل المسمى الوظيفي، انسخ وصف الوظيفة، والصق سيرتك الذاتية، ثم اضغط على 'حلل بالدليل'."
              : "This tool compares your current CV with the job description you want to apply for. It will find missing skills and emphasize your existing experience to match the job requirements. Just enter the target role, paste the job description, paste your CV, and click 'Analyze with Proof'."}
          </ToolHelp>
          <div className={`mx-auto max-w-7xl grid grid-cols-1 ${result ? 'lg:grid-cols-2' : ''} gap-8 items-start`}>
            <GlassCard className={`p-6 flex flex-col gap-6 ${!result ? 'max-w-4xl mx-auto w-full' : ''}`}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90">
                  {lang === "ar" ? "المسمى الوظيفي المستهدف" : "Target Role"}
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                  placeholder={lang === "ar" ? "مثال: Senior Frontend Engineer" : "e.g., Senior Frontend Engineer"}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90">
                  {lang === "ar" ? "وصف الوظيفة (Job Description)" : "Job Description"}
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 h-40 resize-y text-left"
                  dir="auto"
                  placeholder={lang === "ar" ? "الصق وصف الوظيفة هنا..." : "Paste the job description here..."}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90">
                  {lang === "ar" ? "السيرة الذاتية الحالية (Master CV)" : "Current Master CV"}
                </label>
                <textarea
                  value={masterCv}
                  onChange={(e) => setMasterCv(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 h-40 resize-y text-left"
                  dir="auto"
                  placeholder={lang === "ar" ? "الصق سيرتك الذاتية هنا..." : "Paste your CV here..."}
                />
              </div>

              <GradientButton onClick={analyze} disabled={isLoading} className="w-full justify-center py-4">
                {isLoading
                  ? lang === "ar"
                    ? "جاري التحليل..."
                    : "Analyzing..."
                  : lang === "ar"
                  ? "حلل بالدليل"
                  : "Analyze with Proof"}
              </GradientButton>
            </GlassCard>

            {result && (
              <div className="flex flex-col gap-6">
                <GlassCard className="p-6">
                  <div className="flex items-center gap-6 mb-6">
                    <ScoreRing score={result.fitScore / 10} />
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        {lang === "ar" ? "نسبة المطابقة" : "Fit Score"}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {lang === "ar" ? "القرار التوصية:" : "Recommendation:"}
                        </span>
                        <div
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
                            result.shouldApply === "yes"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : result.shouldApply === "maybe"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >
                          {result.shouldApply.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {result.finalWarning && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm mb-6">
                      {result.finalWarning}
                    </div>
                  )}

                  <div className="space-y-4 mb-6">
                    <h4 className="text-lg font-semibold">
                      {lang === "ar" ? "جدول الحقيقة (Truth Table)" : "Truth Table"}
                    </h4>
                    <div className="space-y-3">
                      {result.truthTable.map((row: any, i: number) => (
                        <div
                          key={i}
                          className={`p-4 rounded-xl border ${
                            row.evidenceFound
                              ? "bg-green-500/5 border-green-500/10"
                              : row.evidenceStrength > 3
                              ? "bg-amber-500/5 border-amber-500/10"
                              : "bg-red-500/5 border-red-500/10"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-foreground">{row.requirement}</div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                row.evidenceFound
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {row.evidenceFound
                                ? lang === "ar" ? "موجود" : "Found"
                                : lang === "ar" ? "مفقود" : "Missing"}
                            </span>
                          </div>
                          {row.evidenceFound && (
                            <div className="text-sm text-foreground/70 mb-2 border-l-2 border-primary/30 pl-3 italic">
                              "{row.evidenceFromCv}"
                            </div>
                          )}
                          {!row.evidenceFound && row.gap && (
                            <div className="text-sm text-red-400/80 mb-2">
                              {row.gap}
                            </div>
                          )}
                          <div className="text-sm text-muted-foreground mt-2">
                            <span className="font-semibold text-primary">
                              {lang === "ar" ? "توصية: " : "Action: "}
                            </span>
                            {row.recommendation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GlassCard className="p-5">
                    <h4 className="font-semibold mb-3">
                      {lang === "ar" ? "كلمات مفتاحية آمنة" : "Safe Keywords"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.safeKeywords.map((kw: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-md border border-green-500/20">
                          {kw}
                        </span>
                      ))}
                      {result.safeKeywords.length === 0 && <span className="text-muted-foreground text-sm">-</span>}
                    </div>
                  </GlassCard>
                  <GlassCard className="p-5">
                    <h4 className="font-semibold mb-3">
                      {lang === "ar" ? "كلمات خطرة (لا تدعيها)" : "Risky Keywords (Do not claim)"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.riskyKeywords.map((kw: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-md border border-red-500/20">
                          {kw}
                        </span>
                      ))}
                      {result.riskyKeywords.length === 0 && <span className="text-muted-foreground text-sm">-</span>}
                    </div>
                  </GlassCard>
                </div>

                <GlassCard className="p-6">
                  <h4 className="text-lg font-semibold mb-4">
                    {lang === "ar" ? "النقاط المحسّنة (آمنة)" : "Safe Rewritten Bullets"}
                  </h4>
                  <ul className="space-y-3 list-disc list-inside text-foreground/80 text-sm leading-relaxed">
                    {result.rewrittenBullets.map((b: string, i: number) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>

                  <h4 className="text-lg font-semibold mt-6 mb-3">
                    {lang === "ar" ? "ملخص مخصص للوظيفة" : "Tailored Summary"}
                  </h4>
                  <p className="text-foreground/80 text-sm leading-relaxed p-4 bg-background/40 rounded-xl border border-border">
                    {result.tailoredSummary}
                  </p>
                </GlassCard>
              </div>
            )}
          </div>
        </section>
      </PageFade>
    </AppShell>
  );
}

