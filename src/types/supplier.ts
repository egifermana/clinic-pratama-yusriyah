export interface Supplier {
  id: string;
  nama: string;
  kontak?: string;
  alamat?: string;
  createdAt: string;
}

export type SupplierInput = Omit<Supplier, "id" | "createdAt">;
