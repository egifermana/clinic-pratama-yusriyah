import { startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from "date-fns";
import type { DailyEntry } from "@/types/finance";
import { isWithinDateRange } from "@/lib/date";

export interface IncomeStatementPeriod {
  label: string;
  isTotal: boolean;
  revenue: { outpatient: number; nonOutpatient: number; total: number };
  cogs: { pharmacy: number; medical: number; total: number };
  grossProfit: number;
  opex: { salary: number; change: number; utilities: number; cleaning: number; total: number };
  netProfit: number;
  visits: { outpatient: number; nonOutpatient: number; total: number };
  margins: {
    cogsMargin: number;
    operatingMargin: number;
    revenuePerVisit: number;
    costPerVisit: number;
  };
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function buildPeriod(
  label: string,
  start: Date,
  end: Date,
  entries: DailyEntry[],
  isTotal: boolean
): IncomeStatementPeriod {
  const periodEntries = entries.filter((e) => isWithinDateRange(e.tanggal, start, end));
  const sum = (key: keyof DailyEntry) =>
    periodEntries.reduce((total, entry) => total + (Number(entry[key]) || 0), 0);

  const opRevenue = sum("opRevenue");
  const nonOpRevenue = sum("nonOpRevenue");
  const revenueTotal = opRevenue + nonOpRevenue;

  const pharmacy = sum("pharmacy");
  const medicalSupplies = sum("medicalSupplies");
  const cogsTotal = pharmacy + medicalSupplies;

  const grossProfit = revenueTotal - cogsTotal;

  const salary = sum("salary");
  const change = sum("change");
  const utilities = sum("utilities");
  const cleaning = sum("cleaning");
  const opexTotal = salary + change + utilities + cleaning;

  const netProfit = grossProfit - opexTotal;

  const opVisits = sum("opVisits");
  const nonOpVisits = sum("nonOpVisits");
  const visitsTotal = opVisits + nonOpVisits;

  return {
    label,
    isTotal,
    revenue: { outpatient: opRevenue, nonOutpatient: nonOpRevenue, total: revenueTotal },
    cogs: { pharmacy, medical: medicalSupplies, total: cogsTotal },
    grossProfit,
    opex: { salary, change, utilities, cleaning, total: opexTotal },
    netProfit,
    visits: { outpatient: opVisits, nonOutpatient: nonOpVisits, total: visitsTotal },
    margins: {
      cogsMargin: revenueTotal ? cogsTotal / revenueTotal : NaN,
      operatingMargin: revenueTotal ? netProfit / revenueTotal : NaN,
      revenuePerVisit: visitsTotal ? revenueTotal / visitsTotal : NaN,
      costPerVisit: visitsTotal ? (cogsTotal + opexTotal) / visitsTotal : NaN,
    },
  };
}

export function computeIncomeStatementPeriods(
  entries: DailyEntry[],
  year: number,
  mode: "monthly" | "quarterly"
): IncomeStatementPeriod[] {
  const ranges =
    mode === "monthly"
      ? MONTH_LABELS.map((label, i) => {
          const d = new Date(year, i, 1);
          return { label, start: startOfMonth(d), end: endOfMonth(d) };
        })
      : [0, 1, 2, 3].map((q) => {
          const d = new Date(year, q * 3, 1);
          return { label: `Q${q + 1}`, start: startOfQuarter(d), end: endOfQuarter(d) };
        });

  const periods = ranges.map((r) => buildPeriod(r.label, r.start, r.end, entries, false));

  const yearDate = new Date(year, 0, 1);
  const totalPeriod = buildPeriod(
    `Total ${year}`,
    startOfYear(yearDate),
    endOfYear(yearDate),
    entries,
    true
  );

  return [...periods, totalPeriod];
}
