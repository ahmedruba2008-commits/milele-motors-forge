import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/milele/Navbar";
import { Hero } from "@/components/milele/Hero";
import { Features } from "@/components/milele/Features";
import { SellCar } from "@/components/milele/SellCar";
import { BuyCar } from "@/components/milele/BuyCar";
import { HowItWorks } from "@/components/milele/HowItWorks";
import { Testimonials } from "@/components/milele/Testimonials";
import { CtaStrip } from "@/components/milele/CtaStrip";
import { Footer } from "@/components/milele/Footer";
import { FloatingActions } from "@/components/milele/FloatingActions";
import { InventoryProvider } from "@/context/InventoryContext";
import { QuoteProvider } from "@/context/QuoteContext";
import { ToastProvider } from "@/context/ToastContext";
import { AdminDashboard } from "@/components/milele/AdminDashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Milele Motors — Sell or Buy Used Cars With Confidence" },
      { name: "description", content: "India's most transparent used vehicle marketplace. Fair pricing, no hidden charges, expert evaluation. Sell or buy your next car in hours, not days." },
      { property: "og:title", content: "Milele Motors — Sell or Buy Used Cars With Confidence" },
      { property: "og:description", content: "Fair pricing, zero hidden charges, expert inspection. Get a free quote in 60 seconds." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setIsAdmin((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ToastProvider>
      <InventoryProvider>
        <QuoteProvider>
          {isAdmin && <AdminDashboard onClose={() => setIsAdmin(false)} />}
          <div className="bg-brand-white">
            <Navbar />
            <main>
              <Hero />
              <Features />
              <SellCar />
              <BuyCar />
              <HowItWorks />
              <Testimonials />
              <CtaStrip />
            </main>
            <Footer />
            <FloatingActions />
            <div className="md:hidden h-16" aria-hidden="true" />
          </div>
        </QuoteProvider>
      </InventoryProvider>
    </ToastProvider>
  );
}
