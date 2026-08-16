import { z } from "zod";

export const productSchema = z.object({
  nama: z.string().trim().min(2, "Product name must be at least 2 characters"),
  kategori: z.string().min(1, "Select a category"),
  satuan: z.string().trim().min(1, "Unit is required"),
  satuanBesar: z.string().trim().min(1, "Box unit is required"),
  isiPerBox: z.number().int("Must be a whole number").min(1, "Must be at least 1"),
  jumlahStok: z.number().int("Must be a whole number").min(0, "Cannot be negative"),
  stokMinimum: z.number().int("Must be a whole number").min(0, "Cannot be negative"),
  hargaCogsBox: z.number().min(0, "Cannot be negative"),
  hargaCogsStrip: z.number().min(0, "Cannot be negative"),
  hargaJualBox: z.number().min(0, "Cannot be negative"),
  hargaJualStrip: z.number().min(0, "Cannot be negative"),
  hargaHetBox: z.number().min(0, "Cannot be negative"),
  hargaHetStrip: z.number().min(0, "Cannot be negative"),
  tanggalKadaluarsa: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
