import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/ToolPage";
import { useT, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank-You Email Generator — InterviewX AI" },
      { name: "description", content: "Generate a professional thank-you email after your interview." },
    ],
  }),
  component: Page,
});

function Page() {
  const t = useT();
  const { lang } = useLang();
  return (
    <ToolPage
      kind="thank_you_email"
      badge={t("tool_thanks_badge")}
      title={t("tool_thanks_title")}
      subtitle={t("tool_thanks_sub")}
      cta={t("tool_thanks_cta")}
      fileName="thank-you-email"
      fields={[
        { key: "name", label: lang === "ar" ? "اسمك" : "Your name", required: true },
        { key: "interviewer", label: lang === "ar" ? "اسم من قابلك" : "Interviewer name" },
        { key: "company", label: lang === "ar" ? "اسم الشركة" : "Company", required: true },
        { key: "job", label: lang === "ar" ? "الوظيفة" : "Job", required: true },
        { key: "topics", label: lang === "ar" ? "المواضيع اللي اتناقشت فيها" : "Topics discussed", textarea: true, rows: 3 },
        { key: "fit", label: lang === "ar" ? "ليه أنت مناسب (سطر واحد)" : "Why you're a great fit (one line)" },
      ]}
    />
  );
}
