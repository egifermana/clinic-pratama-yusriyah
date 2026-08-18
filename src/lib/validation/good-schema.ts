import { z } from "zod";

export const goodSchema = z
  .object({
    nama: z.string().trim().min(2, "Name must be at least 2 characters"),
    tipe: z.enum(["barang", "jasa"]),
    satuan: z.string().trim().min(1, "Unit is required"),
    hargaBeli: z.number().min(0, "Cannot be negative"),
    hargaJual: z.number().min(0, "Cannot be negative"),
    akunPersediaanId: z.string().optional(),
    akunPendapatanId: z.string().min(1, "Select the revenue account"),
    akunHppId: z.string().optional(),
    stok: z.number().min(0, "Cannot be negative").optional(),
  })
  .refine((v) => v.tipe !== "barang" || !!v.akunPersediaanId, {
    message: "Select the inventory account",
    path: ["akunPersediaanId"],
  })
  .refine((v) => v.tipe !== "barang" || !!v.akunHppId, {
    message: "Select the COGS account",
    path: ["akunHppId"],
  });

export type GoodFormValues = z.infer<typeof goodSchema>;
