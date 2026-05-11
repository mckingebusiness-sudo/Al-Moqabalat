import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/ToolPage";
import { useT, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/cover-letter")({
  head: () => ({
    meta: [
      { title: "Cover Letter Generator — InterviewX AI" },
      { name: "description", content: "Generate a tailored cover letter in seconds." },
    ],
  }),
  component: Page,
});

function Page() {
  const t = useT();
  const { lang } = useLang();
  return (
    <ToolPage
      kind="cover_letter"
      badge={t("tool_cover_badge")}
      title={t("tool_cover_title")}
      subtitle={t("tool_cover_sub")}
      cta={t("tool_cover_cta")}
      fileName="cover-letter"
      fields={[
        { key: "name", label: lang === "ar" ? "اسمك" : "Your name", required: true },
        { key: "job", label: lang === "ar" ? "الوظيفة" : "Target job", required: true },
        { key: "company", label: lang === "ar" ? "الشركة" : "Company" },
        { key: "background", label: lang === "ar" ? "خبراتك ومهاراتك" : "Your background & skills", textarea: true, rows: 5, required: true },
        { key: "jd", label: lang === "ar" ? "وصف الوظيفة (اختياري)" : "Job description (optional)", textarea: true, rows: 4 },
      ]}
    />
  );
}
