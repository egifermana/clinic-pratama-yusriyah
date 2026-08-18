import { z } from "zod";

export const assetTypeSchema = z.object({
  nama: z.string().trim().min(2, "Name must be at least 2 characters"),
  masaManfaatBulan: z.number().int("Must be a whole number").min(1, "Must be at least 1 month"),
  metodePenyusutan: z.literal("garis-lurus"),
});

export type AssetTypeFormValues = z.infer<typeof assetTypeSchema>;

export const fixedAssetSchema = z.object({
  nama: z.string().trim().min(2, "Name must be at least 2 characters"),
  jenisAsetId: z.string().min(1, "Select an asset type"),
  tanggalPerolehan: z.string().min(1, "Acquisition date is required"),
  hargaPerolehan: z.number().min(0, "Cannot be negative"),
  nilaiResidu: z.number().min(0, "Cannot be negative"),
  masaManfaatBulan: z.number().int("Must be a whole number").min(1, "Must be at least 1 month"),
  akunAsetId: z.string().min(1, "Select the asset account"),
  akunAkumPenyusutanId: z.string().min(1, "Select the accumulated depreciation account"),
  akunBebanPenyusutanId: z.string().min(1, "Select the depreciation expense account"),
  status: z.enum(["aktif", "dijual", "dihapusbukukan"]),
});

export type FixedAssetFormValues = z.infer<typeof fixedAssetSchema>;
