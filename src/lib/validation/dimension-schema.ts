import { z } from "zod";

export const dimensionSchema = z.object({
  nama: z.string().trim().min(2, "Name must be at least 2 characters"),
});

export type DimensionFormValues = z.infer<typeof dimensionSchema>;
