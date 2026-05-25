type T = { quote: string; name: string; city: string; tag: "Verified Seller" | "Verified Buyer"; initials: string };

const testimonials: T[] = [
  { quote: "Milele Motors gave me ₹2 lakh more than any dealer offered. Inspected on Monday, money in my account by Tuesday.", name: "Ravi K.", city: "Bengaluru", tag: "Verified Seller", initials: "RK" },
  { quote: "Bought my Creta through Milele. No pressure, no hidden costs, full inspection report provided. Complete peace of mind.", name: "Priya S.", city: "Mysuru", tag: "Verified Buyer", initials: "PS" },
  { quote: "The 3-step process is genuinely that simple. I sold my old Swift in one afternoon. These guys are the real deal.", name: "Arun T.", city: "Hubli", tag: "Verified Seller", initials: "AT" },
];

const stats = [
  { n: "1,200+", l: "Cars Sold" },
  { n: "4.9★", l: "Average Rating" },
  { n: "98%", l: "Satisfaction Rate" },
];

export function Testimonials() {
  return (
    <section className="bg-brand-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-brand-blue text-xs font-bold uppercase tracking-widest">Customer Stories</p>
          <h2 className="mt-3 font-syne font-bold text-3xl md:text-5xl tracking-tight text-brand-navy">
            Thousands of Happy Buyers & Sellers.
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-10 md:gap-16 mt-12">
          {stats.map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-syne font-black text-4xl md:text-5xl text-brand-blue">{s.n}</p>
              <p className="mt-2 text-xs text-brand-gray uppercase tracking-widest">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {testimonials.map((t) => (
            <figure key={t.name} className="bg-white border border-brand-gray-light rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="text-yellow-400 text-xl tracking-wider" aria-label="5 stars">★★★★★</div>
              <blockquote className="italic text-brand-gray mt-4 leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="flex items-center gap-3 mt-6">
                <span className="w-10 h-10 rounded-full bg-brand-blue text-white grid place-items-center font-bold text-sm">{t.initials}</span>
                <div>
                  <p className="font-syne font-semibold text-brand-navy">{t.name}, <span className="text-brand-gray font-normal text-sm">{t.city}</span></p>
                  <p className="text-xs text-brand-green font-bold">{t.tag}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
