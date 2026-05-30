import { useEffect, useState, FormEvent } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AdminDashboard } from "@/components/milele/AdminDashboard";
import { Logo } from "@/components/milele/Logo";
import { useToast } from "@/context/ToastContext";
import { Lock, Mail, KeyRound, Loader2 } from "lucide-react";
import { createAuthState, OWNER_EMAIL } from "@/lib/auth-state";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      return { auth: context.auth };
    }

    const { data } = await supabase.auth.getSession();
    return { auth: createAuthState(data.session) };
  },
  head: () => ({
    meta: [
      { title: "Admin · Milele Motors" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type AuthState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "unauthorized"; email: string }
  | { status: "admin"; email: string };

function AdminPage() {
  const { auth } = Route.useRouteContext();
  const [state, setState] = useState<AuthState>(() =>
    auth.isAdmin ? { status: "admin", email: auth.user?.email ?? OWNER_EMAIL } : { status: "loading" }
  );

  const refresh = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const sessionUser = sessionData.session?.user ?? null;
    if (sessionUser) {
      const email = (sessionUser.email ?? "").trim().toLowerCase();
      setState(email === OWNER_EMAIL ? { status: "admin", email } : { status: "unauthorized", email });
      return;
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      setState({ status: "unauthenticated" });
      return;
    }
    const email = (data.user.email ?? "").trim().toLowerCase();
    setState(email === OWNER_EMAIL ? { status: "admin", email } : { status: "unauthorized", email });
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      setTimeout(() => void refresh(), 0);
    });
    void refresh();
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({ status: "unauthenticated" });
  };

  if (state.status === "loading") {
    return (
      <div className="min-h-screen bg-brand-navy grid place-items-center text-white">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (state.status === "admin") {
    return <AdminDashboard onSignOut={signOut} userEmail={state.email} />;
  }

  if (state.status === "unauthorized") {
    return <Navigate to="/" />;
  }


  return <LoginForm onAuthed={refresh} />;
}

function LoginForm({ onAuthed }: { onAuthed: () => void }) {
  const { showToast } = useToast();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState(OWNER_EMAIL);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== OWNER_EMAIL) {
      setErr("This panel is restricted to the owner account.");
      return;
    }
    if (password.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        showToast("Admin account created. You are signed in.", "success");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (error) throw error;
        showToast("Welcome back.", "success");
      }
      onAuthed();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Authentication failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy grid place-items-center px-4 py-12">
      <div className="max-w-md w-full bg-brand-slate border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <Logo size="md" />
          <span className="mt-3 bg-brand-blue text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            Admin Panel
          </span>
        </div>

        <h1 className="text-white font-syne font-bold text-2xl text-center">
          {mode === "signup" ? "Create your admin password" : "Sign in to manage listings"}
        </h1>
        <p className="text-white/50 text-sm text-center mt-2">
          Restricted to the verified owner email.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-white/70 text-xs uppercase tracking-wider flex items-center gap-2 mb-2">
              <Mail size={12} /> Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-navy border border-white/20 text-white rounded-xl px-4 py-3 focus:border-brand-blue focus:outline-none"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-white/70 text-xs uppercase tracking-wider flex items-center gap-2 mb-2">
              <KeyRound size={12} /> Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-navy border border-white/20 text-white rounded-xl px-4 py-3 focus:border-brand-blue focus:outline-none"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder="At least 8 characters"
            />
          </div>

          {err && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-300 text-sm rounded-xl px-4 py-3">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue hover:bg-brand-blue-dark disabled:opacity-60 text-white font-bold uppercase tracking-widest text-sm py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === "signup" ? "Create password & sign in" : "Sign in"}
          </button>
        </form>

        <button
          onClick={() => { setErr(null); setMode(mode === "signin" ? "signup" : "signin"); }}
          className="mt-6 w-full text-center text-white/60 hover:text-white text-sm"
        >
          {mode === "signin"
            ? "First time? Create your admin password →"
            : "Already set up? Sign in instead →"}
        </button>

        <p className="text-white/30 text-xs text-center mt-6">
          <a href="/" className="hover:text-white/60">← Back to site</a>
        </p>
      </div>
    </div>
  );
}
