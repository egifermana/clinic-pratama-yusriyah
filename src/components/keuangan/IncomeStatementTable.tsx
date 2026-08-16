"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useClinicStore } from "@/lib/store";
import { computeIncomeStatementPeriods, type IncomeStatementPeriod } from "@/lib/finance/compute-income-statement-periods";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

type Mode = "monthly" | "quarterly";

const fmtAmount = (v: number) => {
  if (!Number.isFinite(v)) return "-";
  return v < 0 ? `(${formatCurrency(Math.abs(v))})` : formatCurrency(v);
};
const fmtPct = (v: number) => (Number.isFinite(v) ? `${(v * 100).toFixed(1)}%` : "-");
const fmtCount = (v: number) => (Number.isFinite(v) ? v.toLocaleString("en-US") : "-");

export function IncomeStatementTable() {
  const dailyEntries = useClinicStore((s) => s.dailyEntries);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [mode, setMode] = useState<Mode>("monthly");

  const periods = useMemo(
    () => computeIncomeStatementPeriods(dailyEntries, year, mode),
    [dailyEntries, year, mode]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setYear((y) => y - 1)}
            aria-label="Previous year"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="w-14 text-center text-sm font-semibold">{year}</span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setYear((y) => y + 1)}
            aria-label="Next year"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant={mode === "monthly" ? "default" : "outline"}
            onClick={() => setMode("monthly")}
          >
            Monthly
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "quarterly" ? "default" : "outline"}
            onClick={() => setMode("quarterly")}
          >
            Quarterly
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              {periods.map((p) => (
                <TableHead
                  key={p.label}
                  className={cn("text-right", p.isTotal && "bg-muted/60 font-semibold text-foreground")}
                >
                  {p.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <SectionRow label="Revenue" span={periods.length + 1} />
            <ItemRow label="Outpatient" periods={periods} getValue={(p) => p.revenue.outpatient} />
            <ItemRow
              label="Non-Outpatient"
              periods={periods}
              getValue={(p) => p.revenue.nonOutpatient}
            />
            <SubtotalRow label="Total Revenue" periods={periods} getValue={(p) => p.revenue.total} />

            <SectionRow label="Cost of Goods Sold" span={periods.length + 1} />
            <ItemRow label="Pharmacy" periods={periods} getValue={(p) => p.cogs.pharmacy} />
            <ItemRow label="Medstuff" periods={periods} getValue={(p) => p.cogs.medical} />
            <SubtotalRow label="Total COGS" periods={periods} getValue={(p) => p.cogs.total} />
            <SubtotalRow label="Gross Profit" periods={periods} getValue={(p) => p.grossProfit} emphasis />

            <SectionRow label="Operating Expenses" span={periods.length + 1} />
            <ItemRow label="Salary" periods={periods} getValue={(p) => p.opex.salary} />
            <ItemRow label="Change" periods={periods} getValue={(p) => p.opex.change} />
            <ItemRow label="Utilities" periods={periods} getValue={(p) => p.opex.utilities} />
            <ItemRow label="Cleaning Service" periods={periods} getValue={(p) => p.opex.cleaning} />
            <SubtotalRow
              label="Total Operating Expenses"
              periods={periods}
              getValue={(p) => p.opex.total}
            />
            <SubtotalRow
              label="Net Profit (Loss)"
              periods={periods}
              getValue={(p) => p.netProfit}
              emphasis
            />

            <SectionRow label="Patient Visit" span={periods.length + 1} />
            <ItemRow
              label="Outpatient"
              periods={periods}
              getValue={(p) => p.visits.outpatient}
              fmt={fmtCount}
            />
            <ItemRow
              label="Non-Outpatient"
              periods={periods}
              getValue={(p) => p.visits.nonOutpatient}
              fmt={fmtCount}
            />
            <SubtotalRow
              label="Total Visit"
              periods={periods}
              getValue={(p) => p.visits.total}
              fmt={fmtCount}
            />

            <SectionRow label="Margin" span={periods.length + 1} />
            <ItemRow
              label="COGS Margin"
              periods={periods}
              getValue={(p) => p.margins.cogsMargin}
              fmt={fmtPct}
            />
            <ItemRow
              label="Operating Margin"
              periods={periods}
              getValue={(p) => p.margins.operatingMargin}
              fmt={fmtPct}
            />
            <ItemRow
              label="Revenue per Visit"
              periods={periods}
              getValue={(p) => p.margins.revenuePerVisit}
            />
            <ItemRow
              label="Cost per Visit"
              periods={periods}
              getValue={(p) => p.margins.costPerVisit}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface RowProps {
  label: string;
  periods: IncomeStatementPeriod[];
  getValue: (p: IncomeStatementPeriod) => number;
  fmt?: (v: number) => string;
}

function SectionRow({ label, span }: { label: string; span: number }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={span} className="bg-muted/40 text-sm font-medium text-foreground">
        {label}
      </TableCell>
    </TableRow>
  );
}

function ItemRow({ label, periods, getValue, fmt = fmtAmount }: RowProps) {
  return (
    <TableRow>
      <TableCell className="text-muted-foreground">{label}</TableCell>
      {periods.map((p) => {
        const v = getValue(p);
        return (
          <TableCell
            key={p.label}
            className={cn(
              "text-right",
              Number.isFinite(v) && v < 0 && "text-destructive",
              p.isTotal && "bg-muted/30 font-medium"
            )}
          >
            {fmt(v)}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

function SubtotalRow({
  label,
  periods,
  getValue,
  fmt = fmtAmount,
  emphasis,
}: RowProps & { emphasis?: boolean }) {
  return (
    <TableRow className={cn(emphasis && "border-t border-border font-semibold")}>
      <TableCell className={emphasis ? "text-foreground" : "text-muted-foreground"}>{label}</TableCell>
      {periods.map((p) => {
        const v = getValue(p);
        return (
          <TableCell
            key={p.label}
            className={cn(
              "text-right",
              Number.isFinite(v) && v < 0 && "text-destructive",
              p.isTotal && "bg-muted/30",
              emphasis && "font-semibold"
            )}
          >
            {fmt(v)}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
