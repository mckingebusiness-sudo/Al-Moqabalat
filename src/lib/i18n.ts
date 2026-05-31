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

  hero_title: { ar: "لا تترك مسيرتك المهنية للصدفة.", en: "Stop leaving your career to chance." },
  hero_sub: {
    ar: "محاكي المقابلات الذكي. اختبر نفسك بأسئلة صممت خصيصاً لوظيفتك، واصنع سيرة ذاتية قوية.",
    en: "The smartest interview simulator. Test yourself against job-specific questions and build a strong CV."
  },
  hero_desc: {
    ar: "تحليل دقيق، تقييم احترافي، واستراتيجيات مخصصة لزيادة فرص قبولك الوظيفي. مجاني بالكامل.",
    en: "Accurate analysis, professional feedback, and tailored strategies to boost your chances. Completely free."
  },
  hero_cta_primary: { ar: "ابدأ المقابلة الآن", en: "Start the interview" },
  hero_cta_secondary: { ar: "حسّن سيرتك الذاتية", en: "Improve your CV" },

  card_interview_title: { ar: "محاكاة المقابلات", en: "Interview Simulator" },
  card_interview_desc: {
    ar: "8 أسئلة فنية وسلوكية، مصممة لمساعدتك على إبراز أفضل إمكانياتك.",
    en: "8 technical and behavioral questions designed to help you showcase your best potential."
  },
  card_interview_btn: { ar: "بدء المحاكاة", en: "Start Simulation" },
  card_cv_title: { ar: "بناء السيرة الذاتية", en: "CV Builder" },
  card_cv_desc: {
    ar: "اصنع سيرتك الذاتية بالمعايير العالمية في ثوانٍ. واضحة واحترافية.",
    en: "Create a world-class CV in seconds. Clear and professional."
  },
  card_cv_btn: { ar: "ابنِ سيرتك", en: "Build CV" },
  card_improve_title: { ar: "تحليل السيرة الذاتية", en: "CV Analysis" },
  card_improve_desc: {
    ar: "نحلل سيرتك الحالية، نوضح نقاط التحسين، ونساعدك على تطويرها.",
    en: "We analyze your current CV, highlight areas for improvement, and help you upgrade it."
  },
  card_improve_btn: { ar: "حلّل الـ CV", en: "Analyze CV" },

  how_title: { ar: "كيف تعمل المنصة؟", en: "How it works" },
  how_step1: { ar: "حدد الهدف: مقابلة أو سيرة ذاتية", en: "Choose your goal: Interview or CV" },
  how_step2: { ar: "زود النظام ببياناتك", en: "Provide your details" },
  how_step3: { ar: "احصل على التقييم الفوري", en: "Get instant feedback" },

  why_title: { ar: "مميزات النظام", en: "System Features" },
  why_1: { ar: "خوارزميات مخصصة لكل قطاع مهني", en: "Algorithms tuned for every sector" },
  why_2: { ar: "ملاحظات دقيقة تصنع الفارق", en: "Accurate feedback that makes a difference" },
  why_3: { ar: "مخرجات بدرجة احترافية عالمية", en: "World-class professional outputs" },

  jobs_title: { ar: "قوة لا تعرف الحدود", en: "Limitless Power" },
  jobs_desc: {
    ar: "من مهندس برمجيات في وادي السيليكون إلى مدير مبيعات في دبي. النظام جاهز لاختبارك في أي تخصص تسند إليه.",
    en: "From a Silicon Valley engineer to a Dubai sales executive. The system is armed to test you in any discipline."
  },

  bilingual_title: { ar: "ثنائية اللغة باحترافية", en: "Professional Bilingual Support" },
  bilingual_desc: {
    ar: "واجهة متكاملة باللغتين العربية والإنجليزية. مصطلحات دقيقة تناسب سوق العمل.",
    en: "Seamless native Arabic and English interfaces. Accurate market terminology."
  },

  privacy_title: { ar: "خصوصية تامة لبياناتك", en: "Total Data Privacy" },
  privacy_desc: {
    ar: "بياناتك بأمان. لا يتم تخزينها أو مشاركتها، وتُحذف بعد الجلسة مباشرة.",
    en: "Your data is safe. It is not stored or shared, and gets deleted right after the session."
  },

  faq_title: { ar: "استفسارات حاسمة", en: "Critical Inquiries" },
  faq_q1: { ar: "هل يتطلب الأمر إنشاء حساب؟", en: "Is an account required?" },
  faq_a1: { ar: "كلا. نحن نكره التعقيد. استخدم الأداة فوراً.", en: "Negative. We hate friction. Use it instantly." },
  faq_q2: { ar: "ما هي التكلفة الحقيقية؟", en: "What's the catch?" },
  faq_a2: { ar: "مجاني بالكامل للوقت الحالي. استغل الفرصة قبل تسعير النظام.", en: "Fully free for now. Exploit the system before monetization." },
  faq_q3: { ar: "أين تذهب بيانات سيرتي الذاتية؟", en: "Where does my CV data go?" },
  faq_a3: { ar: "إلى النسيان. نحن نحللها ونمسحها فور انتهاء الجلسة لضمان سرية معلوماتك.", en: "Into oblivion. We analyze and purge instantly to secure your intel." },

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

  // Interview CV upload
  cv_upload_label: { ar: "ارفع CV (PDF أو نص) أو الصق النص", en: "Upload CV (PDF or text) or paste text" },
  cv_upload_hint: { ar: "اضغط لاختيار ملف PDF أو TXT", en: "Click to choose a PDF or TXT file" },
  cv_parsing: { ar: "بقرأ الملف…", en: "Reading file…" },
  cv_parse_error: { ar: "ما قدرناش نقرأ الملف. جرّب ملف PDF تاني أو الصق النص.", en: "Couldn't read the file. Try another PDF or paste the text." },
  cv_loaded: { ar: "تم تحميل الملف ✓", en: "File loaded ✓" },

  // CV Improve page
  cvi_badge: { ar: "تحليل CV بالـ AI", en: "AI CV Review" },
  cvi_title: { ar: "حسّن سيرتك الذاتية في دقيقة", en: "Improve your CV in a minute" },
  cvi_sub: {
    ar: "ارفع CV بصيغة PDF أو الصق النص. هنطلعلك كل عيب فيه ونديك نسخة محسّنة فورًا.",
    en: "Upload a PDF CV or paste your text. We surface every real flaw and hand you back a fully improved version.",
  },
  cvi_upload: { ar: "ارفع ملف الـ CV", en: "Upload CV file" },
  cvi_upload_hint: { ar: "اسحب أو اضغط لاختيار الملف", en: "Drag or click to choose a file" },
  cvi_upload_types: { ar: "PDF أو TXT — حتى 12,000 حرف", en: "PDF or TXT — up to 12,000 chars" },
  cvi_or_paste: { ar: "أو الصق النص", en: "or paste text" },
  cvi_text_label: { ar: "نص الـ CV", en: "CV text" },
  cvi_text_ph: { ar: "الصق هنا كل محتوى الـ CV…", en: "Paste full CV content here…" },
  cvi_target: { ar: "الوظيفة المستهدفة (اختياري)", en: "Target job (optional)" },
  cvi_lang: { ar: "لغة التحليل", en: "Output language" },
  cvi_analyze: { ar: "ابدأ التحليل والتحسين", en: "Analyze & improve" },
  cvi_analyzing: { ar: "بحلل CV بالـ AI…", en: "Analyzing with AI…" },
  cvi_overall: { ar: "التقييم الإجمالي", en: "Overall score" },
  cvi_ats: { ar: "تقييم ATS", en: "ATS score" },
  cvi_verdict: { ar: "الخلاصة", en: "Verdict" },
  cvi_flaws: { ar: "العيوب اللي اتلقيت", en: "Flaws we found" },
  cvi_fix: { ar: "الحل", en: "Fix" },
  cvi_weak: { ar: "جمل ضعيفة → إعادة صياغة قوية", en: "Weak phrases → stronger rewrite" },
  cvi_before: { ar: "قبل", en: "Before" },
  cvi_after: { ar: "بعد", en: "After" },
  cvi_missing: { ar: "أقسام ناقصة", en: "Missing sections" },
  cvi_new_summary: { ar: "ملخص محسّن (Summary)", en: "Improved summary" },
  cvi_full: { ar: "الـ CV بعد التحسين", en: "Improved full CV" },
  cvi_copy: { ar: "نسخ", en: "Copy" },
  cvi_actions: { ar: "خطوات تعملها دلوقتي", en: "Do this now" },
  cvi_next_cta: { ar: "خلصت التحسين؟ تعالى نتدرب على المقابلة بنفس الـ CV.", en: "CV done? Let's practice the interview with the same CV." },
  cvi_go_interview: { ar: "ابدأ التدرب", en: "Start practice" },
  cvi_err_short: { ar: "النص قصير جدًا. ارفع ملف أو الصق سيرة كاملة.", en: "Text too short. Upload a file or paste a full CV." },
  cvi_err_empty: { ar: "الملف فارغ أو غير قابل للقراءة.", en: "File appears empty or unreadable." },
  cvi_err_file: { ar: "تعذّرت قراءة الملف. جرّب ملف آخر.", en: "Could not read the file. Try a different one." },
  sev_high: { ar: "حرج", en: "High" },
  sev_med: { ar: "متوسط", en: "Medium" },
  sev_low: { ar: "بسيط", en: "Low" },

  // Landing extras
  stat_users: { ar: "مرشح تم اختباره", en: "candidates tested" },
  stat_questions: { ar: "سؤال تم إطلاقه", en: "questions fired" },
  stat_cvs: { ar: "سيرة تم تفكيكها", en: "CVs dissected" },
  proof_title: { ar: "لماذا تختار منصتنا؟", en: "Why Choose Our Platform?" },
  proof_1_t: { ar: "أسئلة مخصصة لوظيفتك بدقة", en: "Questions tailored to your job" },
  proof_1_d: { ar: "لا توجد أسئلة عامة. نظامنا يقرأ سيرتك ويطرح أسئلة في صميم تخصصك.", en: "No generic questions. Our system reads your CV and asks highly relevant questions." },
  proof_2_t: { ar: "تقييم احترافي ومباشر", en: "Professional and Direct Feedback" },
  proof_2_d: { ar: "نخبرك بنقاط قوتك ونقاط ضعفك، ونقدم لك الإجابة النموذجية للنجاح في المقابلة.", en: "We highlight your strengths and weaknesses, providing the ideal answer for success." },
  proof_3_t: { ar: "هندسة السيرة الذاتية باحترافية", en: "Professional CV Engineering" },
  proof_3_d: { ar: "سنوضح لك نقاط التحسين ونعيد كتابتها لتكون جاهزة للحصول على أفضل العروض.", en: "We highlight areas for improvement and rewrite it to secure the best offers." },
  cta_strip_title: { ar: "هل أنت مستعد للمقابلة؟", en: "Are you ready for the interview?" },
  cta_strip_sub: { ar: "30 ثانية من الإعداد تفصلك عن تجربة مقابلة احترافية تحسن من مهاراتك.", en: "30 seconds of setup separate you from a professional interview experience." },

  // Tools hub + 5 tools
  nav_tools: { ar: "الأدوات المهنية", en: "Career Tools" },
  tools_badge: { ar: "6 أدوات ذكاء اصطناعي متطورة", en: "6 Advanced AI Tools" },
  tools_title: { ar: "أدوات لهندسة مسيرتك المهنية", en: "Tools to Engineer Your Career" },
  tools_sub: { ar: "خطابات تقديم احترافية، نصوص تفاوض فعالة، وتحليل دقيق للمهارات.", en: "Professional cover letters, effective negotiation scripts, and precise skill gap analysis." },
  tools_open: { ar: "افتح الأداة", en: "Open Tool" },

  tool_cover_badge: { ar: "الانطباع الأول", en: "First Impression" },
  tool_cover_title: { ar: "خطابات تقديم احترافية", en: "Professional Cover Letters" },
  tool_cover_sub: { ar: "صغ خطاباً بكلماتك يبرز مهاراتك بشكل احترافي.", en: "Craft a letter that highlights your skills professionally." },
  tool_cover_cta: { ar: "اكتب الخطاب", en: "Draft Letter" },

  tool_salary_badge: { ar: "تحديد القيمة", en: "Value Proposition" },
  tool_salary_title: { ar: "تفاوض باحترافية", en: "Professional Negotiation" },
  tool_salary_sub: { ar: "النص المناسب للوصول لأفضل عرض وظيفي.", en: "The right script to land the best job offer." },
  tool_salary_cta: { ar: "ابدأ التفاوض", en: "Start Negotiation" },

  tool_linkedin_badge: { ar: "هويتك الرقمية", en: "Digital Identity" },
  tool_linkedin_title: { ar: "طور حسابك على LinkedIn", en: "Upgrade Your LinkedIn" },
  tool_linkedin_sub: { ar: "5 عناوين مميزة ونبذة احترافية تلفت انتباه مسؤولي التوظيف.", en: "5 standout headlines and a professional bio to attract recruiters." },
  tool_linkedin_cta: { ar: "حسّن حسابك", en: "Enhance Profile" },

  tool_thanks_badge: { ar: "الخطوة الأخيرة", en: "Final Step" },
  tool_thanks_title: { ar: "رسالة ما بعد المقابلة", en: "Post-Interview Message" },
  tool_thanks_sub: { ar: "رسالة قصيرة وذكية تعزز فرصتك في القبول.", en: "A smart, brief message to boost your acceptance chances." },
  tool_thanks_cta: { ar: "صُغ الرسالة", en: "Draft Message" },

  tool_gap_badge: { ar: "تحديد النواقص", en: "Gap Detection" },
  tool_gap_title: { ar: "تحليل فجوة المهارات", en: "Skill Gap Analysis" },
  tool_gap_sub: { ar: "قارن مهاراتك بمتطلبات الوظيفة واحصل على خطة تطوير لمدة 4 أسابيع.", en: "Compare your skills to the JD and get a 4-week development plan." },
  tool_gap_cta: { ar: "اكتشف الفجوات", en: "Discover Gaps" },

  tool_road_badge: { ar: "خريطة الطريق", en: "Roadmap" },
  tool_road_title: { ar: "ارسم مسارك المهني بوضوح", en: "Map Your Career Path Clearly" },
  tool_road_sub: { ar: "خطة منظمة للوصول لهدفك: مشاريع، إنجازات، وخطوات مدروسة.", en: "A structured plan to reach your goal: projects, achievements, and calculated steps." },
  tool_road_cta: { ar: "ارسم الخريطة", en: "Draw Map" },

  tools_more_title: { ar: "هل أنت مستعد للبدء؟", en: "Are you ready to start?" },
  tools_more_sub: { ar: "استخدم أدواتنا المتكاملة للتميز في سوق العمل.", en: "Use our integrated tools to stand out in the job market." },

  why_diff_title: { ar: "لماذا نحن مختلفون؟", en: "Why Are We Different?" },
  about_lead: {
    ar: "نحن نقدم تجربة تفاعلية مخصصة تعتمد على الذكاء الاصطناعي لتحليل وظيفتك وسيرتك الذاتية وتقديم أسئلة تحاكي الواقع بدقة.",
    en: "We offer a personalized interactive experience powered by AI to analyze your job and CV, providing highly realistic questions."
  },
  about_p1_t: { ar: "مصمم لاحتياجات سوق العمل", en: "Tailored to Job Market Needs" },
  about_p1_d: {
    ar: "نحن نفهم الفرق بين هندسة البرمجيات والمبيعات. التدريبات تختلف، ونحن نكيف التجربة.",
    en: "We know the difference between software engineering and sales. Practices vary, and we adapt the experience."
  },
  about_p2_t: { ar: "تقييم موضوعي وصريح", en: "Objective and Direct Assessment" },
  about_p2_d: {
    ar: "سنوفر لك تقييماً صريحاً يوضح نقاط ضعفك بدقة، مع توجيهك للإجابة النموذجية لتطوير مستواك.",
    en: "We provide an honest assessment highlighting your weaknesses accurately, guiding you to the ideal answer to improve your level."
  },
  about_p3_t: { ar: "أدوات متخصصة لكل خطوة", en: "Specialized Tools for Every Step" },
  about_p3_d: {
    ar: "كل أداة مصممة بعناية لمساعدتك في خطوة معينة، من كتابة السيرة الذاتية إلى التحضير للمقابلات.",
    en: "Each tool is carefully designed to assist you in a specific step, from writing a CV to preparing for interviews."
  },
  about_p4_t: { ar: "سرية تامة لمعلوماتك", en: "Total Data Confidentiality" },
  about_p4_d: {
    ar: "لا تسجيل، لا بطاقات ائتمان. بياناتك تُمسح بمجرد إغلاق المتصفح لضمان خصوصيتك.",
    en: "No signups, no credit cards. Your data is purged the moment you close the browser to ensure privacy."
  },

  built_by_title: { ar: "صُنع باحترام بواسطة Mahmoud", en: "Made with respect by Mahmoud" },
  built_by_desc: {
    ar: "محمود مهندس بيشتغل على أدوات تساعد الناس تلاقي شغل أحسن وتتفاوض على راتبها صح. الموقع ده اختصار لسنين تجربة في المقابلات والـ CVs والتفاوض.",
    en: "Mahmoud is an engineer building tools that help people land better jobs and negotiate fair pay. This site condenses years of interview, CV, and negotiation experience.",
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
          document.cookie = `ix-lang=${lang}; path=/; max-age=31536000`;
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
