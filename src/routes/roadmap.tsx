import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/ToolPage";
import { useT, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "AI Career Roadmap — InterviewX AI" },
      { name: "description", content: "A personalized phase-by-phase roadmap from your current role to your dream role." },
    ],
  }),
  component: Page,
});

function Page() {
  const t = useT();
  const { lang } = useLang();
  return (
    <ToolPage
      kind="career_roadmap"
      badge={t("tool_road_badge")}
      title={t("tool_road_title")}
      subtitle={t("tool_road_sub")}
      cta={t("tool_road_cta")}
      fileName="career-roadmap"
      fields={[
        { key: "name", label: lang === "ar" ? "اسمك" : "Your name", required: true },
        { key: "current_role", label: lang === "ar" ? "وظيفتك الحالية / مستواك" : "Current role / level", required: true },
        { key: "target_role", label: lang === "ar" ? "الوظيفة / المستوى اللي عايز توصله" : "Target role / level", required: true },
        { key: "industry", label: lang === "ar" ? "المجال / الصناعة" : "Industry / domain" },
        { key: "experience", label: lang === "ar" ? "سنوات الخبرة" : "Years of experience" },
        { key: "timeframe", label: lang === "ar" ? "المدة المتاحة (مثال: 12 شهر)" : "Timeframe (e.g. 12 months)", required: true },
        { key: "skills", label: lang === "ar" ? "أهم مهاراتك الحالية" : "Your top current skills", textarea: true, rows: 3 },
        { key: "constraints", label: lang === "ar" ? "قيود (موقع، ميزانية، وقت...)" : "Constraints (location, budget, hours...)", textarea: true, rows: 3 },
      ]}
    />
  );
}
