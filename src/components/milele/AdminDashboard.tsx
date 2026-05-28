import { useMemo, useRef, useState, useEffect } from "react";
import { X, Car, Upload, Trash2, Edit3, Phone, MessageCircle, CheckCircle2 } from "lucide-react";
import { useInventory, Vehicle } from "@/context/InventoryContext";
import { useQuotes } from "@/context/QuoteContext";
import { useToast } from "@/context/ToastContext";
import { Logo } from "./Logo";


const inputCls =
  "w-full bg-brand-navy border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all";
const pillCls = (active: boolean) =>
  `px-4 py-2 rounded-full text-sm font-medium border transition-all ${
    active ? "bg-brand-blue border-brand-blue text-white" : "bg-transparent border-white/20 text-white/70 hover:border-brand-blue/60"
  }`;

type FormState = Omit<Vehicle, "id" | "createdAt">;
const emptyForm: FormState = {
  make: "", model: "", year: 2022, price: "", mileage: "",
  fuelType: "", transmission: "", bodyType: "", city: "",
  isCertified: true, isHotDeal: false, imageUrl: "",
};

function Toggle({ active, onChange, label, colorClass }: { active: boolean; onChange: (v: boolean) => void; label: string; colorClass: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${active ? `${colorClass} border-transparent text-white` : "border-white/20 text-white/60 hover:border-white/40"}`}
    >
      <span className={`w-4 h-4 rounded-full border-2 ${active ? "bg-white border-white" : "border-white/40"}`} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function AddEditVehicle({ editing, onDone, onCancelEdit }: { editing: Vehicle | null; onDone: () => void; onCancelEdit: () => void }) {
  const { addVehicle, updateVehicle } = useInventory();
  const { showToast } = useToast();
  const [form, setForm] = useState<FormState>(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      const { id, createdAt, ...rest } = editing;
      setForm(rest);
    } else {
      setForm(emptyForm);
    }
  }, [editing]);

  const onFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { showToast("Image must be under 5MB", "error"); return; }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, imageUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.make || !form.model || !form.price) { showToast("Make, model and price are required", "error"); return; }
    if (editing) {
      updateVehicle(editing.id, form);
      showToast("Vehicle updated", "success");
    } else {
      addVehicle(form);
      showToast("Vehicle added to inventory!", "success");
    }
    onDone();
    setForm(emptyForm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-syne font-bold text-2xl text-white">{editing ? "Edit Vehicle" : "Add New Vehicle"}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className={inputCls} placeholder="Make / Brand" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} />
        <input className={inputCls} placeholder="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
        <select className={inputCls} value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}>
          {Array.from({ length: 26 }, (_, i) => 2025 - i).map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select className={inputCls} value={form.bodyType} onChange={(e) => setForm({ ...form, bodyType: e.target.value as FormState["bodyType"] })}>
          <option value="">Body type</option>
          <option>Sedan</option><option>SUV</option><option>Hatchback</option><option>MUV</option>
        </select>
      </div>

      <div>
        <p className="text-white/60 text-sm mb-2">Fuel type</p>
        <div className="flex flex-wrap gap-2">
          {["Petrol","Diesel","Electric","CNG"].map((f) => (
            <button type="button" key={f} className={pillCls(form.fuelType === f)} onClick={() => setForm({ ...form, fuelType: f as FormState["fuelType"] })}>{f}</button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-white/60 text-sm mb-2">Transmission</p>
        <div className="flex flex-wrap gap-2">
          {["Manual","Automatic","CVT","DCT"].map((t) => (
            <button type="button" key={t} className={pillCls(form.transmission === t)} onClick={() => setForm({ ...form, transmission: t as FormState["transmission"] })}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className={inputCls} type="number" placeholder="Mileage (km)" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} />
        <input className={inputCls} type="number" step="0.01" placeholder="Price in Lakhs (e.g. 5.85)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
      </div>
      <input className={inputCls} placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />

      <div className="flex flex-wrap gap-3">
        <Toggle active={form.isCertified} onChange={(v) => setForm({ ...form, isCertified: v })} label="✓ Certified Expert Inspected" colorClass="bg-brand-green" />
        <Toggle active={form.isHotDeal} onChange={(v) => setForm({ ...form, isHotDeal: v })} label="🔥 Hot Deal" colorClass="bg-brand-blue" />
      </div>

      <div>
        <p className="text-white/60 text-sm mb-2">Vehicle Image</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        {form.imageUrl ? (
          <div className="relative">
            <img src={form.imageUrl} alt="Preview" className="h-40 w-full object-cover rounded-xl" />
            <button type="button" onClick={() => setForm({ ...form, imageUrl: "" })} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white grid place-items-center hover:bg-red-500">
              <X size={16} />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-brand-blue/60 transition-colors">
            <Upload size={28} className="mx-auto text-white/40" />
            <p className="text-white/70 mt-2 text-sm font-medium">Click to upload or drag & drop</p>
            <p className="text-white/40 text-xs mt-1">PNG, JPG up to 5MB</p>
          </button>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold uppercase tracking-widest text-sm py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all">
          {editing ? "Save Changes" : "Add to Inventory"}
        </button>
        {editing && (
          <button type="button" onClick={onCancelEdit} className="px-6 py-4 rounded-xl text-white/70 hover:text-white bg-white/10 hover:bg-white/15 transition-all">
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}

function InventoryList({ onEdit }: { onEdit: (v: Vehicle) => void }) {
  const { vehicles, removeVehicle } = useInventory();
  const { showToast } = useToast();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div>
      <h3 className="font-syne font-bold text-2xl text-white flex items-center gap-3">
        Live Inventory <span className="text-brand-blue text-sm font-medium">({vehicles.length} vehicles)</span>
      </h3>
      <div className="mt-4 space-y-3 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
        {vehicles.length === 0 && (
          <div className="border-2 border-dashed border-white/15 rounded-2xl p-10 text-center">
            <Car size={36} className="mx-auto text-white/30" />
            <p className="text-white/60 mt-3 text-sm">No vehicles in inventory. Add your first listing.</p>
          </div>
        )}
        {vehicles.map((v) => (
          <div key={v.id} className="bg-brand-slate rounded-xl p-4 flex items-center gap-4 border border-white/5">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 grid place-items-center shrink-0">
              {v.imageUrl ? <img src={v.imageUrl} alt={v.model} className="w-full h-full object-cover" /> : <Car size={24} className="text-white/40" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-syne font-semibold truncate">{v.year} {v.make} {v.model}</p>
              <p className="text-white/50 text-sm truncate">₹{v.price}L · {Number(v.mileage).toLocaleString("en-IN")}km · {v.city || "—"}</p>
              <div className="flex gap-1 mt-1">
                {v.isCertified && <span className="text-[10px] bg-brand-green/20 text-green-300 px-2 py-0.5 rounded-full">Certified</span>}
                {v.isHotDeal && <span className="text-[10px] bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded-full">Hot Deal</span>}
              </div>
            </div>
            {confirmId === v.id ? (
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-xs">Remove?</span>
                <button onClick={() => { removeVehicle(v.id); setConfirmId(null); showToast("Listing removed", "info"); }} className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Yes</button>
                <button onClick={() => setConfirmId(null)} className="text-white/60 text-xs px-2">Cancel</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => onEdit(v)} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"><Edit3 size={12} /> Edit</button>
                <button onClick={() => setConfirmId(v.id)} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"><Trash2 size={12} /> Remove</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function QuoteRequests() {
  const { quotes, submitAdminQuote } = useQuotes();
  const { showToast } = useToast();
  const [drafts, setDrafts] = useState<Record<string, { price: string; notes: string }>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const pending = quotes.filter((q) => q.status === "pending");
  const completed = quotes.filter((q) => q.status === "quoted");

  const setDraft = (id: string, k: "price" | "notes", v: string) =>
    setDrafts((d) => ({ ...d, [id]: { ...(d[id] || { price: "", notes: "" }), [k]: v } }));

  const submit = (id: string) => {
    const d = drafts[id];
    if (!d?.price) { showToast("Enter a quote price", "error"); return; }
    submitAdminQuote(id, d.price, d.notes || "");
    showToast("Quote submitted! Customer can now view it.", "success");
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-syne font-bold text-2xl text-white">Pending Quotes <span className="text-brand-blue text-sm">({pending.length})</span></h3>
        <div className="mt-4 space-y-4">
          {pending.length === 0 && (
            <div className="border-2 border-dashed border-white/15 rounded-2xl p-10 text-center">
              <CheckCircle2 size={36} className="mx-auto text-brand-green" />
              <p className="text-white mt-3 font-medium">All caught up! No pending quote requests.</p>
              <p className="text-white/50 text-sm mt-1">New requests will appear here instantly.</p>
            </div>
          )}
          {pending.map((q) => {
            const d = drafts[q.id] || { price: "", notes: "" };
            const ref = q.id.slice(0, 8).toUpperCase();
            return (
              <div key={q.id} className="bg-brand-slate rounded-xl p-5 border border-brand-blue/20">
                <div className="flex justify-between items-start gap-2">
                  <span className="bg-brand-blue/20 text-brand-blue font-mono text-xs px-2 py-1 rounded">#{ref}</span>
                  <span className="text-white/40 text-xs">Submitted {relTime(q.submittedAt)}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    ["Year", q.vehicleYear], ["Make", q.vehicleMake], ["Model", q.vehicleModel],
                    ["Mileage", q.vehicleMileage], ["Fuel", q.vehicleFuelType], ["Transmission", q.vehicleTransmission],
                    ["Condition", q.vehicleCondition], ["City", q.vehicleCity],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <p className="text-white/40 text-[10px] uppercase tracking-wider">{l}</p>
                      <p className="text-white text-sm font-medium">{v || "—"}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 bg-brand-navy rounded-lg p-3">
                  <p className="text-white font-semibold">{q.userName}</p>
                  <a href={`tel:${q.userPhone}`} className="text-brand-blue hover:underline font-mono text-sm">{q.userPhone}</a>
                  {q.userEmail && <p className="text-white/60 text-xs mt-1">{q.userEmail}</p>}
                </div>
                <div className="mt-4">
                  <p className="text-white/60 text-sm mb-2">Enter Your Official Quote Price (₹ Lakhs):</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input value={d.price} onChange={(e) => setDraft(q.id, "price", e.target.value)} className="bg-brand-navy border border-white/20 text-white rounded-xl px-4 py-3 w-full sm:w-32 text-lg font-bold focus:border-brand-blue focus:outline-none" placeholder="6.50" type="number" step="0.01" />
                    <textarea value={d.notes} onChange={(e) => setDraft(q.id, "notes", e.target.value)} className="bg-brand-navy border border-white/20 text-white rounded-xl px-4 py-3 flex-1 text-sm placeholder-white/30 focus:border-brand-blue focus:outline-none" placeholder="Optional note (e.g. 'Subject to physical inspection')" rows={2} />
                  </div>
                  <button onClick={() => submit(q.id)} className="mt-3 bg-brand-green hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl transition-all">Submit Quote to Customer</button>
                </div>
                <div className="mt-3 flex gap-4 text-xs">
                  <a href={`tel:${q.userPhone}`} className="text-brand-blue hover:underline flex items-center gap-1"><Phone size={12} /> Call Customer</a>
                  <a href={`https://wa.me/91${q.userPhone}?text=${encodeURIComponent(`Hi ${q.userName}, your Milele Motors quote is ready!`)}`} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline flex items-center gap-1"><MessageCircle size={12} /> WhatsApp Customer</a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-syne font-bold text-2xl text-white">Completed Quotes <span className="text-white/40 text-sm">({completed.length})</span></h3>
        <div className="mt-4 space-y-2">
          {completed.map((q) => {
            const ref = q.id.slice(0, 8).toUpperCase();
            const open = expanded === q.id;
            return (
              <div key={q.id} className="bg-white/5 rounded-xl p-4 border border-white/5">
                <button onClick={() => setExpanded(open ? null : q.id)} className="w-full flex justify-between items-center text-left">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="bg-white/10 text-white/60 font-mono text-xs px-2 py-1 rounded">#{ref}</span>
                    <span className="text-white text-sm truncate">{q.vehicleYear} {q.vehicleMake} {q.vehicleModel}</span>
                  </div>
                  <span className="text-brand-blue font-syne font-bold">₹{q.adminQuotePrice}L</span>
                </button>
                {open && (
                  <div className="mt-3 text-white/60 text-sm space-y-1">
                    <p>Customer: <span className="text-white">{q.userName}</span> · <a href={`tel:${q.userPhone}`} className="text-brand-blue">{q.userPhone}</a></p>
                    <p>Condition: {q.vehicleCondition} · {q.vehicleCity}</p>
                    {q.adminNotes && <p className="italic">Note: {q.adminNotes}</p>}
                    <p className="text-xs text-white/40">Quoted {relTime(q.adminQuotedAt)}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LogoSettings() {
  const { showToast } = useToast();
  const [hasOverride, setHasOverride] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setHasOverride(!!localStorage.getItem("milele_logo_override")); }, []);

  const onFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) { showToast("Logo must be under 2MB", "error"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("milele_logo_override", String(reader.result));
      window.dispatchEvent(new Event("milele:logo-updated"));
      setHasOverride(true);
      showToast("Logo updated", "success");
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    localStorage.removeItem("milele_logo_override");
    window.dispatchEvent(new Event("milele:logo-updated"));
    setHasOverride(false);
    showToast("Logo reset to default", "info");
  };

  return (
    <div className="mt-10 border-t border-white/10 pt-8">
      <h3 className="font-syne font-bold text-xl text-white">Brand Logo</h3>
      <div className="mt-4 flex flex-col sm:flex-row items-start gap-6">
        <div className="w-48 h-20 bg-white rounded-xl flex items-center justify-center p-3">
          <Logo size="md" />
        </div>
        <div className="flex-1 w-full">
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          <button onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-white/20 rounded-xl px-6 py-4 text-white/70 hover:border-brand-blue/60 transition-colors text-sm w-full sm:w-auto">
            <Upload size={16} className="inline mr-2" /> Update Logo
          </button>
          {hasOverride && (
            <button onClick={reset} className="ml-3 text-brand-blue text-sm hover:underline">Reset to Default</button>
          )}
          <p className="text-white/40 text-xs mt-3">
            Uploading here overrides the default logo for this session. For a permanent change, replace <code className="text-white/60">src/assets/logo.png</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard({ onSignOut, userEmail }: { onSignOut: () => void; userEmail?: string }) {
  const [tab, setTab] = useState<"inventory" | "add" | "quotes">("inventory");
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const { quotes } = useQuotes();
  const pendingCount = useMemo(() => quotes.filter((q) => q.status === "pending").length, [quotes]);

  return (
    <div className="min-h-screen bg-brand-navy">
      <div className="sticky top-0 z-10 bg-brand-navy/95 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="bg-brand-blue text-white text-xs px-3 py-1 rounded-full font-bold">Admin Panel</span>
            {userEmail && <span className="hidden sm:inline text-white/50 text-xs">{userEmail}</span>}
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-xs font-bold">View Site</a>
            <button onClick={onSignOut} className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
              <X size={14} /> Sign Out
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 text-sm font-bold">
          {[
            { id: "inventory", label: "🚗 Inventory" },
            { id: "add", label: "➕ Add/Edit" },
            { id: "quotes", label: "📋 Quote Requests" },
          ].map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className={`py-3 border-b-2 transition-all relative ${active ? "border-brand-blue text-brand-blue" : "border-transparent text-white/60 hover:text-white"}`}
              >
                {t.label}
                {t.id === "quotes" && pendingCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold">{pendingCount}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === "inventory" && <InventoryList onEdit={(v) => { setEditing(v); setTab("add"); }} />}
        {tab === "add" && (
          <div className="max-w-2xl mx-auto">
            <AddEditVehicle editing={editing} onDone={() => { setEditing(null); setTab("inventory"); }} onCancelEdit={() => setEditing(null)} />
          </div>
        )}
        {tab === "quotes" && <QuoteRequests />}

        <LogoSettings />
      </div>
    </div>
  );
}

