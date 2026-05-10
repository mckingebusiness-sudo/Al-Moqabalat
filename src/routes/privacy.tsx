import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/UI";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy — InterviewX AI" }] }),
  component: () => {
    const t = useT();
    return (
      <AppShell>
        <section className="px-4 py-12">
          <div className="mx-auto max-w-2xl space-y-4">
            <h1 className="text-3xl font-bold">{t("privacy")}</h1>
            <GlassCard><p className="leading-relaxed">{t("privacy_p1")}</p></GlassCard>
          </div>
        </section>
      </AppShell>
    );
  },
});
