export interface PartnerCategory {
  id: string;
  nama: string;
  createdAt: string;
}

export type PartnerCategoryInput = Omit<PartnerCategory, "id" | "createdAt">;

export type PartnerType = "pelanggan" | "pemasok" | "lainnya";

export interface Partner {
  id: string;
  nama: string;
  tipe: PartnerType;
  kategoriId?: string;
  kontak?: string;
  alamat?: string;
  npwp?: string;
  createdAt: string;
  updatedAt: string;
}

export type PartnerInput = Omit<Partner, "id" | "createdAt" | "updatedAt">;
