import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, FileText, Linkedin, Mail, Map as MapIcon, Target, Wand2, CheckCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/UI";
import { PageFade, Stagger, StaggerItem, HoverLift } from "@/components/Motion";
import { useT, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Career Tools — InterviewX AI" },
      { name: "description", content: "Free AI career tools: cover letter, salary negotiation, LinkedIn bio, thank-you email, skill gap analyzer, and career roadmap." },
    ],
  }),
  component: ToolsHub,
});

function ToolsHub() {
  const t = useT();
  const { lang } = useLang();
  const tools = [
    {
      to: "/war-room",
      icon: <Target className="h-8 w-8" />,
      title: lang === "ar" ? "غرفة عمليات التقديم" : "Application War Room",
      desc:
        lang === "ar"
          ? "تتبع طلباتك، حلل الفجوات، واعرف ماذا تسأل في المقابلة."
          : "Track applications, find gaps against the JD, and prep strategic questions.",
      howToUse:
        lang === "ar"
          ? "كيفية الاستخدام: أضف تفاصيل الوظيفة والسيرة الذاتية، وسيقوم الذكاء الاصطناعي بتشخيص نقاط ضعفك وكتابة إيميل متابعة لك."
          : "How to use: Add job details and your CV, and AI will diagnose your gaps and draft a follow-up email."
    },
    {
      to: "/networking-sniper",
      icon: <Target className="h-8 w-8" />,
      title: lang === "ar" ? "قناص العلاقات (Networking)" : "Networking Sniper",
      desc:
        lang === "ar"
          ? "تواصل مع صناع القرار برسائل لينكدإن وإيميلات لا تُرفض."
          : "Reach out to decision-makers with cold emails and LinkedIn notes that convert.",
      howToUse:
        lang === "ar"
          ? "كيفية الاستخدام: أدخل اسم المسؤول وبيانات الوظيفة ليولد النظام لك إيميل تواصل مباشر ورسالة LinkedIn جاهزة للنسخ."
          : "How to use: Enter the recruiter's name and job details to instantly generate a cold email and a LinkedIn connection note."
    },
    {
      to: "/proof-tailor",
      icon: <CheckCircle className="h-8 w-8" />,
      title: lang === "ar" ? "تفصيل CV بالدليل" : "Proof-Based Resume Tailor",
      desc:
        lang === "ar"
          ? "حلل الوظيفة ضد سيرتك بالدليل قبل أي تعديل. بدون كذب أو هلوسة."
          : "Audit your CV against a job with evidence before rewriting. No hallucinated experience.",
      howToUse:
        lang === "ar"
          ? "كيفية الاستخدام: الصق الوظيفة المستهدفة وسيرتك، وسيطابق النظام خبراتك الحقيقية مع المتطلبات خطوة بخطوة."
          : "How to use: Paste the JD and your CV. The system will map your real experience directly to the job requirements."
    },
    {
      to: "/cover-letter",
      icon: <Mail className="h-8 w-8" />,
      title: lang === "ar" ? "مولد خطاب التغطية" : "Cover Letter Generator",
      desc:
        lang === "ar"
          ? "خطاب تغطية مخصص لكل وظيفة بأدلة رقمية وبدون عبارات مستهلكة."
          : "A tailored, recruiter-grade cover letter for each job, with quantified proof and zero clichés.",
      howToUse:
        lang === "ar"
          ? "كيفية الاستخدام: أدخل اسمك والوظيفة والشركة ونبذة عن خبرتك، وسيصيغ النظام خطاباً احترافياً جاهزاً."
          : "How to use: Enter your name, target job, company, and a short background, and get a polished cover letter instantly."
    },
    {
      to: "/salary-coach",
      icon: <Briefcase className="h-8 w-8" />,
      title: lang === "ar" ? "مدرب التفاوض على الراتب" : "Salary Negotiation Coach",
      desc:
        lang === "ar"
          ? "سكربت تفاوض كامل تقرأه حرفياً للحصول على راتب أعلى."
          : "A word-for-word negotiation script you can read out loud to land a higher offer.",
      howToUse:
        lang === "ar"
          ? "كيفية الاستخدام: أدخل العرض الحالي وراتبك المستهدف وخبرتك، وستحصل على سكربت تفاوض بأرقام واضحة."
          : "How to use: Enter the offer, your target salary, and experience to get an exact negotiation script with numbers."
    },
    {
      to: "/linkedin",
      icon: <Linkedin className="h-8 w-8" />,
      title: lang === "ar" ? "محسّن بروفايل لينكدإن" : "LinkedIn Profile Optimizer",
      desc:
        lang === "ar"
          ? "5 عناوين احترافية وثلاث صيغ لقسم النبذة مع كلمات مفتاحية."
          : "5 sharp headlines plus three About variations and recruiter-ready keywords.",
      howToUse:
        lang === "ar"
          ? "كيفية الاستخدام: أدخل دورك الحالي ومهاراتك وإنجازاتك، وسيعيد النظام صياغة بروفايلك بالكامل."
          : "How to use: Enter your role, skills, and achievements to get a full headline, About, and keywords rewrite."
    },
    {
      to: "/thank-you",
      icon: <Mail className="h-8 w-8" />,
      title: lang === "ar" ? "إيميل الشكر بعد المقابلة" : "Post-Interview Thank-You Email",
      desc:
        lang === "ar"
          ? "إيميل شكر قصير ومحدد يعزز فرصتك بعد المقابلة."
          : "A short, specific thank-you email that reinforces your fit after the interview.",
      howToUse:
        lang === "ar"
          ? "كيفية الاستخدام: أدخل اسم المحاور والشركة وأبرز ما دار في المقابلة، وسيكتب النظام إيميل شكر احترافي."
          : "How to use: Enter the interviewer, company, and what you discussed to get a polished thank-you email."
    },
    {
      to: "/skill-gap",
      icon: <Target className="h-8 w-8" />,
      title: lang === "ar" ? "محلل فجوة المهارات" : "Skill Gap Analyzer",
      desc:
        lang === "ar"
          ? "قارن مهاراتك بمتطلبات الوظيفة واحصل على خطة تعلّم لـ 4 أسابيع."
          : "Compare your skills to the JD and get an honest fit score plus a 4-week learning plan.",
      howToUse:
        lang === "ar"
          ? "كيفية الاستخدام: الصق وصف الوظيفة ومهاراتك الحالية، وسيحدد النظام الفجوات وخطة لسدها."
          : "How to use: Paste the JD and your current skills to get a gap breakdown and a weekly plan to close them."
    },
    {
      to: "/roadmap",
      icon: <MapIcon className="h-8 w-8" />,
      title: lang === "ar" ? "خريطة المسار المهني" : "Career Roadmap Planner",
      desc:
        lang === "ar"
          ? "خطة مرحلية مخصصة للانتقال من دورك الحالي إلى الدور المستهدف."
          : "A time-boxed, phase-by-phase plan to move from your current role to your target role.",
      howToUse:
        lang === "ar"
          ? "كيفية الاستخدام: أدخل دورك الحالي والمستهدف والمدة الزمنية، وسيبني النظام خريطة مرحلية بموارد ومشاريع حقيقية."
          : "How to use: Enter your current and target roles plus a timeframe to get a phased roadmap with real resources."
    },
    { 
      to: "/cv-builder", 
      icon: <FileText className="h-8 w-8" />, 
      title: t("cv_title"), 
      desc: t("cv_desc"),
      howToUse:
        lang === "ar"
          ? "كيفية الاستخدام: أدخل بياناتك أو استخدم الذكاء الاصطناعي لتحسينها، وحمل نسختك بصيغة PDF فوراً."
          : "How to use: Enter your details, optionally use AI to improve them, and download as PDF instantly."
    },
    { 
      to: "/cv-improve", 
      icon: <Wand2 className="h-8 w-8" />, 
      title: t("card_improve_title"), 
      desc: t("card_improve_desc"),
      howToUse:
        lang === "ar"
          ? "كيفية الاستخدام: ارفع ملف السيرة أو الصق النص ليقوم النظام باكتشاف الأخطاء وتصحيحها في لحظات."
          : "How to use: Upload a file or paste your CV text for an instant AI audit and rewrite."
    },
    { 
      to: "/", 
      icon: <CheckCircle className="h-8 w-8" />, 
      title: t("card_interview_title"), 
      desc: t("card_interview_desc"),
      howToUse:
        lang === "ar"
          ? "كيفية الاستخدام: ابدأ مقابلة من الرئيسية، وسيطرح عليك المحاكي 8 أسئلة لتقييم إجاباتك."
          : "How to use: Start an interview from the home page to get 8 targeted questions and receive feedback."
    }
  ];
  return (
    <AppShell>
      <PageFade>
        <section className="px-4 pt-12 pb-6 sm:pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-1.5 text-xs font-medium backdrop-blur">
              <Wand2 className="h-3.5 w-3.5 text-primary" />
              {t("tools_badge")}
            </div>
            <h1 className="text-balance text-3xl font-extrabold sm:text-5xl">
              <span className="text-gradient-animated">{t("tools_title")}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-foreground/80">{t("tools_sub")}</p>
          </div>
        </section>
      </PageFade>
      <section className="px-4 pb-14">
        <Stagger className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tt) => (
            <StaggerItem key={tt.to} className="h-full">
              <HoverLift className="h-full">
                <Link to={tt.to} className="block h-full">
                  <GlassCard className="flex h-full flex-col gap-4 p-6 sm:p-8">
                    <div className="inline-grid h-16 w-16 place-items-center rounded-2xl btn-gradient mb-2">
                      {tt.icon}
                    </div>
                    <h3 className="text-2xl font-bold">{tt.title}</h3>
                    <p className="text-base text-foreground/80 leading-relaxed">{tt.desc}</p>
                    {tt.howToUse && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-sm text-muted-foreground leading-relaxed">{tt.howToUse}</p>
                      </div>
                    )}
                    <p className="mt-4 text-sm font-semibold text-primary">{t("tools_open")} →</p>
                  </GlassCard>
                </Link>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </AppShell>
  );
}
