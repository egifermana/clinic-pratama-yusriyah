"use client";

import { useMemo, useState } from "react";
import { subDays } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DateRangeFilter } from "@/components/keuangan/DateRangeFilter";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import { rangeForPreset, type RangePreset } from "@/lib/date";
import { computeAccountBalances } from "@/lib/accounting/balances";

const fmtAmount = (v: number) => (v < 0 ? `(${formatCurrency(Math.abs(v))})` : formatCurrency(v));

export function BukuBesarReport() {
  const journalEntries = useClinicStore((s) => s.journalEntries);
  const accounts = useClinicStore((s) => s.accounts);
  const postableAccounts = accounts.filter((a) => !a.isHeader).sort((a, b) => a.kode.localeCompare(b.kode));

  const [accountId, setAccountId] = useState(postableAccounts[0]?.id ?? "");
  const [preset, setPreset] = useState<RangePreset>("this-month");
  const { start, end } = rangeForPreset(preset);

  const account = accounts.find((a) => a.id === accountId);

  const openingBalance = useMemo(() => {
    if (!account) return 0;
    return computeAccountBalances(journalEntries, accounts, subDays(start, 1)).get(account.id) ?? 0;
  }, [journalEntries, accounts, account, start]);

  const rows = useMemo(() => {
    if (!account) return [];
    const entries = journalEntries
      .filter((e) => {
        const d = new Date(e.tanggal);
        return d >= start && d <= end;
      })
      .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

    let running = openingBalance;
    const out: { entryId: string; nomor: string; tanggal: string; memo?: string; debit: number; kredit: number; running: number }[] = [];
    for (const entry of entries) {
      for (const line of entry.lines) {
        if (line.accountId !== account.id) continue;
        const delta = account.saldoNormal === "debit" ? line.debit - line.kredit : line.kredit - line.debit;
        running += delta;
        out.push({
          entryId: entry.id,
          nomor: entry.nomor,
          tanggal: entry.tanggal,
          memo: line.memo ?? entry.memo,
          debit: line.debit,
          kredit: line.kredit,
          running,
        });
      }
    }
    return out;
  }, [journalEntries, account, start, end, openingBalance]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select value={accountId} onValueChange={(v) => v && setAccountId(v)}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {postableAccounts.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.kode} {a.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DateRangeFilter preset={preset} onChange={setPreset} />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>No.</TableHead>
              <TableHead>Memo</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Kredit</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="text-muted-foreground">
                Opening Balance
              </TableCell>
              <TableCell className="text-right font-medium">{fmtAmount(openingBalance)}</TableCell>
            </TableRow>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-16 text-center text-muted-foreground">
                  No activity in this period.
                </TableCell>
              </TableRow>
            )}
            {rows.map((r, i) => (
              <TableRow key={`${r.entryId}-${i}`}>
                <TableCell className="text-muted-foreground">{formatDate(r.tanggal)}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{r.nomor}</TableCell>
                <TableCell className="max-w-48 truncate">{r.memo || "—"}</TableCell>
                <TableCell className="text-right">{r.debit ? formatCurrency(r.debit) : "—"}</TableCell>
                <TableCell className="text-right">{r.kredit ? formatCurrency(r.kredit) : "—"}</TableCell>
                <TableCell className="text-right font-medium">{fmtAmount(r.running)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
