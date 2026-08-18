export type ProjectStatus = "aktif" | "selesai";

export interface Project {
  id: string;
  nama: string;
  tanggalMulai?: string;
  tanggalSelesai?: string;
  status: ProjectStatus;
  createdAt: string;
}

export type ProjectInput = Omit<Project, "id" | "createdAt">;
