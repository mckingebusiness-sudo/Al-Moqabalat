import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Download, Loader2, RotateCcw, FileText } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GlassCard, GradientButton, GhostButton, ScoreRing } from "@/components/UI";
import { useT } from "@/lib/i18n";
import { useSession } from "@/lib/session-store";
import { downloadElementAsPdf } from "@/lib/pdf-export.client";

export const Route = createFileRoute("/interview/report")({
  head: () => ({ meta: [{ title: "Interview Report — InterviewX AI" }] }),
  component: ReportPage,
});

function ReportPage() {
  const t = useT();
  const navigate = useNavigate();
  const { finalReport, setup, reset } = useSession();
  const reportRef = useRef<HTMLDivElement>(null);
  const [pdfBusy, setPdfBusy] = useState(false);

  useEffect(() => {
    if (!finalReport) navigate({ to: "/interview" });
  }, [finalReport, navigate]);

  if (!finalReport) return <AppShell><div /></AppShell>;
  const r = finalReport;

  return (
    <AppShell>
      <section className="px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-5">
          <div ref={reportRef} className="space-y-5">
            <header className="text-center">
              <h1 className="text-3xl font-bold sm:text-4xl">{t("report_title")}</h1>
              {setup?.applicationContext.targetJob && (
                <p className="mt-2 text-sm text-muted-foreground">{setup.applicationContext.targetJob}</p>
              )}
            </header>

            <GlassCard>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <ScoreRing score={r.overallScore} />
                <div className="flex-1 text-center sm:text-start">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t("overall_score")}</p>
                  <p className="mt-1 text-lg font-semibold">{r.verdict}</p>
                </div>
              </div>
            </GlassCard>

            <div className="grid gap-4 sm:grid-cols-2">
              <ListCard title={t("top_strengths")} items={r.topStrengths} tone="ok" />
              <ListCard title={t("top_weaknesses")} items={r.topWeaknesses} tone="warn" />
            </div>

            <ListCard title={t("improvements")} items={r.mostImportantImprovements} />
            <ListCard title={t("practice_plan")} items={r.recommendedPracticePlan} />

            {r.bestAnswerTemplate && (
              <GlassCard>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{t("better_answer")}</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{r.bestAnswerTemplate}</p>
              </GlassCard>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <ListCard title={t("cv_tips")} items={r.cvImprovementTips} />
              <ListCard title={t("next_tips")} items={r.nextInterviewTips} />
            </div>
          </div>

          <div className="no-print flex flex-col gap-2 sm:flex-row">
            <GradientButton
              disabled={pdfBusy}
              onClick={async () => {
                if (!reportRef.current) return;
                setPdfBusy(true);
                try {
                  await downloadElementAsPdf(reportRef.current, "interview-report.pdf");
                } finally {
                  setPdfBusy(false);
                }
              }}
              className="flex-1"
            >
              {pdfBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {t("print_report")}
            </GradientButton>
            <GhostButton onClick={() => { reset(); navigate({ to: "/interview" }); }} className="flex-1">
              <RotateCcw className="h-4 w-4" /> {t("new_interview")}
            </GhostButton>
            <Link to="/cv-builder" className="flex-1">
              <GhostButton className="w-full">
                <FileText className="h-4 w-4" /> {t("go_cv")}
              </GhostButton>
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function ListCard({ title, items, tone }: { title: string; items: string[]; tone?: "ok" | "warn" }) {
  const border =
    tone === "ok" ? "border-emerald-500/30 bg-emerald-500/5" :
    tone === "warn" ? "border-amber-500/30 bg-amber-500/5" : "";
  return (
    <div className={`glass-card p-5 ${border}`}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider">{title}</p>
      <ul className="space-y-1.5 text-sm">
        {items?.map((it, i) => (
          <li key={i} className="leading-relaxed">• {it}</li>
        ))}
      </ul>
    </div>
  );
}
