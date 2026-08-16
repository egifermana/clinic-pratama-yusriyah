export interface DailyEntry {
  id: string;
  tanggal: string;
  opVisits: number;
  opRevenue: number;
  nonOpVisits: number;
  nonOpRevenue: number;
  change: number;
  pharmacy: number;
  medicalSupplies: number;
  utilities: number;
  salary: number;
  cleaning: number;
}

export type DailyEntryInput = Omit<DailyEntry, "id">;
