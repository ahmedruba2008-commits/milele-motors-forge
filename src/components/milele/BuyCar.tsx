import { useMemo, useState } from "react";
import { Gauge, MapPin, Car } from "lucide-react";

type Vehicle = {
  id: number;
  title: string;
  year: number;
  fuel: "Petrol" | "Diesel" | "Electric" | "CNG";
  transmission: string;
  km: number;
  city: string;
  priceLakh: number;
  body: "Sedan" | "SUV" | "Hatchback" | "MUV";
  hot?: boolean;
};

const inventory: Vehicle[] = [
  { id: 1, title: "Maruti Swift ZXi", year: 2021, fuel: "Petrol", transmission: "Manual", km: 42000, city: "Bengaluru", priceLakh: 5.85, body: "Hatchback" },
  { id: 2, title: "Hyundai Creta SX", year: 2020, fuel: "Diesel", transmission: "Automatic", km: 58000, city: "Mysuru", priceLakh: 11.2, body: "SUV", hot: true },
  { id: 3, title: "Honda City VX", year: 2019, fuel: "Petrol", transmission: "CVT", km: 61000, city: "Bengaluru", priceLakh: 8.4, body: "Sedan" },
  { id: 4, title: "Tata Nexon XZ+", year: 2022, fuel: "Electric", transmission: "Automatic", km: 28000, city: "Hubli", priceLakh: 13.5, body: "SUV" },
  { id: 5, title: "Toyota Innova Crysta 2.4 G", year: 2018, fuel: "Diesel", transmission: "Manual", km: 85000, city: "Bengaluru", priceLakh: 14.9, body: "MUV" },
  { id: 6, title: "Kia Seltos HTX", year: 2021, fuel: "Petrol", transmission: "DCT", km: 34000, city: "Dharwad", priceLakh: 11.75, body: "SUV", hot: true },
];

const selectCls =
  "bg-white border border-brand-gray-light rounded-xl px-3 py-2 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue transition";

function VehicleCard({ v }: { v: Vehicle }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-brand-gray-light group cursor-pointer">
      <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden grid place-items-center">
        <Car size={84} className="text-slate-400 group-hover:scale-110 transition-transform duration-500" />
        <span className="absolute top-0 left-0 bg-brand-green text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-br-xl">
          ✓ Certified
        </span>
        {v.hot && (
          <span className="absolute top-0 right-0 bg-brand-blue text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
            Hot Deal 🔥
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-syne font-semibold text-xl text-brand-navy">{v.title}</h3>
        <div className="flex flex-wrap gap-2 mt-3">
          {[v.year, v.fuel, v.transmission].map((p) => (
            <span key={String(p)} className="text-xs bg-brand-gray-light/60 text-brand-navy font-medium px-2.5 py-1 rounded-md">
              {p}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm text-brand-gray">
          <span className="flex items-center gap-1.5"><Gauge size={14} className="text-brand-blue" /> {v.km.toLocaleString("en-IN")} km</span>
          <span className="flex items-center gap-1.5"><MapPin size={14} /> {v.city}</span>
        </div>
        <div className="border-t border-gray-100 my-4" />
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-brand-gray uppercase tracking-wider">Price</p>
            <p className="font-syne font-black text-2xl text-brand-navy">₹{v.priceLakh.toFixed(2)} Lakh</p>
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
  const [price, setPrice] = useState("all");
  const [body, setBody] = useState("all");
  const [fuel, setFuel] = useState("all");
  const [year, setYear] = useState("all");

  const filtered = useMemo(() => {
    return inventory.filter((v) => {
      if (body !== "all" && v.body !== body) return false;
      if (fuel !== "all" && v.fuel !== fuel) return false;
      if (price === "u3" && v.priceLakh >= 3) return false;
      if (price === "3-6" && (v.priceLakh < 3 || v.priceLakh > 6)) return false;
      if (price === "6-10" && (v.priceLakh < 6 || v.priceLakh > 10)) return false;
      if (price === "10+" && v.priceLakh < 10) return false;
      if (year === "2020+" && v.year < 2020) return false;
      if (year === "2018-2020" && (v.year < 2018 || v.year > 2020)) return false;
      if (year === "2015-2018" && (v.year < 2015 || v.year > 2018)) return false;
      if (year === "<2015" && v.year >= 2015) return false;
      return true;
    });
  }, [price, body, fuel, year]);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filtered.map((v) => <VehicleCard key={v.id} v={v} />)}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-brand-gray mt-12">No vehicles match these filters.</p>
        )}

        <div className="text-center mt-12">
          <button className="border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white font-bold uppercase tracking-widest text-sm px-8 py-3 rounded-full transition-all duration-300">
            Load More Vehicles
          </button>
          <p className="text-xs text-brand-gray mt-3">Showing {filtered.length} of 24 verified listings</p>
        </div>
      </div>
    </section>
  );
}
