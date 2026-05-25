import { PhoneCall } from "lucide-react";
import { TEL_LINK, WA_LINK, WhatsAppIcon, PHONE } from "@/lib/milele";

export function FloatingActions() {
  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex w-full shadow-2xl">
        <a
          href={TEL_LINK}
          aria-label={`Call ${PHONE}`}
          className="flex-1 bg-brand-blue py-4 flex items-center justify-center gap-2 text-white font-bold text-sm uppercase tracking-wider"
        >
          <PhoneCall size={18} /> Call Now
        </a>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex-1 bg-green-500 py-4 flex items-center justify-center gap-2 text-white font-bold text-sm uppercase tracking-wider"
        >
          <WhatsAppIcon className="w-5 h-5" /> WhatsApp
        </a>
      </div>

      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="hidden md:flex fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-xl shadow-green-500/40 items-center justify-center hover:scale-110 transition-all duration-300 group"
      >
        <WhatsAppIcon className="w-7 h-7" />
        <span className="absolute right-16 bg-brand-navy text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with us
        </span>
      </a>
    </>
  );
}
