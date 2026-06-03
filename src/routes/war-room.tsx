import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useLang } from "../lib/i18n";
import { useAppStore, type JobApplication, type ApplicationStatus } from "../lib/application-store";
import { analyzeApplication } from "../lib/war-room.functions";
import { AppShell } from "../components/AppShell";
import { PageFade } from "../components/Motion";
import { GradientButton, GhostButton, GlassCard, Pill, ToolHelp } from "../components/UI";
import { toast } from "sonner";
import { Sparkles, Briefcase, Calendar, MapPin, Search, Plus, ExternalLink, X, MessageSquare, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/war-room")({
  component: WarRoomPage,
});

function WarRoomPage() {
  const { lang } = useLang();
  const store = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // Form states
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("wishlist");
  const [notes, setNotes] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const selectedApp = store.applications.find((a) => a.id === selectedAppId);

  const handleAdd = () => {
    if (!company || !role) {
      toast.error(lang === "ar" ? "الرجاء إدخال الشركة والمسمى الوظيفي" : "Please enter company and role");
      return;
    }
    store.addApplication({
      company,
      role,
      url,
      status,
      notes,
      jobDescription,
      followUpDate: followUpDate || undefined,
    });
    toast.success(lang === "ar" ? "تمت الإضافة بنجاح" : "Added successfully");
    setIsAdding(false);
    resetForm();
  };

  const handleUpdateStatus = (id: string, newStatus: ApplicationStatus) => {
    store.updateApplication(id, { status: newStatus });
  };

  const handleDelete = (id: string) => {
    if (confirm(lang === "ar" ? "متأكد من الحذف؟" : "Are you sure?")) {
      store.deleteApplication(id);
      setSelectedAppId(null);
    }
  };

  const resetForm = () => {
    setCompany("");
    setRole("");
    setUrl("");
    setStatus("wishlist");
    setNotes("");
    setJobDescription("");
    setFollowUpDate("");
  };

  const handleAnalyze = async () => {
    if (!selectedApp) return;
    if (!store.masterCv) {
      toast.error(lang === "ar" ? "الرجاء إضافة السيرة الذاتية الأساسية في الإعدادات" : "Please add your Master CV below first");
      return;
    }
    if (!selectedApp.jobDescription) {
      toast.error(lang === "ar" ? "الرجاء إضافة وصف الوظيفة لهذه الطلب أولاً" : "Please add the Job Description to this application first");
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await analyzeApplication({
        data: {
          masterCv: store.masterCv,
          jobDescription: selectedApp.jobDescription,
          language: lang,
        },
      });
      store.setAiDiagnosis(selectedApp.id, res);
      toast.success(lang === "ar" ? "تم تحليل الطلب بنجاح" : "Analysis complete!");
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (s: ApplicationStatus) => {
    switch (s) {
      case "wishlist": return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "applied": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "interview": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "offer": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "rejected": return "bg-red-500/10 text-red-400 border-red-500/20";
    }
  };

  const getStatusLabel = (s: ApplicationStatus) => {
    switch (s) {
      case "wishlist": return lang === "ar" ? "قائمة الأمنيات" : "Wishlist";
      case "applied": return lang === "ar" ? "تم التقديم" : "Applied";
      case "interview": return lang === "ar" ? "مقابلة" : "Interview";
      case "offer": return lang === "ar" ? "عرض عمل" : "Offer";
      case "rejected": return lang === "ar" ? "مرفوض" : "Rejected";
    }
  };

  return (
    <AppShell>
      <PageFade>
        <section className="px-4 pt-10 pb-6 sm:pt-14">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-1.5 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {lang === "ar" ? "غرفة عمليات التقديم" : "Application War Room"}
            </div>
            <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              <span className="text-gradient-animated">
                {lang === "ar" ? "تتبع وقاتل من أجل وظيفتك" : "Track and fight for your job"}
              </span>
            </h1>
          </div>
        </section>

        <section className="px-4 pb-10">
          <ToolHelp>
            {lang === "ar"
              ? "هذه الأداة هي لوحة التحكم الخاصة بطلبات التوظيف. يمكنك هنا إضافة الوظائف التي تقدمت لها وتتبع حالتها. أهم ميزة هي 'التحليل الذكي'؛ أضف سيرتك الذاتية في الأسفل، ثم أضف وصف الوظيفة لأي طلب، واضغط 'تحديث التحليل' ليقوم الذكاء الاصطناعي باستخراج نقاط الضعف وصياغة أسئلة قوية لتسألها لمسؤول التوظيف، بالإضافة لمسودة إيميل متابعة."
              : "This tool is your job application dashboard. Add applications and track their status. The most powerful feature is 'AI Diagnosis'; paste your Master CV below, add a job description to any application, and hit 'Run Analysis' to let AI find gaps, suggest strategic questions, and draft a follow-up email."}
          </ToolHelp>
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* LIST COLUMN */}
            <div className="md:col-span-1 flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-xl">{lang === "ar" ? "الطلبات" : "Applications"}</h2>
                <GradientButton onClick={() => { setIsAdding(true); setSelectedAppId(null); resetForm(); }} className="h-9 px-3 text-xs rounded-xl">
                  <Plus className="h-4 w-4" />
                </GradientButton>
              </div>

              <div className="flex flex-col gap-3">
                {store.applications.length === 0 && !isAdding && (
                  <div className="text-center p-8 border border-dashed border-border rounded-2xl text-muted-foreground text-sm">
                    {lang === "ar" ? "لا توجد طلبات بعد." : "No applications yet."}
                  </div>
                )}
                {store.applications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => { setSelectedAppId(app.id); setIsAdding(false); }}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      selectedAppId === app.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background/50 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-foreground">{app.role}</div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(app.status)}`}>
                        {getStatusLabel(app.status)}
                      </span>
                    </div>
                    <div className="text-sm text-foreground/70 mb-2">{app.company}</div>
                    <div className="text-xs text-muted-foreground flex justify-between">
                      <span>{new Date(app.dateApplied).toLocaleDateString()}</span>
                      {app.followUpDate && (
                        <span className="text-primary-light flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {new Date(app.followUpDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Master CV input */}
              <div className="mt-8">
                <label className="text-sm font-medium text-foreground/90 mb-2 block">
                  {lang === "ar" ? "سيرتك الذاتية الأساسية (للتحليل)" : "Master CV (for AI Analysis)"}
                </label>
                <textarea
                  value={store.masterCv}
                  onChange={(e) => store.setMasterCv(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 h-32 resize-y text-left"
                  dir="auto"
                  placeholder={lang === "ar" ? "الصق سيرتك الذاتية هنا لتستخدمها في تحليل الطلبات..." : "Paste your CV here to use for analyzing applications..."}
                />
              </div>
            </div>

            {/* DETAILS / ADD FORM COLUMN */}
            <div className="md:col-span-2">
              {isAdding && (
                <GlassCard className="p-6">
                  <h2 className="text-xl font-bold mb-6">
                    {lang === "ar" ? "إضافة طلب جديد" : "Add New Application"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{lang === "ar" ? "الشركة" : "Company"}</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{lang === "ar" ? "المسمى الوظيفي" : "Role"}</label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{lang === "ar" ? "الرابط" : "URL"}</label>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors text-left"
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{lang === "ar" ? "تاريخ المتابعة (اختياري)" : "Follow-up Date (Optional)"}</label>
                      <input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <label className="text-sm font-medium">{lang === "ar" ? "الحالة" : "Status"}</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors appearance-none"
                    >
                      <option value="wishlist">{lang === "ar" ? "قائمة الأمنيات" : "Wishlist"}</option>
                      <option value="applied">{lang === "ar" ? "تم التقديم" : "Applied"}</option>
                      <option value="interview">{lang === "ar" ? "مقابلة" : "Interview"}</option>
                      <option value="offer">{lang === "ar" ? "عرض عمل" : "Offer"}</option>
                      <option value="rejected">{lang === "ar" ? "مرفوض" : "Rejected"}</option>
                    </select>
                  </div>

                  <div className="space-y-2 mb-4">
                    <label className="text-sm font-medium">{lang === "ar" ? "وصف الوظيفة (للتحليل)" : "Job Description (for analysis)"}</label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors h-32 resize-y text-left"
                      dir="auto"
                    />
                  </div>

                  <div className="flex gap-3 justify-end mt-6">
                    <GhostButton onClick={() => setIsAdding(false)}>
                      {lang === "ar" ? "إلغاء" : "Cancel"}
                    </GhostButton>
                    <GradientButton onClick={handleAdd}>
                      {lang === "ar" ? "حفظ" : "Save"}
                    </GradientButton>
                  </div>
                </GlassCard>
              )}

              {selectedApp && !isAdding && (
                <GlassCard className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{selectedApp.role}</h2>
                      <div className="text-foreground/70 flex items-center gap-2">
                        <Briefcase className="h-4 w-4" /> {selectedApp.company}
                        {selectedApp.url && (
                          <a href={selectedApp.url} target="_blank" rel="noreferrer" className="text-primary hover:underline ml-2 inline-flex items-center gap-1">
                            {lang === "ar" ? "الرابط" : "Link"} <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={selectedApp.status}
                        onChange={(e) => handleUpdateStatus(selectedApp.id, e.target.value as ApplicationStatus)}
                        className={`rounded-xl border border-border bg-background/50 px-3 py-1.5 text-sm outline-none font-medium appearance-none ${getStatusColor(selectedApp.status)}`}
                      >
                        <option value="wishlist" className="bg-background text-foreground">{lang === "ar" ? "قائمة الأمنيات" : "Wishlist"}</option>
                        <option value="applied" className="bg-background text-foreground">{lang === "ar" ? "تم التقديم" : "Applied"}</option>
                        <option value="interview" className="bg-background text-foreground">{lang === "ar" ? "مقابلة" : "Interview"}</option>
                        <option value="offer" className="bg-background text-foreground">{lang === "ar" ? "عرض عمل" : "Offer"}</option>
                        <option value="rejected" className="bg-background text-foreground">{lang === "ar" ? "مرفوض" : "Rejected"}</option>
                      </select>
                      <button onClick={() => handleDelete(selectedApp.id)} className="text-muted-foreground hover:text-red-400 p-2">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* AI Analysis Section */}
                  <div className="mt-8 border-t border-border pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        {lang === "ar" ? "تحليل الذكاء الاصطناعي (AI Diagnosis)" : "AI Diagnosis"}
                      </h3>
                      <GradientButton onClick={handleAnalyze} disabled={isAnalyzing} className="h-10 text-xs px-4">
                        {isAnalyzing ? (lang === "ar" ? "جاري التحليل..." : "Analyzing...") : (lang === "ar" ? "تحديث التحليل" : "Run Analysis")}
                      </GradientButton>
                    </div>

                    {!selectedApp.jobDescription && (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200/80 text-sm mb-4">
                        {lang === "ar" ? "تحتاج لإضافة وصف الوظيفة (JD) لتحليل هذا الطلب." : "You need to add a Job Description to analyze this application."}
                        <textarea
                          placeholder={lang === "ar" ? "الصق وصف الوظيفة هنا..." : "Paste JD here..."}
                          className="w-full mt-3 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm outline-none h-24 resize-y text-foreground text-left"
                          dir="auto"
                          onBlur={(e) => store.updateApplication(selectedApp.id, { jobDescription: e.target.value })}
                        />
                      </div>
                    )}

                    {selectedApp.aiDiagnosis ? (
                      <div className="space-y-6 mt-6">
                        <div>
                          <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {lang === "ar" ? "فجوات يجب معالجتها في المقابلة" : "Gaps to address in interview"}
                          </h4>
                          <ul className="space-y-2">
                            {selectedApp.aiDiagnosis.gaps.map((gap, i) => (
                              <li key={i} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-sm text-foreground/80">
                                {gap}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            {lang === "ar" ? "أسئلة استراتيجية لتسألها للمسؤول" : "Strategic questions to ask recruiter"}
                          </h4>
                          <ul className="space-y-2">
                            {selectedApp.aiDiagnosis.questionsForRecruiter.map((q, i) => (
                              <li key={i} className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-sm text-foreground/80">
                                {q}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {selectedApp.aiDiagnosis.followUpEmailDraft && (
                          <div>
                            <h4 className="font-semibold mb-3">
                              {lang === "ar" ? "مسودة إيميل المتابعة" : "Follow-up Email Draft"}
                            </h4>
                            <pre className={`whitespace-pre-wrap rounded-xl border border-border bg-background/40 p-4 text-sm leading-relaxed font-sans ${lang === "ar" ? "text-right" : "text-left"}`} dir={lang === "ar" ? "rtl" : "ltr"}>
                              {selectedApp.aiDiagnosis.followUpEmailDraft}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-8 border border-dashed border-border rounded-2xl text-muted-foreground text-sm">
                        {lang === "ar" ? "لم يتم تحليل هذا الطلب بعد." : "This application has not been analyzed yet."}
                      </div>
                    )}
                  </div>
                </GlassCard>
              )}

              {!selectedApp && !isAdding && (
                <div className="h-full min-h-[400px] flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-2xl bg-background/20">
                  {lang === "ar" ? "اختر طلباً لعرض التفاصيل" : "Select an application to view details"}
                </div>
              )}
            </div>

          </div>
        </section>
      </PageFade>
    </AppShell>
  );
}
