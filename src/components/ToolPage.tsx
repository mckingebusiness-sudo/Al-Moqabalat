import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Download, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  GlassCard,
  GradientButton,
  GhostButton,
  FieldLabel,
  TextInput,
  TextArea,
  Select,
} from "@/components/UI";
import { PageFade, Reveal } from "@/components/Motion";
import { AiThinking } from "@/components/AiThinking";
import { useT, useLang } from "@/lib/i18n";
import { runCareerTool, type ToolKind } from "@/lib/career-tools.functions";
import { downloadTextAsPdf } from "@/lib/pdf-export";
import { handleServerError } from "@/lib/handle-server-error";

export type ToolField = {
  key: string;
  label: string;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
};

export function ToolPage({
  kind,
  title,
  subtitle,
  badge,
  fields,
  fileName,
  cta,
}: {
  kind: ToolKind;
  title: string;
  subtitle: string;
  badge: string;
  fields: ToolField[];
  fileName: string;
  cta: string;
}) {
  const t = useT();
  const { lang } = useLang();
  const [outLang, setOutLang] = useState<"ar" | "en">(lang === "en" ? "en" : "ar");
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const run = useServerFn(runCareerTool);

  function set(k: string, v: string) {
    setValues((p) => ({ ...p, [k]: v.slice(0, 4000) }));
  }

  async function onRun() {
    const missing = fields.find((f) => f.required && !(values[f.key] || "").trim());
    if (missing) {
      setError(lang === "ar" ? `املأ: ${missing.label}` : `Please fill: ${missing.label}`);
      return;
    }
    setError(null);
    setBusy(true);
    setOutput(null);
    try {
      const res = await run({ data: { kind, language: outLang, inputs: values } });
      setOutput(res.text);
      setTimeout(() => outRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (e) {
      handleServerError(e);
    } finally {
      setBusy(false);
    }
  }

  function copy(text: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }

  async function pdf() {
    if (!output) return;
    setPdfBusy(true);
    try {
      await downloadTextAsPdf(output, fileName, outLang === "ar" ? "rtl" : "ltr");
    } catch (err) {
      toast.error(t("err_temp"));
    } finally {
      setPdfBusy(false);
    }
  }

  return (
    <AppShell>
      <PageFade>
        <section className="px-4 pt-10 pb-6 sm:pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-1.5 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {badge}
            </div>
            <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              <span className="text-gradient-animated">{title}</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-foreground/80">{subtitle}</p>
          </div>
        </section>
      </PageFade>

      <section className="px-4 pb-10">
        <div className="mx-auto max-w-3xl">
          <GlassCard className="space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <FieldLabel>
                  {f.label}
                  {f.required && " *"}
                </FieldLabel>
                {f.textarea ? (
                  <TextArea
                    rows={f.rows || 4}
                    value={values[f.key] || ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                ) : (
                  <TextInput
                    value={values[f.key] || ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                )}
              </div>
            ))}

            <div>
              <FieldLabel>{t("cvi_lang")}</FieldLabel>
              <Select value={outLang} onChange={(e) => setOutLang(e.target.value as "ar" | "en")}>
                <option value="ar">{t("lang_ar")}</option>
                <option value="en">{t("lang_en")}</option>
              </Select>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <GradientButton onClick={onRun} disabled={busy} className="w-full">
              {busy ? (
                <AiThinking label={lang === "ar" ? "AI بيكتب لك" : "AI is writing"} />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> {cta}
                </>
              )}
            </GradientButton>
          </GlassCard>

          {output && (
            <Reveal>
              <div ref={outRef} className="mt-6">
                <GlassCard>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-bold">{lang === "ar" ? "النتيجة" : "Result"}</h2>
                    <div className="flex gap-2">
                      <GhostButton onClick={() => copy(output)}>
                        <Copy className="h-4 w-4" /> {t("cvi_copy")}
                      </GhostButton>
                      <GradientButton onClick={pdf} disabled={pdfBusy}>
                        {pdfBusy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        PDF
                      </GradientButton>
                    </div>
                  </div>
                  <pre
                    dir={outLang === "ar" ? "rtl" : "ltr"}
                    className="whitespace-pre-wrap rounded-xl border border-border bg-background/40 p-4 text-sm leading-relaxed font-sans"
                  >
                    {output}
                  </pre>
                </GlassCard>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </AppShell>
  );
}
