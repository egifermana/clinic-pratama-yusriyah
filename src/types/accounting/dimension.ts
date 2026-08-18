export interface Dimension {
  id: string;
  nama: string;
  createdAt: string;
}

export type DimensionInput = Omit<Dimension, "id" | "createdAt">;
