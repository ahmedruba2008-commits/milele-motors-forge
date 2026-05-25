import { ClipboardList, Search, CheckCircle, PhoneCall, type LucideIcon } from "lucide-react";
import { TEL_LINK } from "@/lib/milele";

type Step = { n: string; icon: LucideIcon; title: string; body: string };

const steps: Step[] = [
  { n: "01", icon: ClipboardList, title: "Get a Free Quote Online", body: "Fill in your vehicle details in under 60 seconds. Our system instantly begins your valuation." },
  { n: "02", icon: Search, title: "Free Expert Evaluation", body: "Our certified inspector visits you — or you come to us. Thorough, honest, and completely free of charge." },
  { n: "03", icon: CheckCircle, title: "Instant Payment or Drive Away", body: "Sellers receive immediate payment. Buyers drive away with their new certified vehicle. No delays." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-brand-navy py-20 md:py-32 overflow-hidden text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(14,165,233,0.15),transparent)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-brand-blue text-xs font-bold uppercase tracking-widest">The Process</p>
          <h2 className="mt-3 font-syne font-bold text-3xl md:text-5xl tracking-tight">Simple. Transparent. Fast.</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-y-10 gap-x-6 mt-16">
          {steps.map((s, i) => (
            <>
              <div key={s.n} className="text-center p-4">
                <p className="text-brand-blue font-syne font-black text-sm tracking-widest mb-3">{s.n}</p>
                <div className="bg-brand-blue w-16 h-16 rounded-full grid place-items-center text-white mx-auto shadow-lg shadow-blue-500/40">
                  <s.icon size={28} />
                </div>
                <h3 className="font-syne font-semibold text-xl mt-5">{s.title}</h3>
                <p className="text-white/60 mt-3 leading-relaxed max-w-xs mx-auto">{s.body}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:grid place-items-center text-brand-blue text-4xl pt-12" aria-hidden="true">→</div>
              )}
            </>
          ))}
        </div>

        <div className="mt-16 text-center border-t border-white/10 pt-12">
          <p className="font-syne font-semibold text-2xl">Ready to get started?</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <a href="#sell-cars" className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-full shadow-lg shadow-blue-500/40 transition-all hover:-translate-y-0.5">
              Get a Free Quote
            </a>
            <a href={TEL_LINK} className="bg-white/5 border border-white/20 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all">
              <PhoneCall size={16} /> Call Us: 9964174299
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
