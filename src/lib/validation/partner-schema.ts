import { z } from "zod";

export const partnerCategorySchema = z.object({
  nama: z.string().trim().min(2, "Name must be at least 2 characters"),
});

export type PartnerCategoryFormValues = z.infer<typeof partnerCategorySchema>;

export const partnerSchema = z.object({
  nama: z.string().trim().min(2, "Name must be at least 2 characters"),
  tipe: z.enum(["pelanggan", "pemasok", "lainnya"]),
  kategoriId: z.string().optional(),
  kontak: z.string().trim().optional(),
  alamat: z.string().trim().optional(),
  npwp: z.string().trim().optional(),
});

export type PartnerFormValues = z.infer<typeof partnerSchema>;
