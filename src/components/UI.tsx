import { cn } from "@/lib/utils";
import { useEffect, useState, type ButtonHTMLAttributes, type HTMLAttributes } from "react";

export function GlassCard({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass-card p-6", className)} {...rest} />;
}

export function GradientButton({
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "btn-gradient inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold disabled:opacity-50 disabled:pointer-events-none",
        className,
      )}
      {...rest}
    />
  );
}

export function GhostButton({
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-background/40 px-6 text-sm font-semibold backdrop-blur transition hover:bg-accent disabled:opacity-50 disabled:pointer-events-none",
        className,
      )}
      {...rest}
    />
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-sm font-medium text-foreground/90">{children}</label>;
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30",
        props.className,
      )}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30",
        props.className,
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const className = cn(
    "w-full appearance-none rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30",
    props.className,
  );

  if (!mounted) {
    return <div aria-hidden className={cn(className, "min-h-10")} />;
  }

  return (
    <select
      {...props}
      className={className}
    />
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-background/40 px-3 py-1 text-xs font-medium text-foreground/80">
      {children}
    </span>
  );
}

export function ScoreRing({ score }: { score: number }) {
  const safeScore = Math.max(0, Math.min(10, Number(score) || 0));
  const pct = safeScore * 10;
  return (
    <div
      className="relative grid h-20 w-20 place-items-center rounded-full"
      style={{
        background: `conic-gradient(var(--brand-via) ${pct}%, color-mix(in oklab, var(--foreground) 10%, transparent) 0)`,
      }}
    >
      <div className="grid h-16 w-16 place-items-center rounded-full bg-card text-center">
        <div className="text-xl font-bold leading-none">{safeScore.toFixed(1)}</div>
        <div className="text-[10px] text-muted-foreground">/ 10</div>
      </div>
    </div>
  );
}

import { Info } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function ToolHelp({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();
  
  return (
    <div className="mx-auto max-w-3xl mb-8">
      <button onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-light transition-colors">
        <Info className="h-4 w-4" />
        {lang === "ar" ? (open ? "إخفاء الشرح" : "شرح الأداة (كيف تعمل؟)") : (open ? "Hide explanation" : "Tool Explanation (How it works?)")}
      </button>
      {open && (
        <div className="mt-3 p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-foreground/90 leading-relaxed text-left rtl:text-right">
          {children}
        </div>
      )}
    </div>
  );
}
