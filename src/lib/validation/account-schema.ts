import { z } from "zod";

export const accountSchema = z.object({
  kode: z.string().trim().min(1, "Code is required"),
  nama: z.string().trim().min(2, "Name must be at least 2 characters"),
  tipe: z.enum(["aset", "liabilitas", "ekuitas", "pendapatan", "hpp", "beban"]),
  parentId: z.string().optional(),
  isHeader: z.boolean(),
  aktif: z.boolean(),
});

export type AccountFormValues = z.infer<typeof accountSchema>;
