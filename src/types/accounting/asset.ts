export interface AssetType {
  id: string;
  nama: string;
  masaManfaatBulan: number;
  metodePenyusutan: "garis-lurus";
  createdAt: string;
}

export type AssetTypeInput = Omit<AssetType, "id" | "createdAt">;

export type FixedAssetStatus = "aktif" | "dijual" | "dihapusbukukan";

export interface FixedAsset {
  id: string;
  nama: string;
  jenisAsetId: string;
  tanggalPerolehan: string;
  hargaPerolehan: number;
  nilaiResidu: number;
  masaManfaatBulan: number;
  akunAsetId: string;
  akunAkumPenyusutanId: string;
  akunBebanPenyusutanId: string;
  status: FixedAssetStatus;
  createdAt: string;
  updatedAt: string;
}

export type FixedAssetInput = Omit<FixedAsset, "id" | "createdAt" | "updatedAt">;
