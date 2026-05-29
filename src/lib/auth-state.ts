import type { Session, User } from "@supabase/supabase-js";

export const OWNER_EMAIL = "milelemotors001@gmail.com";

export type RouterAuthState = {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

export const createAuthState = (session: Session | null): RouterAuthState => {
  const user = session?.user ?? null;
  const email = (user?.email ?? "").trim().toLowerCase();

  return {
    session,
    user,
    isAuthenticated: Boolean(session && user),
    isAdmin: email === OWNER_EMAIL,
  };
};

export const emptyAuthState = createAuthState(null);