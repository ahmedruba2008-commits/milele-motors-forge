import { TrendingUp, ShieldCheck, Award, Zap, type LucideIcon } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

type Feat = { icon: LucideIcon; title: string; body: string };

const items: Feat[] = [
  { icon: TrendingUp, title: "Fair Market Pricing", body: "Algorithmic and market-backed valuations so you receive exactly what your vehicle is worth — every time." },
  { icon: ShieldCheck, title: "No Hidden Charges", body: "What you see is what you get. Complete price transparency from inspection through to final payout." },
  { icon: Award, title: "Expert Evaluation", body: "Certified automotive specialists inspect every vehicle, guaranteeing quality for buyers and sellers." },
  { icon: Zap, title: "Lightning-Fast Process", body: "Sell your car or complete your purchase in hours — not days. We respect your time." },
];

export function Features() {
  const r = useScrollReveal();
  return (
    <section id="about" className="bg-brand-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={r.ref} className={r.className}>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-brand-blue text-xs font-bold uppercase tracking-widest">Why Choose Milele Motors</p>
            <h2 className="mt-3 font-syne font-bold text-3xl md:text-5xl tracking-tight text-brand-navy">
              Built on Trust. Driven by Transparency.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {items.map((it, i) => (
              <div
                key={it.title}
                className="bg-white border border-brand-gray-light rounded-2xl p-8 hover:border-brand-blue/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="bg-blue-50 group-hover:bg-brand-blue text-brand-blue group-hover:text-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300">
                  <it.icon size={26} />
                </div>
                <h3 className="font-syne font-semibold text-xl text-brand-navy">{it.title}</h3>
                <p className="mt-3 text-brand-gray leading-relaxed">{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
