import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastKind = "success" | "error" | "info";
type Toast = { id: string; message: string; kind: ToastKind };

type Ctx = { showToast: (message: string, kind?: ToastKind) => void };
const ToastContext = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, kind: ToastKind = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => {
          const Icon = t.kind === "success" ? CheckCircle : t.kind === "error" ? AlertCircle : Info;
          const border =
            t.kind === "success" ? "border-green-500/50" : t.kind === "error" ? "border-red-500/50" : "border-brand-blue/50";
          const iconColor =
            t.kind === "success" ? "text-green-400" : t.kind === "error" ? "text-red-400" : "text-brand-blue";
          return (
            <div
              key={t.id}
              className={`bg-brand-navy border ${border} text-white rounded-xl px-5 py-3 shadow-2xl flex items-center gap-3 animate-[reveal_0.3s_ease-out] pointer-events-auto`}
            >
              <Icon size={18} className={iconColor} />
              <span className="text-sm font-medium">{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
