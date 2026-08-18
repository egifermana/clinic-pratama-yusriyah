"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { computeAccountBalances } from "@/lib/accounting/balances";
import type { Account } from "@/types/accounting/account";

const todayStr = () => format(new Date(), "yyyy-MM-dd");

function splitDebitKredit(account: Account, balance: number): { debit: number; kredit: number } {
  const normalIsDebit = account.saldoNormal === "debit";
  if (balance >= 0) {
    return normalIsDebit ? { debit: balance, kredit: 0 } : { debit: 0, kredit: balance };
  }
  return normalIsDebit ? { debit: 0, kredit: -balance } : { debit: -balance, kredit: 0 };
}

export function NeracaSaldoReport() {
  const journalEntries = useClinicStore((s) => s.journalEntries);
  const accounts = useClinicStore((s) => s.accounts);
  const [asOfDate, setAsOfDate] = useState(todayStr());

  const postable = useMemo(
    () => accounts.filter((a) => !a.isHeader).sort((a, b) => a.kode.localeCompare(b.kode)),
    [accounts]
  );

  const balances = useMemo(
    () => computeAccountBalances(journalEntries, accounts, new Date(asOfDate)),
    [journalEntries, accounts, asOfDate]
  );

  const rows = postable
    .map((a) => ({ account: a, ...splitDebitKredit(a, balances.get(a.id) ?? 0) }))
    .filter((r) => r.debit !== 0 || r.kredit !== 0);

  const totalDebit = rows.reduce((sum, r) => sum + r.debit, 0);
  const totalKredit = rows.reduce((sum, r) => sum + r.kredit, 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5 sm:w-64">
        <Label htmlFor="asOfDate" className="shrink-0 text-sm">
          As of
        </Label>
        <Input id="asOfDate" type="date" value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)} />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Kredit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No account activity as of this date.
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.account.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{r.account.kode}</TableCell>
                <TableCell>{r.account.nama}</TableCell>
                <TableCell className="text-right">{r.debit ? formatCurrency(r.debit) : "—"}</TableCell>
                <TableCell className="text-right">{r.kredit ? formatCurrency(r.kredit) : "—"}</TableCell>
              </TableRow>
            ))}
            {rows.length > 0 && (
              <TableRow className="border-t border-border font-semibold">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right">{formatCurrency(totalDebit)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalKredit)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
