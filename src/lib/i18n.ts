import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "ar" | "en";

type Dict = Record<string, { ar: string; en: string }>;

export const dict: Dict = {
  brand: { ar: "تمرّن AI", en: "InterviewX AI" },
  nav_home: { ar: "الرئيسية", en: "Home" },
  nav_interview: { ar: "تدرّب على مقابلة", en: "Practice Interview" },
  nav_cv: { ar: "اعمل CV", en: "Create CV" },
  nav_improve: { ar: "حسّن CV", en: "Improve CV" },
  nav_about: { ar: "عن الموقع", en: "About" },
  language: { ar: "اللغة", en: "Language" },
  theme: { ar: "الوضع", en: "Theme" },

  hero_title: { ar: "ادخل المقابلة وأنت جاهز", en: "Walk into your interview ready" },
  hero_sub: {
    ar: "تدرّب مع HR ذكي بسؤال 8 جداد لكل وظيفة، وارفع CV ليتقاله بالعيوب ويصلحه. عربي وإنجليزي، مجاني، بدون تسجيل.",
    en: "Train with a smart HR coach (8 fresh questions per job), and upload your CV to get its real flaws fixed. Arabic & English, free, no signup.",
  },
  hero_desc: {
    ar: "الذكاء الاصطناعي يقرأ سيرتك ويفهم وظيفتك، ويسألك أسئلة المقابلة الحقيقية اللي بتتقال في السوق.",
    en: "AI reads your CV, understands your target job, and asks the real interview questions employers actually ask.",
  },
  hero_cta_primary: { ar: "ابدأ مقابلة الآن", en: "Start mock interview" },
  hero_cta_secondary: { ar: "حسّن CV بالـ AI", en: "Improve my CV" },

  card_interview_title: { ar: "تدرّب على مقابلة", en: "Practice Interview" },
  card_interview_desc: {
    ar: "8 أسئلة حقيقية مخصصة لوظيفتك. ارفع CV عشان الأسئلة تكون أدق.",
    en: "8 real questions tailored to your job. Upload your CV for sharper questions.",
  },
  card_interview_btn: { ar: "ابدأ المقابلة", en: "Start interview" },
  card_cv_title: { ar: "اعمل CV", en: "Create CV" },
  card_cv_desc: {
    ar: "أنشئ CV أوروبي منظم بكل الأقسام في دقائق.",
    en: "Build a clean European-style CV in minutes.",
  },
  card_cv_btn: { ar: "ابدأ الإنشاء", en: "Start building" },
  card_improve_title: { ar: "حسّن CV", en: "Improve CV" },
  card_improve_desc: {
    ar: "ارفع CV بصيغة PDF أو نص، نطلعلك العيوب وننصلحها ونديك نسخة محسّنة.",
    en: "Upload your CV (PDF or text). We list every flaw and give you a fully improved version.",
  },
  card_improve_btn: { ar: "حسّن الـ CV", en: "Improve CV" },

  how_title: { ar: "كيف يشتغل؟", en: "How it works" },
  how_step1: { ar: "اختر هدفك: مقابلة أو CV", en: "Pick your goal: interview or CV" },
  how_step2: { ar: "املأ بياناتك ببساطة", en: "Fill simple details" },
  how_step3: { ar: "احصل على نتائج فورية", en: "Get instant results" },

  why_title: { ar: "ليه يساعدك؟", en: "Why it helps" },
  why_1: { ar: "مناسب لأي وظيفة، بسيطة أو متخصصة", en: "Works for any job, simple or specialized" },
  why_2: { ar: "تقييم فوري وصادق ونصائح عملية", en: "Instant honest feedback and practical tips" },
  why_3: { ar: "CV احترافي جاهز للتحميل", en: "Professional CV ready to download" },

  jobs_title: { ar: "وظائف مدعومة", en: "Supported jobs" },
  jobs_desc: {
    ar: "كاشير، فني صيانة، عامل مغسلة، محاسب، مدرس، ممرض، ساعي، Frontend، Backend، Data، أي وظيفة تكتبها.",
    en: "Cashier, technician, cleaner, accountant, teacher, nurse, driver, frontend, backend, data — any job you type.",
  },

  bilingual_title: { ar: "عربي وإنجليزي", en: "Arabic & English" },
  bilingual_desc: {
    ar: "واجهة كاملة بالعربي مع دعم RTL، وكمان English.",
    en: "Full Arabic UI with RTL, plus English.",
  },

  privacy_title: { ar: "خصوصيتك أولاً", en: "Privacy first" },
  privacy_desc: {
    ar: "ما نخزنش CV الخاص بيك بشكل دائم. مفتاح الـ AI محمي على السيرفر.",
    en: "We don't store your CV permanently. AI key is protected server-side.",
  },

  faq_title: { ar: "أسئلة شائعة", en: "FAQ" },
  faq_q1: { ar: "هل لازم أعمل حساب؟", en: "Do I need an account?" },
  faq_a1: { ar: "لأ، تقدر تستخدم الموقع مباشرة.", en: "No, use it directly." },
  faq_q2: { ar: "هل الموقع مجاني؟", en: "Is it free?" },
  faq_a2: { ar: "آه، مجاني في النسخة الحالية.", en: "Yes, free in this version." },
  faq_q3: { ar: "هل بتخزنوا الـ CV بتاعي؟", en: "Do you store my CV?" },
  faq_a3: { ar: "لأ، بنستخدمه مؤقتاً علشان نحسن النتائج.", en: "No, used temporarily to improve results." },

  footer_made: { ar: "صُنع بواسطة", en: "Made by" },
  footer_links: { ar: "روابط", en: "Links" },
  footer_legal: { ar: "قانوني", en: "Legal" },
  privacy: { ar: "الخصوصية", en: "Privacy" },
  terms: { ar: "الشروط", en: "Terms" },

  // Interview setup
  setup_title: { ar: "إعداد المقابلة", en: "Interview Setup" },
  setup_desc: { ar: "املأ البيانات وابدأ خلال ثوانٍ.", en: "Fill in details and start in seconds." },
  candidate_name: { ar: "اسمك (اختياري)", en: "Your name (optional)" },
  experience_level: { ar: "مستوى الخبرة", en: "Experience level" },
  exp_none: { ar: "بدون خبرة", en: "No experience" },
  exp_fresh: { ar: "حديث التخرج", en: "Fresh graduate" },
  exp_junior: { ar: "Junior", en: "Junior" },
  exp_mid: { ar: "Mid-level", en: "Mid-level" },
  exp_senior: { ar: "Senior", en: "Senior" },
  education: { ar: "التعليم (اختياري)", en: "Education (optional)" },
  main_skills: { ar: "أهم مهاراتك (اختياري)", en: "Main skills (optional)" },
  target_job: { ar: "الوظيفة المستهدفة *", en: "Target job *" },
  target_job_ph: {
    ar: "مثال: كاشير، فني صيانة، محاسب، Frontend Developer",
    en: "Example: Cashier, Technician, Accountant, Frontend Developer",
  },
  target_company: { ar: "اسم الشركة (اختياري)", en: "Company name (optional)" },
  company_type: { ar: "نوع الشركة (اختياري)", en: "Company type (optional)" },
  job_description: { ar: "وصف الوظيفة (اختياري)", en: "Job description (optional)" },
  motivation: { ar: "ليه عايز الوظيفة دي؟ (اختياري)", en: "Why this job? (optional)" },
  cv_optional: { ar: "اختياري: الصق نص CV لو عايز الأسئلة أدق", en: "Optional: paste CV text for sharper questions" },
  language_label: { ar: "لغة المقابلة", en: "Interview language" },
  lang_ar: { ar: "عربي", en: "Arabic" },
  lang_en: { ar: "إنجليزي", en: "English" },
  lang_mixed: { ar: "مختلط", en: "Mixed" },
  interview_type: { ar: "نوع المقابلة", en: "Interview type" },
  type_friendly: { ar: "HR ودود", en: "Friendly HR" },
  type_strict: { ar: "HR صارم", en: "Strict HR" },
  type_technical: { ar: "تقنية", en: "Technical" },
  type_behavioral: { ar: "سلوكية", en: "Behavioral" },
  type_fresh: { ar: "حديث التخرج", en: "Fresh Graduate" },
  type_career: { ar: "تغيير مسار", en: "Career Change" },
  questions_count: { ar: "عدد الأسئلة", en: "Number of questions" },
  q_quick: { ar: "سريعة (5)", en: "Quick (5)" },
  q_standard: { ar: "قياسية (8)", en: "Standard (8)" },
  start_interview: { ar: "ابدأ المقابلة", en: "Start interview" },
  loading: { ar: "جاري التحميل…", en: "Loading…" },
  preparing: { ar: "بجهز المقابلة…", en: "Preparing interview…" },

  // Session
  question_of: { ar: "سؤال", en: "Question" },
  of: { ar: "من", en: "of" },
  your_answer: { ar: "إجابتك", en: "Your answer" },
  answer_ph: { ar: "اكتب إجابتك هنا…", en: "Type your answer here…" },
  submit_answer: { ar: "أرسل الإجابة", en: "Submit answer" },
  evaluating: { ar: "بقيّم إجابتك…", en: "Evaluating…" },
  next_question: { ar: "السؤال التالي", en: "Next question" },
  finish_interview: { ar: "إنهاء المقابلة", en: "Finish interview" },
  score: { ar: "التقييم", en: "Score" },
  strengths: { ar: "نقاط القوة", en: "Strengths" },
  weaknesses: { ar: "نقاط الضعف", en: "Weaknesses" },
  better_answer: { ar: "إجابة أفضل", en: "Improved answer" },
  advice: { ar: "نصيحة عملية", en: "Practical advice" },
  next_tip: { ar: "نصيحة للسؤال التالي", en: "Next tip" },

  // Report
  report_title: { ar: "تقرير المقابلة", en: "Interview Report" },
  overall_score: { ar: "التقييم الإجمالي", en: "Overall score" },
  verdict: { ar: "الخلاصة", en: "Verdict" },
  top_strengths: { ar: "أبرز نقاط القوة", en: "Top strengths" },
  top_weaknesses: { ar: "أبرز نقاط الضعف", en: "Top weaknesses" },
  improvements: { ar: "أهم تحسينات", en: "Key improvements" },
  practice_plan: { ar: "خطة تدريب", en: "Practice plan" },
  cv_tips: { ar: "نصائح لتحسين الـ CV", en: "CV improvement tips" },
  next_tips: { ar: "نصائح للمقابلة القادمة", en: "Next interview tips" },
  print_report: { ar: "طباعة التقرير", en: "Print report" },
  new_interview: { ar: "مقابلة جديدة", en: "New interview" },
  go_cv: { ar: "اذهب لإنشاء CV", en: "Go to CV Builder" },

  // CV Builder
  cv_title: { ar: "منشئ السيرة الذاتية", en: "CV Builder" },
  cv_desc: { ar: "أنشئ CV أوروبي بسيط في دقائق.", en: "Build a clean European CV in minutes." },
  step: { ar: "الخطوة", en: "Step" },
  step_personal: { ar: "بياناتك", en: "Personal" },
  step_summary: { ar: "نبذة", en: "Summary" },
  step_experience: { ar: "خبرات", en: "Experience" },
  step_education: { ar: "تعليم", en: "Education" },
  step_skills: { ar: "مهارات", en: "Skills" },
  step_extras: { ar: "إضافات", en: "Extras" },
  step_preview: { ar: "معاينة", en: "Preview" },
  full_name: { ar: "الاسم الكامل *", en: "Full name *" },
  prof_title: { ar: "المسمى المهني *", en: "Professional title *" },
  phone: { ar: "الهاتف", en: "Phone" },
  email: { ar: "الإيميل", en: "Email" },
  location: { ar: "الموقع", en: "Location" },
  summary: { ar: "نبذة مختصرة", en: "Summary" },
  add: { ar: "إضافة", en: "Add" },
  remove: { ar: "حذف", en: "Remove" },
  job_title: { ar: "المسمى الوظيفي", en: "Job title" },
  company: { ar: "الشركة", en: "Company" },
  start_date: { ar: "بداية", en: "Start" },
  end_date: { ar: "نهاية", en: "End" },
  description: { ar: "الوصف", en: "Description" },
  degree: { ar: "الشهادة", en: "Degree" },
  institution: { ar: "الجامعة/المعهد", en: "Institution" },
  year: { ar: "السنة", en: "Year" },
  details: { ar: "تفاصيل", en: "Details" },
  skills_label: { ar: "المهارات (افصل بفاصلة)", en: "Skills (comma separated)" },
  languages_label: { ar: "اللغات", en: "Languages" },
  courses_label: { ar: "الدورات", en: "Courses" },
  certificates_label: { ar: "الشهادات", en: "Certificates" },
  projects_label: { ar: "المشاريع", en: "Projects" },
  next: { ar: "التالي", en: "Next" },
  back: { ar: "السابق", en: "Back" },
  cv_lang: { ar: "لغة الـ CV", en: "CV language" },
  download_pdf: { ar: "تحميل / طباعة PDF", en: "Download / Print PDF" },
  improve_ai: { ar: "حسّن CV بالذكاء الاصطناعي", en: "Improve CV with AI" },
  improving: { ar: "بحسن الـ CV…", en: "Improving CV…" },
  ai_optional: { ar: "خطوة اختيارية", en: "Optional step" },

  // Errors
  err_temp: { ar: "حدث خطأ مؤقت. حاول مرة أخرى.", en: "Temporary error. Try again." },
  err_limit: {
    ar: "وصلنا للحد اليومي من استخدام الذكاء الاصطناعي. جرّب بكرة.",
    en: "Daily AI usage limit reached. Try again tomorrow.",
  },
  err_long: { ar: "إجابتك طويلة جداً. اختصرها.", en: "Your answer is too long." },

  // Privacy/Terms/About
  about_title: { ar: "عن الموقع", en: "About" },
  about_p1: {
    ar: "تمرّن AI موقع بسيط يساعدك تتدرب على مقابلات العمل وتعمل CV احترافي. مناسب لأي وظيفة.",
    en: "InterviewX AI is a simple platform to help you practice job interviews and build a professional CV. Works for any job.",
  },
  privacy_p1: {
    ar: "ما فيش إعلانات. ما بنبيعش بياناتك. CV ما بيتخزنش بشكل دائم في النسخة الحالية. مفتاح الـ AI محمي على السيرفر.",
    en: "No ads. We don't sell data. CVs are not stored permanently in this version. AI key is protected server-side.",
  },
  terms_p1: {
    ar: "الموقع للاستخدام الشخصي والتدريبي. لا تعتمد على نتائج الـ AI كقرار توظيف نهائي.",
    en: "For personal practice use only. Do not rely on AI output as a final hiring decision.",
  },
};

export const useLang = create<{ lang: Lang; setLang: (l: Lang) => void }>()(
  persist(
    (set) => ({
      lang: "ar",
      setLang: (lang) => {
        set({ lang });
        if (typeof document !== "undefined") {
          document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
          document.documentElement.lang = lang;
        }
      },
    }),
    { name: "ix-lang" },
  ),
);

export function t(key: keyof typeof dict, lang: Lang) {
  return dict[key]?.[lang] ?? key;
}

export const useT = () => {
  const { lang } = useLang();
  return (key: keyof typeof dict) => t(key, lang);
};
