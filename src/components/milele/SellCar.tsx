import { useState } from "react";
import { CheckCircle2, PhoneCall, Check } from "lucide-react";
import { TEL_LINK, WA_LINK, WhatsAppIcon } from "@/lib/milele";

const years = Array.from({ length: 26 }, (_, i) => 2025 - i);

const inputCls =
  "w-full bg-brand-navy border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all duration-200";

const pillCls = (active: boolean) =>
  `px-4 py-2 rounded-full text-sm font-medium border transition-all ${
    active
      ? "bg-brand-blue border-brand-blue text-white"
      : "bg-transparent border-white/20 text-white/70 hover:border-brand-blue/60"
  }`;

export function SellCar() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    make: "", model: "", year: "", fuel: "", transmission: "", mileage: "", city: "",
    name: "", phone: "", email: "", time: "",
  });

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
              className={`w-9 h-9 shrink-0 rounded-full grid place-items-center font-bold text-sm ${
                completed
                  ? "bg-brand-green text-white"
                  : active
                  ? "bg-brand-blue text-white"
                  : "bg-white/10 text-white/40"
              }`}
            >
              {completed ? <Check size={16} /> : s.n}
            </div>
            <span
              className={`text-xs sm:text-sm font-medium truncate ${
                active ? "text-white font-bold" : completed ? "text-white/80" : "text-white/40"
              }`}
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
          <p className="text-brand-blue text-xs font-bold uppercase tracking-widest">Sell Your Car</p>
          <h2 className="mt-3 font-syne font-bold text-3xl md:text-5xl tracking-tight">
            Get a Fair Price in 3 Simple Steps.
          </h2>
        </div>

        <div className="bg-brand-slate rounded-3xl p-6 md:p-12 max-w-3xl mx-auto mt-12 border border-white/10">
          <Stepper />

          {step === 1 && (
            <form
              className="space-y-4"
              onSubmit={(e) => { e.preventDefault(); setStep(2); }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input className={inputCls} placeholder="Make / Brand" required value={data.make} onChange={(e) => setData({ ...data, make: e.target.value })} />
                <input className={inputCls} placeholder="Model" required value={data.model} onChange={(e) => setData({ ...data, model: e.target.value })} />
                <select className={inputCls} required value={data.year} onChange={(e) => setData({ ...data, year: e.target.value })}>
                  <option value="">Year of manufacture</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <input className={inputCls} placeholder="Mileage in km" type="number" required value={data.mileage} onChange={(e) => setData({ ...data, mileage: e.target.value })} />
                <input className={inputCls} placeholder="City" required value={data.city} onChange={(e) => setData({ ...data, city: e.target.value })} />
              </div>
              <div>
                <p className="text-white/60 text-sm mb-2">Fuel type</p>
                <div className="flex flex-wrap gap-2">
                  {["Petrol", "Diesel", "Electric", "CNG"].map((f) => (
                    <button type="button" key={f} className={pillCls(data.fuel === f)} onClick={() => setData({ ...data, fuel: f })}>{f}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-2">Transmission</p>
                <div className="flex flex-wrap gap-2">
                  {["Manual", "Automatic"].map((t) => (
                    <button type="button" key={t} className={pillCls(data.transmission === t)} onClick={() => setData({ ...data, transmission: t })}>{t}</button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-bold uppercase tracking-widest text-sm py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
                Next Step →
              </button>
            </form>
          )}

          {step === 2 && (
            <form
              className="space-y-4"
              onSubmit={(e) => { e.preventDefault(); setStep(3); }}
            >
              <input className={inputCls} placeholder="Full Name" required value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
              <input className={inputCls} placeholder="10-digit mobile number" type="tel" pattern="[0-9]{10}" required value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
              <input className={inputCls} placeholder="Email address (optional)" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
              <select className={inputCls} required value={data.time} onChange={(e) => setData({ ...data, time: e.target.value })}>
                <option value="">Preferred contact time</option>
                <option>Morning</option><option>Afternoon</option><option>Evening</option><option>Anytime</option>
              </select>
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 sm:flex-none px-6 py-4 rounded-xl text-white/70 hover:text-white border border-white/20 hover:border-white/40 transition-all">
                  ← Back
                </button>
                <button type="submit" className="flex-1 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold uppercase tracking-widest text-sm py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
                  Get My Valuation →
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-brand-green/15 grid place-items-center animate-[pop_0.6s_ease-out]">
                <CheckCircle2 size={56} className="text-brand-green" />
              </div>
              <h3 className="mt-6 font-syne font-bold text-2xl md:text-3xl text-white">We've Received Your Request!</h3>
              <p className="mt-3 text-white/60 max-w-md mx-auto">
                Our expert team will call you at {data.phone || "your number"} within 15 minutes to schedule your free inspection.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                <a href={TEL_LINK} className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5">
                  <PhoneCall size={18} /> Call Us Now
                </a>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5">
                  <WhatsAppIcon className="w-5 h-5" /> WhatsApp Us
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
