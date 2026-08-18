"use client";

import { Fragment, useMemo, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import {
  computeAccountBalances,
  rollUpBalances,
  monthEndColumns,
  percentChange,
  orderedAccountRows,
} from "@/lib/accounting/balances";
import type { AccountType } from "@/types/accounting/account";

const fmtAmount = (v: number) => (v < 0 ? `(${formatCurrency(Math.abs(v))})` : formatCurrency(v));
const fmtPct = (v: number | null) => (v === null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`);

export function NeracaReport() {
  const journalEntries = useClinicStore((s) => s.journalEntries);
  const accounts = useClinicStore((s) => s.accounts);

  const [columnCount, setColumnCount] = useState(3);
  const [showZero, setShowZero] = useState(false);
  const [showHorizontal, setShowHorizontal] = useState(true);

  const columns = useMemo(() => monthEndColumns(columnCount), [columnCount]);

  const balancesByColumn = useMemo(
    () =>
      columns.map((col) => rollUpBalances(accounts, computeAccountBalances(journalEntries, accounts, col.asOf))),
    [columns, accounts, journalEntries]
  );

  const valueAt = (accountId: string, colIndex: number) => balancesByColumn[colIndex]?.get(accountId) ?? 0;

  const buildSection = (tipes: AccountType[]) => {
    const sectionAccounts = accounts.filter((a) => tipes.includes(a.tipe));
    const rows = orderedAccountRows(sectionAccounts).filter(
      (r) => showZero || columns.some((_, i) => valueAt(r.account.id, i) !== 0)
    );
    const topLevelIds = sectionAccounts.filter((a) => !a.parentId).map((a) => a.id);
    const totals = columns.map((_, i) => topLevelIds.reduce((sum, id) => sum + valueAt(id, i), 0));
    return { rows, totals };
  };

  const aset = buildSection(["aset"]);
  const liabilitasEkuitas = buildSection(["liabilitas", "ekuitas"]);

  const colSpan = 1 + columnCount + (showHorizontal ? columnCount - 1 : 0);

  const renderSection = (title: string, section: ReturnType<typeof buildSection>) => (
    <>
      <TableRow className="hover:bg-transparent">
        <TableCell colSpan={colSpan} className="bg-muted/40 text-sm font-medium text-foreground">
          {title}
        </TableCell>
      </TableRow>
      {section.rows.map(({ account, depth }) => (
        <TableRow key={account.id}>
          <TableCell
            style={{ paddingLeft: `${12 + depth * 20}px` }}
            className={account.isHeader ? "font-medium text-foreground" : "text-muted-foreground"}
          >
            {account.nama}
          </TableCell>
          {columns.map((_, i) => (
            <Fragment key={i}>
              <TableCell
                className={cn("text-right", account.isHeader && "font-medium text-foreground")}
              >
                {fmtAmount(valueAt(account.id, i))}
              </TableCell>
              {showHorizontal && i > 0 && (
                <TableCell className="text-right text-xs text-muted-foreground">
                  {fmtPct(percentChange(valueAt(account.id, i - 1), valueAt(account.id, i)))}
                </TableCell>
              )}
            </Fragment>
          ))}
        </TableRow>
      ))}
      <TableRow className="border-t border-border font-semibold">
        <TableCell>Total {title}</TableCell>
        {columns.map((_, i) => (
          <Fragment key={i}>
            <TableCell className="text-right text-foreground">
              {fmtAmount(section.totals[i])}
            </TableCell>
            {showHorizontal && i > 0 && (
              <TableCell className="text-right text-xs text-muted-foreground">
                {fmtPct(percentChange(section.totals[i - 1], section.totals[i]))}
              </TableCell>
            )}
          </Fragment>
        ))}
      </TableRow>
    </>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm">Columns</Label>
          <Select value={String(columnCount)} onValueChange={(v) => v && setColumnCount(Number(v))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Switch id="showZero" checked={showZero} onCheckedChange={setShowZero} />
            <Label htmlFor="showZero" className="text-sm">
              Show zero balances
            </Label>
          </div>
          <div className="flex items-center gap-1.5">
            <Switch id="showHorizontal" checked={showHorizontal} onCheckedChange={setShowHorizontal} />
            <Label htmlFor="showHorizontal" className="text-sm">
              Horizontal analysis (Δ%)
            </Label>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              {columns.map((col, i) => (
                <Fragment key={i}>
                  <TableHead className="text-right">{col.label}</TableHead>
                  {showHorizontal && i > 0 && <TableHead className="text-right">Δ%</TableHead>}
                </Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderSection("Aset (Harta)", aset)}
            {renderSection("Liabilitas & Ekuitas", liabilitasEkuitas)}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
