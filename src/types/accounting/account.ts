export type AccountType = "aset" | "liabilitas" | "ekuitas" | "pendapatan" | "hpp" | "beban";

export function normalBalanceForType(tipe: AccountType): "debit" | "kredit" {
  return tipe === "aset" || tipe === "hpp" || tipe === "beban" ? "debit" : "kredit";
}

export interface Account {
  id: string;
  kode: string;
  nama: string;
  tipe: AccountType;
  parentId?: string;
  isHeader: boolean;
  saldoNormal: "debit" | "kredit";
  aktif: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AccountInput = Omit<Account, "id" | "createdAt" | "updatedAt">;
