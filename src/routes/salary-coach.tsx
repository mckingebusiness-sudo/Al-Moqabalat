import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/ToolPage";
import { useT, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/salary-coach")({
  head: () => ({
    meta: [
      { title: "Salary Negotiation Coach — InterviewX AI" },
      { name: "description", content: "Get a complete negotiation script for your offer." },
    ],
  }),
  component: Page,
});

function Page() {
  const t = useT();
  const { lang } = useLang();
  return (
    <ToolPage
      kind="salary_coach"
      badge={t("tool_salary_badge")}
      title={t("tool_salary_title")}
      subtitle={t("tool_salary_sub")}
      cta={t("tool_salary_cta")}
      fileName="salary-script"
      fields={[
        { key: "job", label: lang === "ar" ? "المسمى الوظيفي" : "Job title", required: true },
        { key: "location", label: lang === "ar" ? "الدولة / المدينة" : "Country / city" },
        { key: "experience", label: lang === "ar" ? "سنوات الخبرة" : "Years of experience" },
        { key: "current", label: lang === "ar" ? "الراتب الحالي (اختياري)" : "Current salary (optional)" },
        { key: "offer", label: lang === "ar" ? "العرض المقدم" : "Offered salary", required: true },
        { key: "target", label: lang === "ar" ? "الراتب المستهدف" : "Target salary", required: true },
      ]}
    />
  );
}
