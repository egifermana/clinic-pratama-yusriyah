"use client";

import { useMemo, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DateRangeFilter } from "@/components/keuangan/DateRangeFilter";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { rangeForPreset, type RangePreset } from "@/lib/date";
import { computeAccountBalances, rollUpBalances, orderedAccountRows } from "@/lib/accounting/balances";
import type { AccountType } from "@/types/accounting/account";

const fmtAmount = (v: number) => (v < 0 ? `(${formatCurrency(Math.abs(v))})` : formatCurrency(v));

export function LabaRugiReport() {
  const journalEntries = useClinicStore((s) => s.journalEntries);
  const accounts = useClinicStore((s) => s.accounts);
  const [preset, setPreset] = useState<RangePreset>("this-month");
  const { start, end } = rangeForPreset(preset);

  const balances = useMemo(
    () => rollUpBalances(accounts, computeAccountBalances(journalEntries, accounts, end, start)),
    [journalEntries, accounts, end, start]
  );
  const valueOf = (id: string) => balances.get(id) ?? 0;

  const section = (tipe: AccountType) => {
    const sectionAccounts = accounts.filter((a) => a.tipe === tipe);
    const rows = orderedAccountRows(sectionAccounts).filter((r) => valueOf(r.account.id) !== 0);
    const total = sectionAccounts.filter((a) => !a.parentId).reduce((sum, a) => sum + valueOf(a.id), 0);
    return { rows, total };
  };

  const pendapatan = section("pendapatan");
  const hpp = section("hpp");
  const beban = section("beban");
  const labaKotor = pendapatan.total - hpp.total;
  const labaBersih = labaKotor - beban.total;

  const renderSection = (title: string, data: ReturnType<typeof section>) => (
    <>
      <TableRow className="hover:bg-transparent">
        <TableCell colSpan={2} className="bg-muted/40 text-sm font-medium text-foreground">
          {title}
        </TableCell>
      </TableRow>
      {data.rows.map(({ account, depth }) => (
        <TableRow key={account.id}>
          <TableCell
            style={{ paddingLeft: `${12 + depth * 20}px` }}
            className={account.isHeader ? "font-medium text-foreground" : "text-muted-foreground"}
          >
            {account.nama}
          </TableCell>
          <TableCell className={account.isHeader ? "text-right font-medium" : "text-right"}>
            {fmtAmount(valueOf(account.id))}
          </TableCell>
        </TableRow>
      ))}
      <TableRow className="border-t border-border font-semibold">
        <TableCell>Total {title}</TableCell>
        <TableCell className="text-right">{fmtAmount(data.total)}</TableCell>
      </TableRow>
    </>
  );

  return (
    <div className="flex flex-col gap-3">
      <DateRangeFilter preset={preset} onChange={setPreset} />

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderSection("Pendapatan", pendapatan)}
            {renderSection("Harga Pokok Penjualan", hpp)}
            <TableRow className="border-t border-border font-semibold">
              <TableCell>Laba Kotor</TableCell>
              <TableCell className="text-right">{fmtAmount(labaKotor)}</TableCell>
            </TableRow>
            {renderSection("Beban", beban)}
            <TableRow className="border-t border-border font-semibold">
              <TableCell>Laba Bersih</TableCell>
              <TableCell className="text-right">{fmtAmount(labaBersih)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
