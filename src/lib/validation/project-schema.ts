import { z } from "zod";

export const projectSchema = z.object({
  nama: z.string().trim().min(2, "Name must be at least 2 characters"),
  tanggalMulai: z.string().optional(),
  tanggalSelesai: z.string().optional(),
  status: z.enum(["aktif", "selesai"]),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
