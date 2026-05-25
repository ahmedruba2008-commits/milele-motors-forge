import { TEL_LINK } from "@/lib/milele";

export function CtaStrip() {
  return (
    <section className="relative bg-brand-blue py-16 md:py-20 px-6 text-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0 2px, transparent 2px 24px)",
        }}
      />
      <div className="relative max-w-3xl mx-auto">
        <h2 className="font-syne font-bold text-3xl md:text-5xl tracking-tight text-white">
          Ready to Sell or Buy Today?
        </h2>
        <p className="mt-4 text-white/85 text-base md:text-lg max-w-2xl mx-auto">
          Join over 1,200 customers who chose transparency. Get your free quote now — no obligation, no pressure.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <a href="#sell-cars" className="bg-white text-brand-blue hover:bg-gray-100 font-bold uppercase tracking-widest text-sm px-10 py-4 rounded-full shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            Get Free Quote
          </a>
          <a href={TEL_LINK} className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-blue font-bold uppercase tracking-widest text-sm px-10 py-4 rounded-full transition-all duration-300">
            Call 9964174299
          </a>
        </div>
      </div>
    </section>
  );
}
