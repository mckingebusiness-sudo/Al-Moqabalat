import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, FileText, Linkedin, Mail, Map, Target, Wand2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/UI";
import { PageFade, Stagger, StaggerItem, HoverLift } from "@/components/Motion";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Career Tools — InterviewX AI" },
      { name: "description", content: "5 free AI career tools: cover letter, salary negotiation, LinkedIn bio, thank-you email, skill gap analyzer." },
    ],
  }),
  component: ToolsHub,
});

function ToolsHub() {
  const t = useT();
  const tools = [
    { to: "/cover-letter", icon: <FileText className="h-6 w-6" />, title: t("tool_cover_title"), desc: t("tool_cover_sub") },
    { to: "/salary-coach", icon: <Briefcase className="h-6 w-6" />, title: t("tool_salary_title"), desc: t("tool_salary_sub") },
    { to: "/linkedin", icon: <Linkedin className="h-6 w-6" />, title: t("tool_linkedin_title"), desc: t("tool_linkedin_sub") },
    { to: "/thank-you", icon: <Mail className="h-6 w-6" />, title: t("tool_thanks_title"), desc: t("tool_thanks_sub") },
    { to: "/skill-gap", icon: <Target className="h-6 w-6" />, title: t("tool_gap_title"), desc: t("tool_gap_sub") },
  ];
  return (
    <AppShell>
      <PageFade>
        <section className="px-4 pt-12 pb-6 sm:pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-1.5 text-xs font-medium backdrop-blur">
              <Wand2 className="h-3.5 w-3.5 text-primary" />
              {t("tools_badge")}
            </div>
            <h1 className="text-balance text-3xl font-extrabold sm:text-5xl">
              <span className="text-gradient-animated">{t("tools_title")}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/80">{t("tools_sub")}</p>
          </div>
        </section>
      </PageFade>
      <section className="px-4 pb-14">
        <Stagger className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tt) => (
            <StaggerItem key={tt.to} className="h-full">
              <HoverLift className="h-full">
                <Link to={tt.to} className="block h-full">
                  <GlassCard className="flex h-full flex-col gap-3">
                    <div className="inline-grid h-12 w-12 place-items-center rounded-xl btn-gradient">
                      {tt.icon}
                    </div>
                    <h3 className="text-lg font-bold">{tt.title}</h3>
                    <p className="flex-1 text-sm text-foreground/80">{tt.desc}</p>
                    <p className="mt-2 text-sm font-semibold text-primary">{t("tools_open")} →</p>
                  </GlassCard>
                </Link>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </AppShell>
  );
}
