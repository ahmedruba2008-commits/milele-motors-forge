import { useMemo, useState } from "react";
import { Gauge, MapPin, Car, PhoneCall } from "lucide-react";
import { useInventory, type Vehicle } from "@/context/InventoryContext";
import { TEL_LINK } from "@/lib/milele";

const selectCls =
  "bg-white border border-brand-gray-light rounded-xl px-3 py-2 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue transition";

function VehicleCard({ v }: { v: Vehicle }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-brand-gray-light group cursor-pointer">
      <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden grid place-items-center">
        {v.imageUrl ? (
          <img src={v.imageUrl} alt={`${v.year} ${v.make} ${v.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <Car size={84} className="text-slate-400 group-hover:scale-110 transition-transform duration-500" />
        )}
        {v.isCertified && (
          <span className="absolute top-0 left-0 bg-brand-green text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-br-xl">
            ✓ Certified
          </span>
        )}
        {v.isHotDeal && (
          <span className="absolute top-0 right-0 bg-brand-blue text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
            Hot Deal 🔥
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-syne font-semibold text-xl text-brand-navy">{v.make} {v.model}</h3>
        <div className="flex flex-wrap gap-2 mt-3">
          {[v.year, v.fuelType, v.transmission].filter(Boolean).map((p) => (
            <span key={String(p)} className="text-xs bg-brand-gray-light/60 text-brand-navy font-medium px-2.5 py-1 rounded-md">{p}</span>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm text-brand-gray">
          <span className="flex items-center gap-1.5"><Gauge size={14} className="text-brand-blue" /> {Number(v.mileage || 0).toLocaleString("en-IN")} km</span>
          {v.city && <span className="flex items-center gap-1.5"><MapPin size={14} /> {v.city}</span>}
        </div>
        <div className="border-t border-gray-100 my-4" />
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-brand-gray uppercase tracking-wider">Price</p>
            <p className="font-syne font-black text-2xl text-brand-navy">₹{Number(v.price || 0).toFixed(2)} Lakh</p>
          </div>
          <button className="bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all duration-200">
            View Details →
          </button>
        </div>
      </div>
    </article>
  );
}

export function BuyCar() {
  const { vehicles } = useInventory();
  const [price, setPrice] = useState("all");
  const [body, setBody] = useState("all");
  const [fuel, setFuel] = useState("all");
  const [year, setYear] = useState("all");

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const p = Number(v.price || 0);
      if (body !== "all" && v.bodyType !== body) return false;
      if (fuel !== "all" && v.fuelType !== fuel) return false;
      if (price === "u3" && p >= 3) return false;
      if (price === "3-6" && (p < 3 || p > 6)) return false;
      if (price === "6-10" && (p < 6 || p > 10)) return false;
      if (price === "10+" && p < 10) return false;
      if (year === "2020+" && v.year < 2020) return false;
      if (year === "2018-2020" && (v.year < 2018 || v.year > 2020)) return false;
      if (year === "2015-2018" && (v.year < 2015 || v.year > 2018)) return false;
      if (year === "<2015" && v.year >= 2015) return false;
      return true;
    });
  }, [vehicles, price, body, fuel, year]);

  const clear = () => { setPrice("all"); setBody("all"); setFuel("all"); setYear("all"); };

  return (
    <section id="buy-cars" className="bg-brand-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-brand-blue text-xs font-bold uppercase tracking-widest">Buy a Car</p>
          <h2 className="mt-3 font-syne font-bold text-3xl md:text-5xl tracking-tight text-brand-navy">
            Browse Our Certified Vehicle Inventory.
          </h2>
          <p className="mt-4 text-brand-gray leading-relaxed">
            Every car has been inspected by our certified experts and comes with a full condition report.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-brand-gray-light p-4 flex flex-wrap gap-3 items-center mt-10">
          <select className={selectCls} value={price} onChange={(e) => setPrice(e.target.value)}>
            <option value="all">Price: Any</option>
            <option value="u3">Under ₹3L</option>
            <option value="3-6">₹3L – ₹6L</option>
            <option value="6-10">₹6L – ₹10L</option>
            <option value="10+">₹10L+</option>
          </select>
          <select className={selectCls} value={body} onChange={(e) => setBody(e.target.value)}>
            <option value="all">Body: All</option>
            <option>Sedan</option><option>SUV</option><option>Hatchback</option><option>MUV</option>
          </select>
          <select className={selectCls} value={fuel} onChange={(e) => setFuel(e.target.value)}>
            <option value="all">Fuel: All</option>
            <option>Petrol</option><option>Diesel</option><option>Electric</option><option>CNG</option>
          </select>
          <select className={selectCls} value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="all">Year: All</option>
            <option value="2020+">2020+</option>
            <option value="2018-2020">2018 – 2020</option>
            <option value="2015-2018">2015 – 2018</option>
            <option value="<2015">Before 2015</option>
          </select>
          <button onClick={clear} className="text-brand-blue underline text-sm font-medium ml-auto">Clear</button>
        </div>

        {vehicles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-gray-light p-12 text-center mt-8">
            <Car size={48} className="mx-auto text-brand-gray" />
            <h3 className="mt-4 font-syne font-bold text-2xl text-brand-navy">No vehicles listed right now.</h3>
            <p className="mt-2 text-brand-gray">Check back soon or call us directly for the latest stock.</p>
            <a href={TEL_LINK} className="mt-6 inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-6 py-3 rounded-full">
              <PhoneCall size={16} /> Call Now
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filtered.map((v) => <VehicleCard key={v.id} v={v} />)}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-brand-gray mt-12">No vehicles match these filters.</p>
            )}
            <div className="text-center mt-12">
              <p className="text-xs text-brand-gray">Showing {filtered.length} of {vehicles.length} verified listings</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
