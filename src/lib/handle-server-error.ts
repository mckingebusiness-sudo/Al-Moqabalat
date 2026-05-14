import { toast } from "sonner";

/**
 * Translate raw server-function errors into friendly Arabic toasts.
 * Use inside any catch() that wraps a useServerFn(...) call.
 */
export function handleServerError(error: unknown): void {
  const msg = error instanceof Error ? error.message : String(error);

  if (/RATE_LIMIT/i.test(msg)) {
    toast.error("وصلت للحد اليومي للأداة دي 👋، حاول تاني بعد ساعة.");
    return;
  }
  if (/DAILY_TOKEN_LIMIT/i.test(msg)) {
    toast.error("الموقع وصل للحد اليومي للاستخدام، رجّع تاني بكره 🙏");
    return;
  }
  if (/AI_TRUNCATED_RESPONSE/i.test(msg)) {
    toast.error("الـ AI اتقطع في نص الرد. دوس generate تاني لو سمحت.");
    return;
  }
  if (/AI_TIMEOUT/i.test(msg)) {
    toast.error("الـ AI أخد وقت طويل في الرد، حاول تاني.");
    return;
  }
  if (/AI_NO_KEYS|MISTRAL_API_KEY missing/i.test(msg)) {
    toast.error("في مشكلة فنية مؤقتة، تحت الإصلاح 🔧");
    return;
  }
  if (/PDF_TOO_SHORT/i.test(msg)) {
    toast.error("الـ PDF ده ممكن يكون صورة — رفّع نسخة text-based أو Word.");
    return;
  }
  if (/UNSUPPORTED_FILE/i.test(msg)) {
    toast.error("نوع الملف ده مش مدعوم. ارفع PDF أو نص.");
    return;
  }

  toast.error("حصل غلط غير متوقّع. جرّب تاني بعد شوية.");
  // eslint-disable-next-line no-console
  console.error("[handleServerError]", error);
}
