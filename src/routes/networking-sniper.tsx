import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useLang } from "../lib/i18n";
import { useAppStore } from "../lib/application-store";
import { runNetworkingSniper } from "../lib/networking-sniper.functions";
import { AppShell } from "../components/AppShell";
import { PageFade } from "../components/Motion";
import { GradientButton, GhostButton, GlassCard, ToolHelp } from "../components/UI";
import { toast } from "sonner";
import { Sparkles, Copy, Mail, Linkedin, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/networking-sniper")({
  component: NetworkingSniperPage,
});

function NetworkingSniperPage() {
  const { lang } = useLang();
  const store = useAppStore();
  const [targetName, setTargetName] = useState("");
  const [targetTitle, setTargetTitle] = useState("");
  const [company, setCompany] = useState("");
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState<"professional" | "casual" | "bold">("professional");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!targetName || !targetTitle || !company || !goal) {
      toast.error(lang === "ar" ? "الرجاء إدخال جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await runNetworkingSniper({
        data: {
          masterCv: store.masterCv,
          targetName,
          targetTitle,
          company,
          goal,
          tone,
          language: lang,
        },
      });
      setResult(res);
      toast.success(lang === "ar" ? "تم توليد الرسائل بنجاح" : "Messages generated successfully");
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(lang === "ar" ? "تم النسخ!" : "Copied!");
  };

  return (
    <AppShell>
      <PageFade>
        <section className="px-4 pt-10 pb-6 sm:pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-1.5 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {lang === "ar" ? "قناص العلاقات (Networking)" : "Networking Sniper"}
            </div>
            <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              <span className="text-gradient-animated">
                {lang === "ar" ? "تواصل بثقة واحترافية" : "Reach out with confidence"}
              </span>
            </h1>
          </div>
        </section>

        <section className="px-4 pb-10">
          <ToolHelp>
            {lang === "ar" ? "أداة كتابة رسائل التواصل. أدخل اسم الشخص ومسماه الوظيفي والشركة، مع هدفك من التواصل، وسيقوم الذكاء الاصطناعي بكتابة رسائل لينكدإن وإيميل احترافية ومخصصة لتساعدك على بناء شبكة علاقات قوية." : "Networking message writer tool. Enter the target's name, title, company, and your goal. AI will craft professional, personalized LinkedIn and email messages to help you build a strong network."}
          </ToolHelp>
          <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold mb-6">
                  {lang === "ar" ? "تفاصيل الهدف" : "Target Details"}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">{lang === "ar" ? "اسم الشخص" : "Name"}</label>
                    <input
                      type="text"
                      value={targetName}
                      onChange={(e) => setTargetName(e.target.value)}
                      placeholder={lang === "ar" ? "مثال: أحمد محمود" : "e.g., John Doe"}
                      className="w-full mt-1 rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{lang === "ar" ? "المسمى الوظيفي" : "Title"}</label>
                    <input
                      type="text"
                      value={targetTitle}
                      onChange={(e) => setTargetTitle(e.target.value)}
                      placeholder={lang === "ar" ? "مثال: Hiring Manager" : "e.g., Engineering Manager"}
                      className="w-full mt-1 rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{lang === "ar" ? "الشركة" : "Company"}</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={lang === "ar" ? "مثال: Google" : "e.g., OpenAI"}
                      className="w-full mt-1 rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{lang === "ar" ? "الهدف من التواصل" : "Goal"}</label>
                    <textarea
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder={lang === "ar" ? "مثال: طلب قهوة افتراضية للسؤال عن ثقافة الشركة" : "e.g., Virtual coffee to ask about company culture"}
                      className="w-full mt-1 rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors h-24 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{lang === "ar" ? "النبرة (Tone)" : "Tone"}</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as any)}
                      className="w-full mt-1 rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors appearance-none"
                    >
                      <option value="professional">{lang === "ar" ? "احترافي ورسمي" : "Professional"}</option>
                      <option value="casual">{lang === "ar" ? "ودي وغير رسمي" : "Casual & Friendly"}</option>
                      <option value="bold">{lang === "ar" ? "مباشر وجريء" : "Bold & Direct"}</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-3">
                      {lang === "ar" 
                        ? (store.masterCv ? "سيتم استخدام سيرتك المحفوظة لتخصيص الرسالة." : "قم بإضافة سيرتك في غرفة العمليات أولاً للحصول على رسائل مخصصة.")
                        : (store.masterCv ? "Your saved CV will be used to personalize the message." : "Add your CV in the War Room first to get personalized messages.")}
                    </p>
                    <GradientButton onClick={handleGenerate} disabled={isLoading} className="w-full justify-center">
                      {isLoading ? (lang === "ar" ? "جاري التوليد..." : "Generating...") : (lang === "ar" ? "توليد الرسائل" : "Generate Messages")}
                    </GradientButton>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-7">
              {!result && !isLoading && (
                <div className="h-full min-h-[400px] flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-2xl bg-background/20 p-6 text-center">
                  {lang === "ar" ? "أدخل بيانات الهدف لتوليد رسائل إيميل ولينكدإن مخصصة لك" : "Enter target details to generate tailored email and LinkedIn messages"}
                </div>
              )}

              {result && (
                <div className="flex flex-col gap-6">
                  {/* Subject Lines */}
                  <GlassCard className="p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      {lang === "ar" ? "عناوين الإيميل (اختر واحداً)" : "Subject Lines (Choose one)"}
                    </h3>
                    <ul className="space-y-2">
                      {result.subjectLines.map((subject: string, i: number) => (
                        <li key={i} className="flex justify-between items-center p-3 rounded-xl border border-border bg-background/50 hover:border-primary/30 transition">
                          <span className="text-sm font-medium">{subject}</span>
                          <button onClick={() => copyToClipboard(subject)} className="text-muted-foreground hover:text-primary p-1">
                            <Copy className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>

                  {/* Email Draft */}
                  <GlassCard className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        {lang === "ar" ? "مسودة الإيميل" : "Email Draft"}
                      </h3>
                      <GhostButton onClick={() => copyToClipboard(result.emailDraft)} className="h-8 text-xs px-3">
                        <Copy className="h-3.5 w-3.5 mr-2" /> {lang === "ar" ? "نسخ" : "Copy"}
                      </GhostButton>
                    </div>
                    <pre className="whitespace-pre-wrap rounded-xl border border-border bg-background/40 p-5 text-sm leading-relaxed font-sans text-left" dir="ltr">
                      {result.emailDraft}
                    </pre>
                  </GlassCard>

                  {/* LinkedIn Message */}
                  <GlassCard className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold flex items-center gap-2">
                        <Linkedin className="h-5 w-5 text-blue-500" />
                        {lang === "ar" ? "رسالة لينكدإن (للإضافة)" : "LinkedIn Note"}
                      </h3>
                      <GhostButton onClick={() => copyToClipboard(result.linkedinMessage)} className="h-8 text-xs px-3">
                        <Copy className="h-3.5 w-3.5 mr-2" /> {lang === "ar" ? "نسخ" : "Copy"}
                      </GhostButton>
                    </div>
                    <pre className="whitespace-pre-wrap rounded-xl border border-border bg-background/40 p-5 text-sm leading-relaxed font-sans text-left" dir="ltr">
                      {result.linkedinMessage}
                    </pre>
                    <p className="text-xs text-muted-foreground mt-3 flex justify-end">
                      {result.linkedinMessage.length} / 300
                    </p>
                  </GlassCard>

                  {/* Tips */}
                  <GlassCard className="p-6 bg-primary/5 border-primary/20">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-primary">
                      <Lightbulb className="h-5 w-5" />
                      {lang === "ar" ? "نصائح للنجاح" : "Pro Tips"}
                    </h3>
                    <ul className="space-y-2 list-disc list-inside text-sm text-foreground/80">
                      {result.tips.map((tip: string, i: number) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </GlassCard>
                </div>
              )}
            </div>
          </div>
        </section>
      </PageFade>
    </AppShell>
  );
}
