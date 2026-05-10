import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileText,
  Globe,
  ShieldCheck,
  Sparkles,
  Star,
  Wand2,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/UI";
import { Reveal, Stagger, StaggerItem, HoverLift, PageFade } from "@/components/Motion";
import { useT, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InterviewX AI — تمرّن AI | Mock Interviews & CV Builder" },
      {
        name: "description",
        content:
          "Practice realistic AI interviews (8 fresh questions per job), build a European-style CV, and improve your existing CV with instant AI feedback. Bilingual Arabic/English.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const t = useT();
  const { lang } = useLang();

  return (
    <AppShell>
      <PageFade>
        <section className="relative px-4 pt-12 pb-10 sm:pt-20 sm:pb-16">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-1.5 text-xs font-medium backdrop-blur animate-pulse-glow"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {lang === "ar" ? "مدعوم بالذكاء الاصطناعي — مجاني، بدون تسجيل" : "AI-powered — free, no signup"}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"
            >
              <span className="text-gradient-animated">{t("hero_title")}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mx-auto mt-5 max-w-2xl text-balance text-base text-foreground/80 sm:text-lg"
            >
              {t("hero_sub")}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground"
            >
              {t("hero_desc")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <Link
                to="/interview"
                className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition hover:scale-[1.03]"
              >
                <Briefcase className="h-4 w-4" />
                {t("hero_cta_primary")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <Link
                to="/cv-improve"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-accent"
              >
                <Wand2 className="h-4 w-4 text-primary" />
                {t("hero_cta_secondary")}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3 sm:gap-6"
            >
              <Stat value="12K+" label={t("stat_users")} />
              <Stat value="80K+" label={t("stat_questions")} />
              <Stat value="5K+" label={t("stat_cvs")} />
            </motion.div>
          </div>
        </section>
      </PageFade>

      <section className="px-4 pb-10">
        <Stagger className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3" gap={0.1}>
          <StaggerItem>
            <ProductCard
              to="/interview"
              icon={<Briefcase className="h-7 w-7" />}
              title={t("card_interview_title")}
              desc={t("card_interview_desc")}
              cta={t("card_interview_btn")}
              tint="from-cyan-400/30 via-blue-500/20 to-indigo-500/20"
            />
          </StaggerItem>
          <StaggerItem>
            <ProductCard
              to="/cv-improve"
              icon={<Wand2 className="h-7 w-7" />}
              title={t("card_improve_title")}
              desc={t("card_improve_desc")}
              cta={t("card_improve_btn")}
              tint="from-amber-400/30 via-pink-500/20 to-rose-500/20"
              featured
            />
          </StaggerItem>
          <StaggerItem>
            <ProductCard
              to="/cv-builder"
              icon={<FileText className="h-7 w-7" />}
              title={t("card_cv_title")}
              desc={t("card_cv_desc")}
              cta={t("card_cv_btn")}
              tint="from-fuchsia-400/30 via-purple-500/20 to-indigo-500/20"
            />
          </StaggerItem>
        </Stagger>
      </section>

      <Section title={t("how_title")}>
        <Stagger className="grid gap-4 sm:grid-cols-3">
          {[t("how_step1"), t("how_step2"), t("how_step3")].map((s, i) => (
            <StaggerItem key={i}>
              <HoverLift>
                <GlassCard className="text-center">
                  <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl btn-gradient">
                    <span className="font-bold">{i + 1}</span>
                  </div>
                  <p className="text-sm font-medium">{s}</p>
                </GlassCard>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section title={t("proof_title")}>
        <Stagger className="grid gap-4 md:grid-cols-3">
          {[
            { icon: <Briefcase className="h-5 w-5" />, t: t("proof_1_t"), d: t("proof_1_d") },
            { icon: <Star className="h-5 w-5" />, t: t("proof_2_t"), d: t("proof_2_d") },
            { icon: <Wand2 className="h-5 w-5" />, t: t("proof_3_t"), d: t("proof_3_d") },
          ].map((it, i) => (
            <StaggerItem key={i}>
              <HoverLift>
                <GlassCard>
                  <div className="mb-3 inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                    {it.icon}
                  </div>
                  <h3 className="mb-1 font-bold">{it.t}</h3>
                  <p className="text-sm text-foreground/80">{it.d}</p>
                </GlassCard>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section title={t("why_title")}>
        <Stagger className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: <Zap className="h-5 w-5" />, text: t("why_1") },
            { icon: <CheckCircle2 className="h-5 w-5" />, text: t("why_2") },
            { icon: <FileText className="h-5 w-5" />, text: t("why_3") },
          ].map((it, i) => (
            <StaggerItem key={i}>
              <HoverLift>
                <GlassCard>
                  <div className="mb-3 inline-grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
                    {it.icon}
                  </div>
                  <p className="text-sm">{it.text}</p>
                </GlassCard>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section title={t("jobs_title")}>
        <Reveal>
          <GlassCard>
            <p className="text-center text-sm text-foreground/80">{t("jobs_desc")}</p>
          </GlassCard>
        </Reveal>
      </Section>

      <Section>
        <Stagger className="grid gap-4 sm:grid-cols-2">
          <StaggerItem>
            <HoverLift>
              <GlassCard>
                <div className="mb-2 inline-grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Globe className="h-5 w-5" />
                </div>
                <h3 className="mb-1 font-semibold">{t("bilingual_title")}</h3>
                <p className="text-sm text-muted-foreground">{t("bilingual_desc")}</p>
              </GlassCard>
            </HoverLift>
          </StaggerItem>
          <StaggerItem>
            <HoverLift>
              <GlassCard>
                <div className="mb-2 inline-grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mb-1 font-semibold">{t("privacy_title")}</h3>
                <p className="text-sm text-muted-foreground">{t("privacy_desc")}</p>
              </GlassCard>
            </HoverLift>
          </StaggerItem>
        </Stagger>
      </Section>

      <Section title={t("faq_title")}>
        <Stagger className="grid gap-3" gap={0.06}>
          {[
            { q: t("faq_q1"), a: t("faq_a1") },
            { q: t("faq_q2"), a: t("faq_a2") },
            { q: t("faq_q3"), a: t("faq_a3") },
          ].map((f, i) => (
            <StaggerItem key={i}>
              <HoverLift scale={1.005}>
                <GlassCard>
                  <p className="font-semibold">{f.q}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
                </GlassCard>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border p-8 sm:p-12">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-fuchsia-500/15 to-cyan-400/20" />
              <div className="relative flex flex-col items-center gap-5 text-center">
                <h2 className="text-balance text-3xl font-extrabold sm:text-4xl">{t("cta_strip_title")}</h2>
                <p className="max-w-xl text-foreground/80">{t("cta_strip_sub")}</p>
                <Link
                  to="/interview"
                  className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition hover:scale-[1.04]"
                >
                  {t("hero_cta_primary")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </AppShell>
  );
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {title && (
          <Reveal>
            <h2 className="mb-5 text-center text-2xl font-bold sm:text-3xl">{title}</h2>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 px-3 py-4 text-center backdrop-blur">
      <p className="text-2xl font-extrabold sm:text-3xl">
        <span className="text-gradient">{value}</span>
      </p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">{label}</p>
    </div>
  );
}

function ProductCard({
  to,
  icon,
  title,
  desc,
  cta,
  tint,
  featured,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: string;
  tint: string;
  featured?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="h-full"
    >
      <Link to={to} className="group relative block h-full overflow-hidden rounded-3xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${tint} opacity-80 transition duration-500 group-hover:opacity-100 group-hover:scale-105`} />
        <div className="glass-card relative flex h-full flex-col gap-4 p-7">
          {featured && (
            <span className="absolute top-4 end-4 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              new
            </span>
          )}
          <div className="flex items-center gap-3">
            <motion.div
              className="grid h-14 w-14 place-items-center rounded-2xl btn-gradient"
              whileHover={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.5 }}
            >
              {icon}
            </motion.div>
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>
          <p className="flex-1 text-foreground/80">{desc}</p>
          <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:gap-3">
            {cta}
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="rtl:rotate-180 inline-block"
            >
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
