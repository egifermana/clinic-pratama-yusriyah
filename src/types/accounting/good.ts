export type GoodType = "barang" | "jasa";

export interface Good {
  id: string;
  nama: string;
  tipe: GoodType;
  satuan: string;
  hargaBeli: number;
  hargaJual: number;
  akunPersediaanId?: string;
  akunPendapatanId: string;
  akunHppId?: string;
  stok?: number;
  createdAt: string;
  updatedAt: string;
}

export type GoodInput = Omit<Good, "id" | "createdAt" | "updatedAt">;
