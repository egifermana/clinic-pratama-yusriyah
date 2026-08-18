import { normalBalanceForType, type Account, type AccountInput, type AccountType } from "@/types/accounting/account";

interface StarterAccountNode {
  kode: string;
  nama: string;
  children?: { kode: string; nama: string }[];
}

const STARTER_GROUPS: { tipe: AccountType; groups: StarterAccountNode[] }[] = [
  {
    tipe: "aset",
    groups: [
      {
        kode: "1-1000",
        nama: "Aset Lancar",
        children: [
          { kode: "1-1100", nama: "Kas" },
          { kode: "1-1200", nama: "Bank" },
          { kode: "1-1300", nama: "Piutang Usaha" },
          { kode: "1-1400", nama: "Persediaan Barang Dagang" },
          { kode: "1-1500", nama: "Perlengkapan" },
        ],
      },
      { kode: "1-2000", nama: "Aset Tetap" },
    ],
  },
  {
    tipe: "liabilitas",
    groups: [
      {
        kode: "2-1000",
        nama: "Liabilitas Jangka Pendek",
        children: [{ kode: "2-1100", nama: "Hutang Usaha" }],
      },
      {
        kode: "2-2000",
        nama: "Liabilitas Jangka Panjang",
        children: [{ kode: "2-2100", nama: "Hutang Bank" }],
      },
    ],
  },
  {
    tipe: "ekuitas",
    groups: [{ kode: "3-1000", nama: "Ekuitas", children: [{ kode: "3-1100", nama: "Modal" }] }],
  },
  {
    tipe: "pendapatan",
    groups: [
      {
        kode: "4-1000",
        nama: "Pendapatan",
        children: [
          { kode: "4-1100", nama: "Pendapatan Rawat Jalan" },
          { kode: "4-1200", nama: "Pendapatan Non-Rawat Jalan" },
        ],
      },
    ],
  },
  {
    tipe: "hpp",
    groups: [
      { kode: "5-1000", nama: "Harga Pokok Penjualan", children: [{ kode: "5-1100", nama: "HPP Obat" }] },
    ],
  },
  {
    tipe: "beban",
    groups: [
      {
        kode: "6-1000",
        nama: "Beban Operasional",
        children: [
          { kode: "6-1100", nama: "Beban Gaji" },
          { kode: "6-1200", nama: "Beban Listrik" },
          { kode: "6-1300", nama: "Beban Kebersihan" },
        ],
      },
    ],
  },
];

/**
 * Inserts a sensible default chart of accounts. Runs as two passes (headers,
 * then children referencing the real generated header ids) since `addAccount`
 * assigns each id at insert time.
 */
export function loadStarterAccounts(addAccount: (input: AccountInput) => Account): void {
  for (const { tipe, groups } of STARTER_GROUPS) {
    for (const group of groups) {
      const header = addAccount({
        kode: group.kode,
        nama: group.nama,
        tipe,
        isHeader: true,
        saldoNormal: normalBalanceForType(tipe),
        aktif: true,
      });
      for (const child of group.children ?? []) {
        addAccount({
          kode: child.kode,
          nama: child.nama,
          tipe,
          parentId: header.id,
          isHeader: false,
          saldoNormal: normalBalanceForType(tipe),
          aktif: true,
        });
      }
    }
  }
}
