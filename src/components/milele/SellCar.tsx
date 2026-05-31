import { useEffect, useState } from "react";
import { PhoneCall, Check, Clock, Bell, CheckCircle2 } from "lucide-react";
import { TEL_LINK, WA_LINK, WA_BASE, PHONE, WhatsAppIcon } from "@/lib/milele";
import { useQuotes, type Quote } from "@/context/QuoteContext";

const years = Array.from({ length: 26 }, (_, i) => 2025 - i);

const inputCls =
  "w-full bg-brand-navy border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all";

const pillCls = (active: boolean) =>
  `px-4 py-2 rounded-full text-sm font-medium border transition-all ${
    active
      ? "bg-brand-blue border-brand-blue text-white"
      : "bg-transparent border-white/20 text-white/70 hover:border-brand-blue/60"
  }`;

type FormData = {
  make: string;
  model: string;
  year: string;
  fuel: string;
  transmission: string;
  mileage: string;
  city: string;
  condition: string;
  name: string;
  phone: string;
  email: string;
  time: string;
};

const emptyForm: FormData = {
  make: "",
  model: "",
  year: "",
  fuel: "",
  transmission: "",
  mileage: "",
  city: "",
  condition: "",
  name: "",
  phone: "",
  email: "",
  time: "",
};

function PendingState({ quote, onCheck }: { quote: Quote; onCheck: (q: Quote) => void }) {
  const { getQuote } = useQuotes();
  const [checkId, setCheckId] = useState("");
  const [checkMsg, setCheckMsg] = useState<string | null>(null);
  const ref = quote.id.slice(0, 8).toUpperCase();

  // Auto-refresh: poll for status change
  useEffect(() => {
    const t = setInterval(() => {
      const q = getQuote(quote.id);
      if (q && q.status === "quoted") onCheck(q);
    }, 2000);
    return () => clearInterval(t);
  }, [quote.id, getQuote, onCheck]);

  const handleCheck = () => {
    const id = checkId.trim().toUpperCase();
    if (!id) return;
    const found = quote.id.toUpperCase().startsWith(id) ? getQuote(quote.id) : undefined;
    if (!found) {
      setCheckMsg("No quote found for that ID.");
      return;
    }
    if (found.status === "quoted") {
      onCheck(found);
      return;
    }
    setCheckMsg("Our team is still working on your quote. We'll have it ready very soon!");
  };

  return (
    <div className="text-center py-4">
      <div className="w-24 h-24 mx-auto rounded-full bg-brand-blue/15 grid place-items-center animate-pulse">
        <Clock size={48} className="text-brand-blue" />
      </div>
      <p className="mt-6 text-brand-blue font-mono text-sm">
        Your Reference ID: <span className="font-bold text-base">#{ref}</span>
      </p>
      <h3 className="mt-2 font-syne font-bold text-2xl md:text-3xl text-white">
        Your Request is With Our Experts!
      </h3>
      <p className="mt-3 text-white/60 max-w-md mx-auto">
        Thank you, {quote.userName}! Our certified team is now evaluating your {quote.vehicleYear}{" "}
        {quote.vehicleMake} {quote.vehicleModel}. We'll prepare a custom quote and send it directly
        to this page shortly.
      </p>

      <div className="bg-brand-blue/20 border border-brand-blue/30 rounded-xl p-4 mt-6 max-w-md mx-auto flex items-start gap-3 text-left">
        <Bell size={18} className="text-brand-blue shrink-0 mt-0.5" />
        <p className="text-white/80 text-sm">
          Your personal quote will appear right here once our team submits it. You can also call or
          WhatsApp us for a faster response.
        </p>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
        <a
          href={TEL_LINK}
          className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-all"
        >
          <PhoneCall size={18} /> Call for Faster Response
        </a>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-all"
        >
          <WhatsAppIcon className="w-5 h-5" /> WhatsApp Us
        </a>
      </div>

      <div className="mt-8 max-w-md mx-auto text-left">
        <p className="text-white/50 text-xs mb-2">
          Have a quote request ID? Check your quote status:
        </p>
        <div className="flex gap-2">
          <input
            value={checkId}
            onChange={(e) => setCheckId(e.target.value)}
            placeholder="Enter your Quote ID"
            className={inputCls}
          />
          <button
            onClick={handleCheck}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 rounded-xl text-sm whitespace-nowrap"
          >
            Check Status
          </button>
        </div>
        {checkMsg && <p className="text-white/60 text-xs mt-2">{checkMsg}</p>}
      </div>
    </div>
  );
}

function QuotedState({ quote, onReset }: { quote: Quote; onReset: () => void }) {
  const waText = encodeURIComponent(
    `Hi, I'd like to proceed with the quote of ₹${quote.adminQuotePrice}L for my ${quote.vehicleYear} ${quote.vehicleMake} ${quote.vehicleModel}. Reference: #${quote.id.slice(0, 8).toUpperCase()}`,
  );
  return (
    <div className="text-center py-4">
      <div className="w-24 h-24 mx-auto rounded-full bg-brand-green/20 grid place-items-center animate-[pop_0.6s_ease-out]">
        <CheckCircle2 size={56} className="text-brand-green" />
      </div>
      <h3 className="mt-6 font-syne font-bold text-2xl md:text-3xl text-white">
        Your Custom Quote is Ready!
      </h3>
      <p className="mt-2 text-white/60">
        Based on our expert evaluation of your {quote.vehicleYear} {quote.vehicleMake}{" "}
        {quote.vehicleModel}:
      </p>

      <div className="bg-white rounded-2xl p-8 text-center shadow-2xl mt-6 max-w-md mx-auto">
        <p className="text-brand-gray uppercase tracking-widest text-xs font-bold">
          Milele Motors Expert Valuation
        </p>
        <p className="font-syne font-black text-5xl text-brand-navy mt-3">
          ₹{quote.adminQuotePrice} Lakh
        </p>
        {quote.adminNotes && (
          <p className="italic text-brand-gray text-sm mt-3">"{quote.adminNotes}"</p>
        )}
        <div className="border-t border-brand-gray-light my-5" />
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`${WA_BASE}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-3 rounded-full flex items-center justify-center gap-2"
          >
            <WhatsAppIcon className="w-4 h-4" /> Accept & Proceed
          </a>
          <a
            href={TEL_LINK}
            className="flex-1 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-5 py-3 rounded-full flex items-center justify-center gap-2"
          >
            <PhoneCall size={16} /> Call to Discuss
          </a>
        </div>
      </div>

      <p className="text-white/40 text-xs mt-4">
        This quote is valid for 48 hours. Final offer subject to physical inspection.
      </p>
      <button onClick={onReset} className="mt-6 text-brand-blue text-sm hover:underline">
        Submit another vehicle →
      </button>
    </div>
  );
}

export function SellCar() {
  const { addQuote, getQuote } = useQuotes();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(emptyForm);
  const [submittedQuote, setSubmittedQuote] = useState<Quote | null>(null);

  // Pre-fill from hero widget
  useEffect(() => {
    const apply = (d: { year?: string; make?: string; model?: string; mileage?: string }) => {
      setData((prev) => ({
        ...prev,
        year: d.year || prev.year,
        make: d.make || prev.make,
        model: d.model || prev.model,
        mileage: d.mileage || prev.mileage,
      }));
    };
    try {
      const raw = sessionStorage.getItem("milele_hero_prefill");
      if (raw) {
        apply(JSON.parse(raw));
        sessionStorage.removeItem("milele_hero_prefill");
      }
    } catch {
      void 0;
    }
    const listener = (e: Event) => apply((e as CustomEvent).detail);
    window.addEventListener("milele:hero-prefill", listener);
    return () => window.removeEventListener("milele:hero-prefill", listener);
  }, []);

  // Keep submittedQuote in sync with context
  useEffect(() => {
    if (!submittedQuote) return;
    const fresh = getQuote(submittedQuote.id);
    if (fresh && fresh.status !== submittedQuote.status) setSubmittedQuote(fresh);
  }, [getQuote, submittedQuote]);

  const reset = () => {
    setSubmittedQuote(null);
    setStep(1);
    setData(emptyForm);
  };

  const Stepper = () => (
    <div className="flex items-center justify-between gap-2 mb-10">
      {[
        { n: 1, label: "Vehicle Details" },
        { n: 2, label: "Your Details" },
        { n: 3, label: "Get Valuation" },
      ].map((s, i) => {
        const completed = step > s.n;
        const active = step === s.n;
        return (
          <div key={s.n} className="flex-1 flex items-center gap-2 min-w-0">
            <div
              className={`w-9 h-9 shrink-0 rounded-full grid place-items-center font-bold text-sm ${completed ? "bg-brand-green text-white" : active ? "bg-brand-blue text-white" : "bg-white/10 text-white/40"}`}
            >
              {completed ? <Check size={16} /> : s.n}
            </div>
            <span
              className={`text-xs sm:text-sm font-medium truncate ${active ? "text-white font-bold" : completed ? "text-white/80" : "text-white/40"}`}
            >
              {s.label}
            </span>
            {i < 2 && <span className="hidden sm:block flex-1 h-px bg-white/10 mx-2" />}
          </div>
        );
      })}
    </div>
  );

  return (
    <section id="sell-cars" className="relative bg-brand-navy py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 grain-overlay opacity-[0.04]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto text-white">
          <p className="text-brand-blue text-xs font-bold uppercase tracking-widest">
            Sell Your Car
          </p>
          <h2 className="mt-3 font-syne font-bold text-3xl md:text-5xl tracking-tight">
            Get a Fair Price in 3 Simple Steps.
          </h2>
        </div>

        <div className="bg-brand-slate rounded-3xl p-6 md:p-12 max-w-3xl mx-auto mt-12 border border-white/10">
          {!submittedQuote && <Stepper />}

          {!submittedQuote && step === 1 && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  className={inputCls}
                  placeholder="Make / Brand"
                  required
                  value={data.make}
                  onChange={(e) => setData({ ...data, make: e.target.value })}
                />
                <input
                  className={inputCls}
                  placeholder="Model"
                  required
                  value={data.model}
                  onChange={(e) => setData({ ...data, model: e.target.value })}
                />
                <select
                  className={inputCls}
                  required
                  value={data.year}
                  onChange={(e) => setData({ ...data, year: e.target.value })}
                >
                  <option value="">Year of manufacture</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <input
                  className={inputCls}
                  placeholder="Mileage in km"
                  type="number"
                  required
                  value={data.mileage}
                  onChange={(e) => setData({ ...data, mileage: e.target.value })}
                />
                <input
                  className={inputCls}
                  placeholder="City"
                  required
                  value={data.city}
                  onChange={(e) => setData({ ...data, city: e.target.value })}
                />
              </div>
              <div>
                <p className="text-white/60 text-sm mb-2">Fuel type</p>
                <div className="flex flex-wrap gap-2">
                  {["Petrol", "Diesel", "Electric", "CNG"].map((f) => (
                    <button
                      type="button"
                      key={f}
                      className={pillCls(data.fuel === f)}
                      onClick={() => setData({ ...data, fuel: f })}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-2">Transmission</p>
                <div className="flex flex-wrap gap-2">
                  {["Manual", "Automatic"].map((t) => (
                    <button
                      type="button"
                      key={t}
                      className={pillCls(data.transmission === t)}
                      onClick={() => setData({ ...data, transmission: t })}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-2">Condition</p>
                <div className="flex flex-wrap gap-2">
                  {["Excellent", "Good", "Fair", "Needs Work"].map((c) => (
                    <button
                      type="button"
                      key={c}
                      className={pillCls(data.condition === c)}
                      onClick={() => setData({ ...data, condition: c })}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-bold uppercase tracking-widest text-sm py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
              >
                Next Step →
              </button>
            </form>
          )}

          {!submittedQuote && step === 2 && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const created = addQuote({
                  vehicleYear: data.year,
                  vehicleMake: data.make,
                  vehicleModel: data.model,
                  vehicleFuelType: data.fuel,
                  vehicleTransmission: data.transmission,
                  vehicleMileage: data.mileage,
                  vehicleCity: data.city,
                  vehicleCondition: data.condition,
                  userName: data.name,
                  userPhone: data.phone,
                  userEmail: data.email,
                });
                setSubmittedQuote(created);
                setStep(3);
              }}
            >
              <input
                className={inputCls}
                placeholder="Full Name"
                required
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder="10-digit mobile number"
                type="tel"
                pattern="[0-9]{10}"
                required
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder="Email address (optional)"
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
              <select
                className={inputCls}
                required
                value={data.time}
                onChange={(e) => setData({ ...data, time: e.target.value })}
              >
                <option value="">Preferred contact time</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
                <option>Anytime</option>
              </select>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 sm:flex-none px-6 py-4 rounded-xl text-white/70 hover:text-white border border-white/20 hover:border-white/40 transition-all"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold uppercase tracking-widest text-sm py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                >
                  Get My Valuation →
                </button>
              </div>
            </form>
          )}

          {submittedQuote && submittedQuote.status === "pending" && (
            <PendingState quote={submittedQuote} onCheck={(q) => setSubmittedQuote(q)} />
          )}
          {submittedQuote && submittedQuote.status === "quoted" && (
            <QuotedState quote={submittedQuote} onReset={reset} />
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Need help right now?{" "}
          <a href={TEL_LINK} className="text-brand-blue hover:underline">
            Call {PHONE}
          </a>
        </p>
      </div>
    </section>
  );
}
