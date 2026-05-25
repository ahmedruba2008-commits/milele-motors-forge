import { useEffect, useState } from "react";
import { Menu, X, PhoneCall } from "lucide-react";
import { TEL_LINK } from "@/lib/milele";

const links = [
  { label: "Buy Cars", href: "#buy-cars" },
  { label: "Sell Cars", href: "#sell-cars" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function Logo() {
  return (
    <a href="#home" className="flex items-center gap-2" aria-label="Milele Motors home">
      <span className="w-9 h-9 rotate-45 bg-brand-blue grid place-items-center shadow-lg shadow-blue-500/40">
        <span className="-rotate-45 font-syne font-black text-white text-lg leading-none">M</span>
      </span>
      <span className="font-syne font-black text-white text-xl leading-none">
        Milele<span className="font-light text-brand-blue ml-1">Motors</span>
      </span>
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-navy/95 backdrop-blur-md shadow-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Logo />
        <ul className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-white/80 hover:text-brand-blue font-dm-sans font-medium transition-colors duration-200 text-sm uppercase tracking-wider"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden lg:block">
          <a
            href="#sell-cars"
            className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-0.5 inline-block"
          >
            Get Free Quote
          </a>
        </div>
        <button
          aria-label="Open menu"
          className="lg:hidden text-white p-2"
          onClick={() => setOpen(true)}
        >
          <Menu size={26} />
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 bg-brand-navy z-50 flex flex-col p-6 lg:hidden">
          <div className="flex items-center justify-between">
            <Logo />
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="text-white p-2">
              <X size={26} />
            </button>
          </div>
          <ul className="flex flex-col gap-6 mt-12">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-white text-2xl font-syne font-bold"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3">
            <a
              href={TEL_LINK}
              className="bg-brand-blue text-white font-bold uppercase tracking-widest text-sm py-4 rounded-full text-center flex items-center justify-center gap-2"
              aria-label="Call Milele Motors"
            >
              <PhoneCall size={18} /> Call Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
