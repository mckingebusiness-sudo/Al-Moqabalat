import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/UI";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — InterviewX AI" }] }),
  component: () => {
    const t = useT();
    return (
      <AppShell>
        <section className="px-4 py-12">
          <div className="mx-auto max-w-2xl space-y-4">
            <h1 className="text-3xl font-bold">{t("about_title")}</h1>
            <GlassCard><p className="leading-relaxed">{t("about_p1")}</p></GlassCard>
            <p className="text-center text-sm text-muted-foreground">{t("footer_made")} <strong>Mahmoud Said</strong></p>
          </div>
        </section>
      </AppShell>
    );
  },
});
