import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/ToolPage";
import { useT, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/skill-gap")({
  head: () => ({
    meta: [
      { title: "Skill Gap Analyzer — InterviewX AI" },
      { name: "description", content: "Find the gap between your skills and the job requirements." },
    ],
  }),
  component: Page,
});

function Page() {
  const t = useT();
  const { lang } = useLang();
  return (
    <ToolPage
      kind="skill_gap"
      badge={t("tool_gap_badge")}
      title={t("tool_gap_title")}
      subtitle={t("tool_gap_sub")}
      cta={t("tool_gap_cta")}
      fileName="skill-gap-report"
      fields={[
        { key: "jd", label: lang === "ar" ? "وصف الوظيفة الكامل" : "Full job description", textarea: true, rows: 7, required: true },
        { key: "skills", label: lang === "ar" ? "مهاراتك وخبرتك الحالية" : "Your current skills & experience", textarea: true, rows: 6, required: true },
      ]}
    />
  );
}
