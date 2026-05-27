import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Quote = {
  id: string;
  status: "pending" | "quoted";
  submittedAt: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleFuelType: string;
  vehicleTransmission: string;
  vehicleMileage: string;
  vehicleCity: string;
  vehicleCondition: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  adminQuotePrice: string;
  adminNotes: string;
  adminQuotedAt: string;
};

const STORAGE_KEY = "milele_quotes";

export type NewQuoteInput = Omit<Quote, "id" | "status" | "submittedAt" | "adminQuotePrice" | "adminNotes" | "adminQuotedAt">;

type Ctx = {
  quotes: Quote[];
  addQuote: (q: NewQuoteInput) => Quote;
  submitAdminQuote: (id: string, price: string, notes: string) => void;
  getQuote: (id: string) => Quote | undefined;
};

const QuoteContext = createContext<Ctx | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setQuotes(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes)); } catch {}
  }, [quotes, hydrated]);

  const addQuote = useCallback((q: NewQuoteInput) => {
    const created: Quote = {
      ...q,
      id: crypto.randomUUID(),
      status: "pending",
      submittedAt: new Date().toISOString(),
      adminQuotePrice: "",
      adminNotes: "",
      adminQuotedAt: "",
    };
    setQuotes((prev) => [created, ...prev]);
    return created;
  }, []);

  const submitAdminQuote = useCallback((id: string, price: string, notes: string) => {
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, status: "quoted", adminQuotePrice: price, adminNotes: notes, adminQuotedAt: new Date().toISOString() }
          : q
      )
    );
  }, []);

  const getQuote = useCallback((id: string) => quotes.find((q) => q.id === id), [quotes]);

  return (
    <QuoteContext.Provider value={{ quotes, addQuote, submitAdminQuote, getQuote }}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuotes() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuotes must be used inside QuoteProvider");
  return ctx;
}
