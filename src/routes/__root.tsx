import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "InterviewX AI — تمرّن AI" },
      { name: "description", content: "AI mock interviews + European-style CV builder. Bilingual Arabic/English. By Mahmoud Said." },
      { name: "author", content: "Mahmoud Said" },
      { property: "og:title", content: "InterviewX AI — تمرّن AI" },
      { property: "og:description", content: "AI mock interviews + European-style CV builder. Bilingual Arabic/English. By Mahmoud Said." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "InterviewX AI — تمرّن AI" },
      { name: "twitter:description", content: "AI mock interviews + European-style CV builder. Bilingual Arabic/English. By Mahmoud Said." },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:image", content: "/og-image.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  beforeLoad: async () => {
    const lang = await getSsrLang();
    return { lang };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const getSsrLang = createServerFn({ method: "GET" }).handler(async () => {
  const req = getRequest();
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/ix-lang=(ar|en)/);
  return match ? (match[1] as "ar" | "en") : "ar";
});

const NO_FLASH = `(function(){try{var t=localStorage.getItem('ix-theme');var d=true;if(t){try{var p=JSON.parse(t);if(p&&p.state&&p.state.theme){d=p.state.theme==='dark'}}catch(e){}}if(d){document.documentElement.classList.add('dark')}document.documentElement.style.backgroundColor=d?'oklch(0.13 0.01 20)':'oklch(0.99 0.003 20)';}catch(e){document.documentElement.classList.add('dark');document.documentElement.style.backgroundColor='oklch(0.13 0.01 20)';}})();`;

function RootShell({ children }: { children: React.ReactNode }) {
  const { lang } = Route.useRouteContext();
  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="dark" style={{ backgroundColor: "oklch(0.13 0.01 20)" }}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
        <HeadContent />
      </head>
      <body style={{ backgroundColor: "oklch(0.13 0.01 20)" }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors position="top-center" closeButton dir="rtl" />
    </QueryClientProvider>
  );
}
