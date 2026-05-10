import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Languages, Moon, Sun, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { useLang, useT } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { lang } = useLang();
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [lang, theme]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="blob animate-float" style={{ width: 480, height: 480, top: -120, left: -100, background: "var(--brand-from)" }} />
        <div className="blob animate-float" style={{ width: 520, height: 520, bottom: -160, right: -120, background: "var(--brand-to)", animationDelay: "-4s" }} />
        <div className="blob animate-float" style={{ width: 360, height: 360, top: "40%", left: "55%", background: "var(--brand-via)", animationDelay: "-8s", opacity: 0.3 }} />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

function Navbar() {
  const t = useT();
  const { lang, setLang } = useLang();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: t("nav_home") },
    { to: "/interview", label: t("nav_interview") },
    { to: "/cv-builder", label: t("nav_cv") },
    { to: "/cv-improve", label: t("nav_improve") },
    { to: "/about", label: t("nav_about") },
  ] as const;

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 no-print sm:px-6 sm:pt-4">
      <div className="glass-card mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl btn-gradient">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-gradient text-lg">{t("brand")}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
              activeProps={{ className: "rounded-xl px-3 py-2 text-sm font-semibold text-foreground bg-accent" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="rounded-xl border border-border bg-background/50 px-3 py-2 text-xs font-semibold transition hover:bg-accent"
            aria-label={t("language")}
          >
            <span className="inline-flex items-center gap-1">
              <Languages className="h-3.5 w-3.5" />
              {lang === "ar" ? "EN" : "ع"}
            </span>
          </button>
          <button
            onClick={toggle}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-background/50 transition hover:bg-accent"
            aria-label={t("theme")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setOpen((s) => !s)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-background/50 transition hover:bg-accent md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="glass-card mx-auto mt-2 flex max-w-6xl flex-col gap-1 p-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium text-foreground/90 transition hover:bg-accent"
              activeProps={{ className: "rounded-xl px-4 py-3 text-base font-semibold bg-accent" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

function Footer() {
  const t = useT();
  const { lang } = useLang();
  return (
    <footer className="no-print mt-20 px-3 pb-6 sm:px-6">
      <div className="glass-card mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-lg btn-gradient">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-gradient">{t("brand")}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {lang === "ar"
                ? "موقعك للتدرب على المقابلات وإنشاء CV احترافي."
                : "Your place to practice interviews and build a professional CV."}
            </p>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold">{t("footer_links")}</div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">{t("nav_home")}</Link></li>
              <li><Link to="/interview" className="hover:text-foreground">{t("nav_interview")}</Link></li>
              <li><Link to="/cv-builder" className="hover:text-foreground">{t("nav_cv")}</Link></li>
              <li><Link to="/cv-improve" className="hover:text-foreground">{t("nav_improve")}</Link></li>
              <li><Link to="/about" className="hover:text-foreground">{t("nav_about")}</Link></li>
            </ul>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold">{t("footer_legal")}</div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-foreground">{t("privacy")}</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">{t("terms")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-6 border-t border-border pt-4 text-center text-sm text-muted-foreground">
          {t("footer_made")} <span className="font-semibold text-foreground">Mahmoud Said</span>
        </div>
      </div>
    </footer>
  );
}
