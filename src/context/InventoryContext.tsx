import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: string;
  mileage: string;
  fuelType: "Petrol" | "Diesel" | "Electric" | "CNG" | "";
  transmission: "Manual" | "Automatic" | "CVT" | "DCT" | "";
  bodyType: "Sedan" | "SUV" | "Hatchback" | "MUV" | "";
  city: string;
  isCertified: boolean;
  isHotDeal: boolean;
  imageUrl: string;
  createdAt: string;
};

const STORAGE_KEY = "milele_inventory";

const defaults: Vehicle[] = [
  { id: "seed-1", make: "Maruti", model: "Swift ZXi", year: 2021, price: "5.85", mileage: "42000", fuelType: "Petrol", transmission: "Manual", bodyType: "Hatchback", city: "Bengaluru", isCertified: true, isHotDeal: false, imageUrl: "", createdAt: new Date().toISOString() },
  { id: "seed-2", make: "Hyundai", model: "Creta SX", year: 2020, price: "11.20", mileage: "58000", fuelType: "Diesel", transmission: "Automatic", bodyType: "SUV", city: "Mysuru", isCertified: true, isHotDeal: true, imageUrl: "", createdAt: new Date().toISOString() },
  { id: "seed-3", make: "Honda", model: "City VX", year: 2019, price: "8.40", mileage: "61000", fuelType: "Petrol", transmission: "CVT", bodyType: "Sedan", city: "Bengaluru", isCertified: true, isHotDeal: false, imageUrl: "", createdAt: new Date().toISOString() },
  { id: "seed-4", make: "Tata", model: "Nexon XZ+", year: 2022, price: "13.50", mileage: "28000", fuelType: "Electric", transmission: "Automatic", bodyType: "SUV", city: "Hubli", isCertified: true, isHotDeal: false, imageUrl: "", createdAt: new Date().toISOString() },
  { id: "seed-5", make: "Toyota", model: "Innova Crysta 2.4 G", year: 2018, price: "14.90", mileage: "85000", fuelType: "Diesel", transmission: "Manual", bodyType: "MUV", city: "Bengaluru", isCertified: true, isHotDeal: false, imageUrl: "", createdAt: new Date().toISOString() },
  { id: "seed-6", make: "Kia", model: "Seltos HTX", year: 2021, price: "11.75", mileage: "34000", fuelType: "Petrol", transmission: "DCT", bodyType: "SUV", city: "Dharwad", isCertified: true, isHotDeal: true, imageUrl: "", createdAt: new Date().toISOString() },
];

type Ctx = {
  vehicles: Vehicle[];
  addVehicle: (v: Omit<Vehicle, "id" | "createdAt">) => Vehicle;
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void;
  removeVehicle: (id: string) => void;
};

const InventoryContext = createContext<Ctx | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(defaults);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setVehicles(JSON.parse(raw));
    } catch {
      void 0;
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    } catch {
      void 0;
    }
  }, [vehicles, hydrated]);

  const addVehicle = useCallback((v: Omit<Vehicle, "id" | "createdAt">) => {
    const created: Vehicle = { ...v, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setVehicles((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateVehicle = useCallback((id: string, patch: Partial<Vehicle>) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  }, []);

  const removeVehicle = useCallback((id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  }, []);

  return (
    <InventoryContext.Provider value={{ vehicles, addVehicle, updateVehicle, removeVehicle }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used inside InventoryProvider");
  return ctx;
}
