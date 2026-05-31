import { useState, type FormEvent } from "react";
import { PhoneCall, Sparkles } from "lucide-react";
import { TEL_LINK, WA_LINK, WhatsAppIcon } from "@/lib/milele";

const years = Array.from({ length: 26 }, (_, i) => 2025 - i);

function QuoteWidget() {
  const [form, setForm] = useState({ year: "", make: "", model: "", mileage: "" });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      sessionStorage.setItem("milele_hero_prefill", JSON.stringify(form));
    } catch {
      void 0;
    }
    const el = document.getElementById("sell-cars");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.dispatchEvent(new CustomEvent("milele:hero-prefill", { detail: form }));
  };

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-brand-blue/20 blur-2xl rounded-3xl -z-10" />
      <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue grid place-items-center">
            <Sparkles size={20} />
          </span>
          <div>
            <h3 className="font-syne font-bold text-xl text-brand-navy">Get Your Expert Quote</h3>
            <p className="text-sm text-brand-gray">Evaluated by our certified team</p>
          </div>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <select
            required
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className="w-full border border-brand-gray-light rounded-xl px-4 py-3 text-brand-navy bg-white font-dm-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
            aria-label="Year of manufacture"
          >
            <option value="">Year of manufacture</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <input
            required
            placeholder="Make / Brand (e.g. Maruti, Hyundai)"
            value={form.make}
            onChange={(e) => setForm({ ...form, make: e.target.value })}
            className="w-full border border-brand-gray-light rounded-xl px-4 py-3 text-brand-navy font-dm-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
            aria-label="Vehicle make"
          />
          <input
            required
            placeholder="Model (e.g. Swift, i20, City)"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            className="w-full border border-brand-gray-light rounded-xl px-4 py-3 text-brand-navy font-dm-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
            aria-label="Vehicle model"
          />
          <input
            required
            type="number"
            placeholder="Mileage in km (e.g. 45000)"
            value={form.mileage}
            onChange={(e) => setForm({ ...form, mileage: e.target.value })}
            className="w-full border border-brand-gray-light rounded-xl px-4 py-3 text-brand-navy font-dm-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
            aria-label="Mileage"
          />
          <button
            type="submit"
            className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-4 rounded-xl uppercase tracking-widest text-sm mt-2 shadow-md shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            Get My Expert Quote →
          </button>
          <p className="text-center text-xs text-brand-gray">
            Our experts will review and send your custom quote.
          </p>
        </form>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative bg-brand-navy text-white -mt-20 pt-32 pb-24 md:pb-32 overflow-hidden"
    >
      <div className="absolute inset-0 grid-pattern opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(14,165,233,0.25),transparent)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="font-syne font-black text-5xl md:text-7xl tracking-tight leading-[1.02]">
              Sell or Buy Your Next Vehicle With{" "}
              <span className="text-brand-blue">Absolute Confidence.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/60 leading-relaxed max-w-lg">
              Fair market prices, zero hidden charges, and expert evaluation. Fast, transparent, and
              completely hassle-free.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["✓ Fair Pricing", "✓ No Hidden Charges", "✓ Expert Inspection"].map((b) => (
                <span
                  key={b}
                  className="bg-white/10 text-white/80 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
                >
                  {b}
                </span>
              ))}
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href={TEL_LINK}
                aria-label="Call Milele Motors at 9964174299"
                className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 hover:-translate-y-1"
              >
                <PhoneCall size={18} /> Call Now
              </a>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Milele Motors on WhatsApp"
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                <WhatsAppIcon className="w-5 h-5" /> Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="lg:pl-8">
            <QuoteWidget />
          </div>
        </div>
      </div>
    </section>
  );
}
