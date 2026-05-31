import { useEffect, useState } from "react";
import logoImage from "@/assets/logo.png";

export const LOGO_CONFIG = {
  src: logoImage,
  alt: "Milele Motors — Driven by trust, Delivering Excellence",
};

const sizeMap = {
  sm: "h-8",
  md: "h-10",
  lg: "h-14",
} as const;

export function Logo({ size = "md", className = "" }: { size?: keyof typeof sizeMap; className?: string }) {
  const [overrideSrc, setOverrideSrc] = useState<string | null>(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    try {
      const o = localStorage.getItem("milele_logo_override");
      if (o) setOverrideSrc(o);
    } catch {
      void 0;
    }
    const handler = () => {
      try {
        const o = localStorage.getItem("milele_logo_override");
        setOverrideSrc(o);
        setErrored(false);
      } catch {
        void 0;
      }
    };
    window.addEventListener("milele:logo-updated", handler);
    return () => window.removeEventListener("milele:logo-updated", handler);
  }, []);

  const src = overrideSrc || LOGO_CONFIG.src;

  if (errored) {
    return (
      <span className={`font-syne font-black text-white text-xl leading-none ${className}`}>
        Milele<span className="font-light text-brand-blue ml-1">Motors</span>
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={LOGO_CONFIG.alt}
      onError={() => setErrored(true)}
      className={`${sizeMap[size]} w-auto object-contain drop-shadow-[0_0_12px_rgba(14,165,233,0.25)] ${className}`}
    />
  );
}
