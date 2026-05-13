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
  stat_users: { ar: "متدرّب", en: "candidates trained" },
  stat_questions: { ar: "سؤال مقابلة", en: "interview questions" },
  stat_cvs: { ar: "CV تم تحسينه", en: "CVs improved" },
  proof_title: { ar: "ليه آلاف اختاروا تمرّن AI؟", en: "Why thousands chose us" },
  proof_1_t: { ar: "أسئلة بجد لوظيفتك", en: "Questions that match YOUR job" },
  proof_1_d: { ar: "مش أسئلة عامة. الـ AI بيقرأ الـ CV ويسأل أسئلة المقابلة الحقيقية في مجالك.", en: "Not generic. AI reads your CV and asks the real questions employers ask in your field." },
  proof_2_t: { ar: "تقييم صريح بعد كل إجابة", en: "Honest feedback after every answer" },
  proof_2_d: { ar: "نقول لك القوة، الضعف، وإجابة محسنّة جاهزة تقولها.", en: "We tell you strengths, weaknesses, and an improved answer you can literally say." },
  proof_3_t: { ar: "تحسين CV بالعيوب", en: "CV improvement that lists every flaw" },
  proof_3_d: { ar: "ما بنقول لك \"شكله حلو\". بنطلع كل عيب ونصلحه ونرجعلك نسخة جديدة.", en: "We don't say \"looks great\". We surface every flaw, fix it, and return a new version." },
  cta_strip_title: { ar: "جاهز تدخل المقابلة بثقة؟", en: "Ready to walk in confident?" },
  cta_strip_sub: { ar: "كل اللي محتاج تعمله: 30 ثانية إعداد، وبعدين ابدأ.", en: "30 seconds of setup, then start." },

  // Tools hub + 5 tools
  nav_tools: { ar: "أدوات مهنية", en: "Career Tools" },
  tools_badge: { ar: "6 أدوات مجانية بالـ AI", en: "6 free AI career tools" },
  tools_title: { ar: "أدوات تكمّل رحلتك المهنية", en: "Tools to complete your career journey" },
  tools_sub: { ar: "خطاب تقديم، تفاوض راتب، LinkedIn، إيميل شكر، تحليل فجوة المهارات، وخريطة طريق مهنية كاملة.", en: "Cover letter, salary negotiation, LinkedIn, thank-you email, skill gap, and a full career roadmap." },
  tools_open: { ar: "ابدأ", en: "Open" },

  tool_cover_badge: { ar: "خطاب تقديم", en: "Cover Letter" },
  tool_cover_title: { ar: "اكتب خطاب تقديم مخصص", en: "Write a tailored cover letter" },
  tool_cover_sub: { ar: "خطاب احترافي بكلماتك خلال ثوانٍ، جاهز للإرسال.", en: "A professional letter in your words, ready to send." },
  tool_cover_cta: { ar: "اكتب الخطاب", en: "Generate letter" },

  tool_salary_badge: { ar: "تفاوض على الراتب", en: "Salary Negotiation" },
  tool_salary_title: { ar: "اتفاوض على الراتب باحترافية", en: "Negotiate your salary like a pro" },
  tool_salary_sub: { ar: "هنكتب لك السكربت كامل اللي تقوله للـ HR لما يقدم لك عرض.", en: "Get the full script you can literally say to HR." },
  tool_salary_cta: { ar: "ابني السكربت", en: "Build script" },

  tool_linkedin_badge: { ar: "بروفايل LinkedIn", en: "LinkedIn" },
  tool_linkedin_title: { ar: "حسّن بروفايل LinkedIn", en: "Optimize your LinkedIn profile" },
  tool_linkedin_sub: { ar: "5 خيارات Headline + قسم About احترافي بالكامل.", en: "5 headline options + a complete pro About section." },
  tool_linkedin_cta: { ar: "حسّن البروفايل", en: "Rewrite profile" },

  tool_thanks_badge: { ar: "إيميل شكر", en: "Thank-you Email" },
  tool_thanks_title: { ar: "إيميل شكر بعد المقابلة", en: "Thank-you email after interview" },
  tool_thanks_sub: { ar: "إيميل قصير ومحترم يخليك تفضل في بال الـ HR.", en: "A short polite email that keeps you top of mind." },
  tool_thanks_cta: { ar: "اكتب الإيميل", en: "Write email" },

  tool_gap_badge: { ar: "تحليل الفجوة", en: "Skill Gap" },
  tool_gap_title: { ar: "حلّل الفجوة بين مهاراتك والوظيفة", en: "Analyze your skill gap" },
  tool_gap_sub: { ar: "الصق وصف الوظيفة ومهاراتك، وهنطلعلك الفجوة وخطة 4 أسابيع.", en: "Paste the JD + your skills and get the gap + a 4-week plan." },
  tool_gap_cta: { ar: "حلّل الفجوة", en: "Analyze gap" },

  tool_road_badge: { ar: "خريطة طريق", en: "Career Roadmap" },
  tool_road_title: { ar: "خريطة طريق مهنية مخصصة لك", en: "Your personalized career roadmap" },
  tool_road_sub: { ar: "من وظيفتك الحالية للحلم — خطة بمراحل ومشاريع وراتب متوقع.", en: "From where you are to your dream role — phased plan with projects, salary, and risks." },
  tool_road_cta: { ar: "ابني الخريطة", en: "Build my roadmap" },

  tools_more_title: { ar: "أدوات احترافية كمان لرحلتك", en: "More pro tools for your journey" },
  tools_more_sub: { ar: "خطاب تقديم، تفاوض راتب، LinkedIn، فجوة المهارات، وخريطة طريق كاملة.", en: "Cover letters, salary scripts, LinkedIn, skill gap, and a full roadmap." },

  why_diff_title: { ar: "ليه الموقع ده مختلف؟", en: "Why this platform is different" },
  about_lead: {
    ar: "InterviewX مش مجرد موقع أسئلة جاهزة. كل سؤال، كل تقييم، وكل سطر في CV بيتولّد من ذكاء اصطناعي قوي بيقرأ سياقك الحقيقي: وظيفتك، شركتك، خبرتك، ولغتك.",
    en: "InterviewX isn't a quiz of canned questions. Every question, every score, every CV line is generated by a strong AI that reads your real context: your role, target company, experience, and language.",
  },
  about_p1_t: { ar: "بُني لسوق العمل العربي والعالمي", en: "Built for MENA and global markets" },
  about_p1_d: {
    ar: "بنفهم الفرق بين مقابلة كاشير في القاهرة، Backend Engineer في دبي، أو Product Manager في برلين. الأسئلة بتختلف، النصايح بتختلف، والتفاوض بيختلف.",
    en: "We get the difference between interviewing for cashier in Cairo, backend engineer in Dubai, or PM in Berlin. Questions differ, advice differs, negotiation differs.",
  },
  about_p2_t: { ar: "تقييم صادق، مش تشجيع فاضي", en: "Honest evaluation, not empty praise" },
  about_p2_d: {
    ar: "ما بنقولش \"إجابة رائعة\" لو الإجابة ضعيفة. بنقولك بالظبط فين الخلل، وإزاي تقولها أحسن المرة الجاية.",
    en: "We don't say \"great answer\" when it's weak. We tell you exactly what failed and the better version to say next time.",
  },
  about_p3_t: { ar: "كل أداة لها ذكاء مخصص", en: "Each tool has its own specialist AI" },
  about_p3_d: {
    ar: "خطاب التقديم بيكتبه مدرب توظيف. تفاوض الراتب بيقوده مفاوض راتب. LinkedIn بيحسّنه استراتيجي بروفايل. كل أداة System Prompt مختلف.",
    en: "Cover letters by a hiring writer. Salary scripts by a negotiator. LinkedIn by a profile strategist. Each tool has a different system prompt.",
  },
  about_p4_t: { ar: "خصوصية كاملة وبدون حسابات", en: "Full privacy, no accounts" },
  about_p4_d: {
    ar: "ما بنطلبش إيميل ولا كلمة سر ولا بطاقة. CV بيتم تحليله ويتنسي. كل حاجة بتحصل على المتصفح بتاعك.",
    en: "No email, no password, no card. Your CV is analyzed and forgotten. Everything happens in your browser session.",
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
