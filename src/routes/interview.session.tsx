import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send, ArrowRight, Flag, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { GlassCard, GradientButton, GhostButton, TextArea, ScoreRing } from "@/components/UI";
import { Reveal, PageFade } from "@/components/Motion";
import { useT } from "@/lib/i18n";
import { useSession } from "@/lib/session-store";
import { evaluateAnswer, finalReport, generateQuestion } from "@/lib/ai.functions";
import { MAX_ANSWER_CHARS } from "@/lib/constants";

export const Route = createFileRoute("/interview/session")({
  head: () => ({ meta: [{ title: "Interview Session — InterviewX AI" }] }),
  component: SessionPage,
});

function SessionPage() {
  const t = useT();
  const navigate = useNavigate();
  const s = useSession();
  const evalFn = useServerFn(evaluateAnswer);
  const qFn = useServerFn(generateQuestion);
  const reportFn = useServerFn(finalReport);

  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useSession.persist.onFinishHydration(() => setHydrated(true));
    void Promise.resolve(useSession.persist.rehydrate()).then(() => setHydrated(true));
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!s.setup || !s.profile || s.questions.length === 0) {
      navigate({ to: "/interview" });
    }
  }, [hydrated, s.setup, s.profile, s.questions.length, navigate]);

  if (!hydrated) return <AppShell><div className="p-10 text-center text-sm text-muted-foreground">…</div></AppShell>;
  if (!s.setup || !s.profile || s.questions.length === 0) return <AppShell><div /></AppShell>;

  const idx = s.currentIndex;
  const total = s.setup.totalQuestions;
  const currentQuestion = s.questions[idx];
  if (!currentQuestion) {
    return <AppShell><div className="p-10 text-center text-sm text-muted-foreground">…</div></AppShell>;
  }
  const currentEval = s.evaluations[idx];
  const isLast = idx + 1 >= total;

  async function submit() {
    if (!answer.trim() || busy) return;
    setError(null);
    setBusy(true);
    try {
      const ev = await evalFn({
        data: {
          language: s.setup!.language,
          applicationContext: s.setup!.applicationContext,
          candidateProfile: s.profile,
          question: currentQuestion.question,
          answer: answer.trim().slice(0, MAX_ANSWER_CHARS),
        },
      });
      s.addAnswer(answer.trim());
      s.addEvaluation(ev);
      setAnswer("");
    } catch (e) {
      const m = (e as Error).message;
      setError(m.includes("LIMIT") ? t("err_limit") : t("err_temp"));
    } finally {
      setBusy(false);
    }
  }

  async function next() {
    setBusy(true);
    setError(null);
    try {
      const summary = s.evaluations
        .map((e, i) => `Q${i + 1}: score ${e.score}/10. ${e.shortFeedback}`)
        .join(" | ");
      const previousQuestions = s.questions.map((q) => q.question).filter(Boolean);
      const q = await qFn({
        data: {
          language: s.setup!.language,
          interviewType: s.setup!.interviewType,
          applicationContext: s.setup!.applicationContext,
          candidateProfile: s.profile,
          currentQuestionNumber: idx + 2,
          totalQuestions: total,
          previousSummary: summary.slice(0, 1800),
          previousQuestions,
        },
      });
      s.addQuestionAndAdvance(q, idx + 1);
    } catch (e) {
      const m = (e as Error).message;
      setError(m.includes("LIMIT") ? t("err_limit") : t("err_temp"));
    } finally {
      setBusy(false);
    }
  }

  async function finish() {
    setBusy(true);
    setError(null);
    try {
      const r = await reportFn({
        data: {
          language: s.setup!.language,
          applicationContext: s.setup!.applicationContext,
          candidateProfile: s.profile,
          evaluations: s.evaluations,
        },
      });
      s.setFinalReport(r);
      navigate({ to: "/interview/report" });
    } catch (e) {
      const m = (e as Error).message;
      setError(m.includes("LIMIT") ? t("err_limit") : t("err_temp"));
    } finally {
      setBusy(false);
    }
  }

  const pct = ((idx + (currentEval ? 1 : 0)) / total) * 100;

  return (
    <AppShell>
      <PageFade>
        <section className="px-4 py-8">
          <div className="mx-auto max-w-3xl space-y-5">
            {/* Progress dots + bar */}
            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>{t("question_of")} {idx + 1} {t("of")} {total}</span>
                <motion.span
                  key={pct}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-semibold tabular-nums text-foreground/80"
                >
                  {Math.round(pct)}%
                </motion.span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-accent">
                <motion.div
                  className="h-full btn-gradient"
                  initial={false}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-center gap-1.5">
                {Array.from({ length: total }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{
                      scale: i === idx ? 1.25 : 1,
                      opacity: i <= idx ? 1 : 0.35,
                    }}
                    className={`h-1.5 rounded-full ${i < idx ? "btn-gradient w-6" : i === idx ? "btn-gradient w-8" : "w-3 bg-foreground/30"}`}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`q-${idx}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <GlassCard className="relative overflow-hidden">
                  <motion.div
                    className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 btn-gradient blur-2xl"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="relative flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/15 text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">{currentQuestion.questionType}</p>
                  </div>
                  <h2 className="relative mt-3 text-xl font-semibold leading-relaxed sm:text-2xl">{currentQuestion.question}</h2>
                  {currentQuestion.whyThisQuestion && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="relative mt-3 text-xs text-muted-foreground"
                    >
                      💡 {currentQuestion.whyThisQuestion}
                    </motion.p>
                  )}
                </GlassCard>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!currentEval ? (
                <motion.div
                  key={`answer-${idx}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <GlassCard>
                    <label className="mb-2 block text-sm font-medium">{t("your_answer")}</label>
                    <TextArea
                      rows={6}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value.slice(0, MAX_ANSWER_CHARS))}
                      placeholder={t("answer_ph")}
                    />
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span className={answer.length > MAX_ANSWER_CHARS - 100 ? "text-amber-500" : ""}>
                        {answer.length}/{MAX_ANSWER_CHARS}
                      </span>
                    </div>
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 text-sm text-destructive"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <GradientButton onClick={submit} disabled={busy || !answer.trim()} className="mt-3 w-full">
                      {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> {t("evaluating")}</> : <><Send className="h-4 w-4" /> {t("submit_answer")}</>}
                    </GradientButton>
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div
                  key={`eval-${idx}`}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <GlassCard>
                    <div className="flex items-start gap-4">
                      <motion.div initial={{ scale: 0.7, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}>
                        <ScoreRing score={currentEval.score} />
                      </motion.div>
                      <div className="flex-1">
                        <p className="font-semibold">{currentEval.shortFeedback}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{t("advice")}: {currentEval.practicalAdvice}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <Reveal delay={0.05}>
                        <FeedbackBlock title={t("strengths")} items={currentEval.strengths} tone="ok" />
                      </Reveal>
                      <Reveal delay={0.15}>
                        <FeedbackBlock title={t("weaknesses")} items={currentEval.weaknesses} tone="warn" />
                      </Reveal>
                    </div>
                    <Reveal delay={0.2}>
                      <div className="mt-4 rounded-xl border border-border bg-background/40 p-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">{t("better_answer")}</p>
                        <p className="text-sm leading-relaxed">{currentEval.improvedAnswer}</p>
                      </div>
                    </Reveal>
                    <Reveal delay={0.28}>
                      <div className="mt-3 rounded-xl border border-border bg-background/40 p-3">
                        <p className="text-xs"><strong>{t("next_tip")}:</strong> {currentEval.nextTip}</p>
                      </div>
                    </Reveal>
                  </GlassCard>

                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 text-sm text-destructive">
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mt-4 flex flex-col gap-2 sm:flex-row"
                  >
                    {!isLast ? (
                      <GradientButton onClick={next} disabled={busy} className="flex-1">
                        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{t("next_question")} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></>}
                      </GradientButton>
                    ) : null}
                    <GhostButton onClick={finish} disabled={busy} className="flex-1">
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Flag className="h-4 w-4" /> {t("finish_interview")}</>}
                    </GhostButton>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </PageFade>
    </AppShell>
  );
}

function FeedbackBlock({ title, items, tone }: { title: string; items: string[]; tone: "ok" | "warn" }) {
  return (
    <div className={`rounded-xl border p-3 ${tone === "ok" ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider">{title}</p>
      <ul className="space-y-1 text-sm">
        {items?.map((it, i) => (
          <li key={i} className="leading-relaxed">• {it}</li>
        ))}
      </ul>
    </div>
  );
}
