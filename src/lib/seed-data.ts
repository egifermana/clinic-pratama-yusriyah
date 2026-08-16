import { set, subDays } from "date-fns";
import type { Product } from "@/types/product";
import type { Supplier } from "@/types/supplier";
import type { PurchaseOrder } from "@/types/order";
import type { CartItem, Transaction } from "@/types/transaction";
import type { DailyEntry } from "@/types/finance";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";

interface SeedProductInput {
  nama: string;
  kategori: string;
  satuan: string;
  satuanBesar: string;
  isiPerBox: number;
  jumlahStok: number;
  cogsStrip: number;
  jualStrip: number;
  hetStrip: number;
  stokMinimum: number;
}

export function seedProducts(): Product[] {
  const now = nowIso();
  const items: SeedProductInput[] = [
    { nama: "Paracetamol 500mg", kategori: "Box & Strip", satuan: "Strip", satuanBesar: "Box", isiPerBox: 10, jumlahStok: 120, cogsStrip: 3000, jualStrip: 5000, hetStrip: 6000, stokMinimum: 20 },
    { nama: "Amoxicillin 500mg", kategori: "Box & Strip", satuan: "Strip", satuanBesar: "Box", isiPerBox: 10, jumlahStok: 8, cogsStrip: 8000, jualStrip: 12000, hetStrip: 14000, stokMinimum: 15 },
    { nama: "Antasida Doen", kategori: "Box & Strip", satuan: "Strip", satuanBesar: "Box", isiPerBox: 10, jumlahStok: 60, cogsStrip: 4000, jualStrip: 7000, hetStrip: 8000, stokMinimum: 15 },
    { nama: "Betadine Solution 60ml", kategori: "Fluid & Infusion Set", satuan: "Bottle", satuanBesar: "Carton", isiPerBox: 12, jumlahStok: 0, cogsStrip: 12000, jualStrip: 18000, hetStrip: 20000, stokMinimum: 10 },
    { nama: "Oralit", kategori: "Box & Strip", satuan: "Sachet", satuanBesar: "Box", isiPerBox: 10, jumlahStok: 200, cogsStrip: 1000, jualStrip: 2000, hetStrip: 2500, stokMinimum: 30 },
    { nama: "Vitamin C 1000mg", kategori: "Box & Strip", satuan: "Strip", satuanBesar: "Box", isiPerBox: 10, jumlahStok: 45, cogsStrip: 6000, jualStrip: 10000, hetStrip: 12000, stokMinimum: 10 },
    { nama: "Medical Mask (box of 50)", kategori: "Medical Devices", satuan: "Box", satuanBesar: "Carton", isiPerBox: 10, jumlahStok: 25, cogsStrip: 25000, jualStrip: 35000, hetStrip: 40000, stokMinimum: 5 },
    { nama: "OBH Combi", kategori: "Syrup", satuan: "Bottle", satuanBesar: "Carton", isiPerBox: 12, jumlahStok: 5, cogsStrip: 9000, jualStrip: 14000, hetStrip: 16000, stokMinimum: 10 },
    { nama: "Ibuprofen 400mg", kategori: "Box & Strip", satuan: "Strip", satuanBesar: "Box", isiPerBox: 10, jumlahStok: 70, cogsStrip: 5000, jualStrip: 8000, hetStrip: 9500, stokMinimum: 15 },
    { nama: "CTM 4mg", kategori: "Box & Strip", satuan: "Strip", satuanBesar: "Box", isiPerBox: 10, jumlahStok: 90, cogsStrip: 2000, jualStrip: 4000, hetStrip: 5000, stokMinimum: 20 },
    { nama: "Hansaplast Adhesive Bandage", kategori: "Medical Devices", satuan: "Box", satuanBesar: "Carton", isiPerBox: 10, jumlahStok: 0, cogsStrip: 8000, jualStrip: 13000, hetStrip: 15000, stokMinimum: 10 },
    { nama: "Promag", kategori: "Box & Strip", satuan: "Strip", satuanBesar: "Box", isiPerBox: 10, jumlahStok: 55, cogsStrip: 3500, jualStrip: 6000, hetStrip: 7000, stokMinimum: 15 },
  ];

  return items.map((item) => ({
    nama: item.nama,
    kategori: item.kategori,
    satuan: item.satuan,
    satuanBesar: item.satuanBesar,
    isiPerBox: item.isiPerBox,
    jumlahStok: item.jumlahStok,
    stokMinimum: item.stokMinimum,
    hargaCogsStrip: item.cogsStrip,
    hargaCogsBox: item.cogsStrip * item.isiPerBox,
    hargaJualStrip: item.jualStrip,
    hargaJualBox: item.jualStrip * item.isiPerBox,
    hargaHetStrip: item.hetStrip,
    hargaHetBox: item.hetStrip * item.isiPerBox,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }));
}

export function seedSuppliers(): Supplier[] {
  const now = nowIso();
  return [
    { id: generateId(), nama: "PBF Anugerah Pharma", kontak: "021-5551234", alamat: "Jakarta Timur", createdAt: now },
    { id: generateId(), nama: "PBF Kimia Farma Trading", kontak: "021-5559876", alamat: "Jakarta Pusat", createdAt: now },
    { id: generateId(), nama: "CV Sumber Sehat Medika", kontak: "0812-3456-7890", alamat: "Bekasi", createdAt: now },
  ];
}

export function seedOrders(products: Product[], suppliers: Supplier[]): PurchaseOrder[] {
  const amoxicillin = products.find((p) => p.nama === "Amoxicillin 500mg");
  const betadine = products.find((p) => p.nama === "Betadine Solution 60ml");
  if (!amoxicillin || !betadine) return [];

  const supplier = suppliers[0];
  const items = [
    { productId: amoxicillin.id, namaProduk: amoxicillin.nama, qty: 50, hargaSatuan: amoxicillin.hargaCogsStrip },
    { productId: betadine.id, namaProduk: betadine.nama, qty: 30, hargaSatuan: betadine.hargaCogsStrip },
  ];

  return [
    {
      id: generateId(),
      supplierId: supplier.id,
      namaSupplier: supplier.nama,
      items,
      status: "pending",
      tanggalOrder: subDays(new Date(), 1).toISOString(),
      totalBiaya: items.reduce((sum, i) => sum + i.qty * i.hargaSatuan, 0),
      catatan: "Restock low/out-of-stock items",
    },
  ];
}

export function seedTransactions(products: Product[]): Transaction[] {
  const pick = (nama: string) => products.find((p) => p.nama === nama)!;

  const buildItems = (entries: Array<[string, number]>): CartItem[] =>
    entries.map(([nama, qty]) => {
      const product = pick(nama);
      const subtotal = product.hargaJualStrip * qty;
      return {
        productId: product.id,
        namaProduk: product.nama,
        qty,
        hargaJualSatuan: product.hargaJualStrip,
        hargaCogsSatuan: product.hargaCogsStrip,
        subtotal,
      };
    });

  const daysAgoAt = (days: number, hour: number) =>
    set(subDays(new Date(), days), { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 }).toISOString();

  const raw: Array<{ days: number; hour: number; items: Array<[string, number]>; metode: Transaction["metodePembayaran"] }> = [
    { days: 6, hour: 9, items: [["Paracetamol 500mg", 2], ["Vitamin C 1000mg", 1]], metode: "tunai" },
    { days: 5, hour: 11, items: [["Oralit", 5], ["Promag", 2]], metode: "qris" },
    { days: 5, hour: 15, items: [["Ibuprofen 400mg", 3]], metode: "tunai" },
    { days: 4, hour: 10, items: [["Antasida Doen", 2], ["CTM 4mg", 1]], metode: "debit" },
    { days: 3, hour: 13, items: [["Medical Mask (box of 50)", 1]], metode: "qris" },
    { days: 2, hour: 9, items: [["Paracetamol 500mg", 4], ["OBH Combi", 1]], metode: "tunai" },
    { days: 2, hour: 16, items: [["Vitamin C 1000mg", 2]], metode: "transfer" },
    { days: 1, hour: 10, items: [["Promag", 3], ["CTM 4mg", 2]], metode: "tunai" },
    { days: 0, hour: 9, items: [["Paracetamol 500mg", 1], ["Ibuprofen 400mg", 1]], metode: "qris" },
  ];

  return raw.map(({ days, hour, items, metode }) => {
    const cartItems = buildItems(items);
    const subtotal = cartItems.reduce((sum, i) => sum + i.subtotal, 0);
    return {
      id: generateId(),
      items: cartItems,
      subtotal,
      diskon: 0,
      total: subtotal,
      metodePembayaran: metode,
      uangDibayar: metode === "tunai" ? Math.ceil(subtotal / 5000) * 5000 : undefined,
      kembalian: metode === "tunai" ? Math.ceil(subtotal / 5000) * 5000 - subtotal : undefined,
      timestamp: daysAgoAt(days, hour),
    };
  });
}

export function seedDailyEntries(): DailyEntry[] {
  const today = new Date();
  const dateAt = (daysAgo: number) => subDays(today, daysAgo).toISOString();

  const raw: Array<Omit<DailyEntry, "id" | "tanggal">> = [
    {
      opVisits: 18,
      opRevenue: 2700000,
      nonOpVisits: 4,
      nonOpRevenue: 1200000,
      change: 50000,
      pharmacy: 950000,
      medicalSupplies: 320000,
      utilities: 0,
      salary: 0,
      cleaning: 0,
    },
    {
      opVisits: 22,
      opRevenue: 3100000,
      nonOpVisits: 3,
      nonOpRevenue: 900000,
      change: 40000,
      pharmacy: 1100000,
      medicalSupplies: 280000,
      utilities: 350000,
      salary: 0,
      cleaning: 100000,
    },
    {
      opVisits: 15,
      opRevenue: 2250000,
      nonOpVisits: 2,
      nonOpRevenue: 600000,
      change: 30000,
      pharmacy: 800000,
      medicalSupplies: 190000,
      utilities: 0,
      salary: 4500000,
      cleaning: 0,
    },
    {
      opVisits: 20,
      opRevenue: 3000000,
      nonOpVisits: 5,
      nonOpRevenue: 1500000,
      change: 45000,
      pharmacy: 1050000,
      medicalSupplies: 300000,
      utilities: 0,
      salary: 0,
      cleaning: 0,
    },
    {
      opVisits: 25,
      opRevenue: 3600000,
      nonOpVisits: 6,
      nonOpRevenue: 1800000,
      change: 60000,
      pharmacy: 1250000,
      medicalSupplies: 340000,
      utilities: 0,
      salary: 0,
      cleaning: 100000,
    },
    {
      opVisits: 19,
      opRevenue: 2850000,
      nonOpVisits: 3,
      nonOpRevenue: 900000,
      change: 35000,
      pharmacy: 980000,
      medicalSupplies: 260000,
      utilities: 0,
      salary: 0,
      cleaning: 0,
    },
    {
      opVisits: 12,
      opRevenue: 1800000,
      nonOpVisits: 2,
      nonOpRevenue: 600000,
      change: 25000,
      pharmacy: 700000,
      medicalSupplies: 150000,
      utilities: 300000,
      salary: 0,
      cleaning: 0,
    },
  ];

  return raw.map((entry, index) => ({
    ...entry,
    id: generateId(),
    tanggal: dateAt(raw.length - 1 - index),
  }));
}
