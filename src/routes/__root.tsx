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
import { InventoryProvider } from "@/context/InventoryContext";
import { QuoteProvider } from "@/context/QuoteContext";
import { ToastProvider } from "@/context/ToastContext";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { createAuthState, type RouterAuthState } from "@/lib/auth-state";

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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient; auth: RouterAuthState }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Milele Motors" },
      { name: "description", content: "Buy and sell certified used cars with confidence." },
      { property: "og:title", content: "Milele Motors" },
      { name: "twitter:title", content: "Milele Motors" },
      { property: "og:description", content: "Buy and sell certified used cars with confidence." },
      { name: "twitter:description", content: "Buy and sell certified used cars with confidence." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2b6e87a3-8119-4fea-ac23-619bcf0a7501/id-preview-a6a43906--123c3450-2751-4e2f-bd85-fbb390befa71.lovable.app-1780233134896.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2b6e87a3-8119-4fea-ac23-619bcf0a7501/id-preview-a6a43906--123c3450-2751-4e2f-bd85-fbb390befa71.lovable.app-1780233134896.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    let lastToken: string | null | undefined = undefined;

    const syncAuth = (session: Parameters<typeof createAuthState>[0]) => {
      const token = session?.access_token ?? null;
      // Dedupe: skip when the token hasn't actually changed (prevents
      // TOKEN_REFRESHED storms triggering parallel invalidations).
      if (token === lastToken) return;
      lastToken = token;

      router.update({
        ...router.options,
        context: {
          ...router.options.context,
          auth: createAuthState(session),
        },
      });
      void router.invalidate();
      void queryClient.invalidateQueries();
    };

    // Single sequential initial session read — no parallel refresh fan-out.
    void supabase.auth.getSession().then(({ data }) => syncAuth(data.session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        syncAuth(session);
      }
    });
    return () => subscription.unsubscribe();
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <InventoryProvider>
          <QuoteProvider>
            <Outlet />
          </QuoteProvider>
        </InventoryProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
