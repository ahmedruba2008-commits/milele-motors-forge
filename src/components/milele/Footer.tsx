import { PhoneCall, Mail, Instagram, Facebook, Youtube } from "lucide-react";
import { TEL_LINK, EMAIL, WA_LINK, PHONE } from "@/lib/milele";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="w-9 h-9 rotate-45 bg-brand-blue grid place-items-center shadow-lg shadow-blue-500/40">
        <span className="-rotate-45 font-syne font-black text-white text-lg leading-none">M</span>
      </span>
      <span className="font-syne font-black text-white text-xl leading-none">
        Milele<span className="font-light text-brand-blue ml-1">Motors</span>
      </span>
    </div>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="bg-brand-navy border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 py-16">
        <div>
          <Logo />
          <p className="mt-4 text-white/60 leading-relaxed text-sm">
            India's most transparent used vehicle marketplace.
          </p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="w-9 h-9 rounded-full border border-white/15 grid place-items-center text-white/40 hover:text-white hover:border-white/40 transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-syne font-semibold text-sm uppercase tracking-widest mb-4">Company</h4>
          <ul className="space-y-2">
            {["Buy Cars", "Sell Cars", "How It Works", "About Us", "Careers", "Blog"].map((l) => (
              <li key={l}><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-syne font-semibold text-sm uppercase tracking-widest mb-4">Support</h4>
          <ul className="space-y-2">
            {["Contact Us", "FAQs", "Vehicle Inspection", "Privacy Policy", "Terms of Service", "Sitemap"].map((l) => (
              <li key={l}><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-syne font-semibold text-sm uppercase tracking-widest mb-4">Get In Touch</h4>
          <ul className="space-y-3">
            <li>
              <a href={TEL_LINK} aria-label={`Call Milele Motors at ${PHONE}`} className="flex items-center gap-2 text-white/80 hover:text-brand-blue font-medium transition-colors">
                <PhoneCall size={16} className="text-brand-blue" /> {PHONE}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-white/80 hover:text-brand-blue font-medium transition-colors text-sm break-all">
                <Mail size={16} className="text-brand-blue shrink-0" /> {EMAIL}
              </a>
            </li>
            <li>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 font-bold text-sm">
                Chat on WhatsApp →
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">© 2025 Milele Motors. All rights reserved.</p>
          <p className="text-white/40 text-xs">Privacy Policy · Terms of Service · Sitemap</p>
        </div>
      </div>
    </footer>
  );
}
