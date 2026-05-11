import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/ToolPage";
import { useT, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/linkedin")({
  head: () => ({
    meta: [
      { title: "LinkedIn Bio Optimizer — InterviewX AI" },
      { name: "description", content: "Rewrite your LinkedIn headline and About section." },
    ],
  }),
  component: Page,
});

function Page() {
  const t = useT();
  const { lang } = useLang();
  return (
    <ToolPage
      kind="linkedin_bio"
      badge={t("tool_linkedin_badge")}
      title={t("tool_linkedin_title")}
      subtitle={t("tool_linkedin_sub")}
      cta={t("tool_linkedin_cta")}
      fileName="linkedin-bio"
      fields={[
        { key: "name", label: lang === "ar" ? "اسمك" : "Your name", required: true },
        { key: "role", label: lang === "ar" ? "وظيفتك الحالية / المستهدفة" : "Current / target role", required: true },
        { key: "skills", label: lang === "ar" ? "أهم المهارات" : "Top skills", textarea: true, rows: 3 },
        { key: "achievements", label: lang === "ar" ? "أهم الإنجازات" : "Key achievements", textarea: true, rows: 4 },
        { key: "experience", label: lang === "ar" ? "سنوات الخبرة" : "Years of experience" },
      ]}
    />
  );
}
