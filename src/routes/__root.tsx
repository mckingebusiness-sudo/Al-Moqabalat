import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

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
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "InterviewX AI — تمرّن AI" },
      { name: "twitter:description", content: "AI mock interviews + European-style CV builder. Bilingual Arabic/English. By Mahmoud Said." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a97fd675-5911-48d1-a10f-a5db4ad219ba/id-preview-cfd06f24--085fe98f-ea71-4450-803d-4d3823c6a777.lovable.app-1778414140815.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a97fd675-5911-48d1-a10f-a5db4ad219ba/id-preview-cfd06f24--085fe98f-ea71-4450-803d-4d3823c6a777.lovable.app-1778414140815.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const NO_FLASH = `(function(){try{var t=localStorage.getItem('ix-theme');var d=true;if(t){try{var p=JSON.parse(t);if(p&&p.state&&p.state.theme){d=p.state.theme==='dark'}}catch(e){}}if(d){document.documentElement.classList.add('dark')}document.documentElement.style.backgroundColor=d?'oklch(0.16 0.03 265)':'oklch(0.99 0.005 250)';}catch(e){document.documentElement.classList.add('dark');document.documentElement.style.backgroundColor='oklch(0.16 0.03 265)';}})();`;

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ backgroundColor: "oklch(0.16 0.03 265)" }}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
        <HeadContent />
      </head>
      <body style={{ backgroundColor: "oklch(0.16 0.03 265)" }}>
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
    </QueryClientProvider>
  );
}
