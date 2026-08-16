import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { enUS } from "date-fns/locale";

export function nowIso(): string {
  return new Date().toISOString();
}

export function formatDate(iso: string): string {
  return format(new Date(iso), "d MMM yyyy", { locale: enUS });
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), "d MMM yyyy, HH:mm", { locale: enUS });
}

export function isToday(iso: string): boolean {
  return isWithinInterval(new Date(iso), {
    start: startOfDay(new Date()),
    end: endOfDay(new Date()),
  });
}

export function isWithinDateRange(iso: string, start: Date, end: Date): boolean {
  return isWithinInterval(new Date(iso), {
    start: startOfDay(start),
    end: endOfDay(end),
  });
}

export function last7Days(): Date[] {
  return eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() });
}

export function dayKey(iso: string): string {
  return format(new Date(iso), "yyyy-MM-dd");
}

export type ChartPeriod = "daily" | "weekly" | "monthly";

export const CHART_PERIOD_LABELS: Record<ChartPeriod, string> = {
  daily: "Last 7 Days",
  weekly: "Last 8 Weeks",
  monthly: "Last 6 Months",
};

export interface ChartBucket {
  start: Date;
  end: Date;
  label: string;
}

export function chartBuckets(period: ChartPeriod): ChartBucket[] {
  const now = new Date();
  switch (period) {
    case "daily":
      return last7Days().map((d) => ({
        start: startOfDay(d),
        end: endOfDay(d),
        label: format(d, "EEE", { locale: enUS }),
      }));
    case "weekly":
      return eachWeekOfInterval(
        { start: subWeeks(now, 7), end: now },
        { weekStartsOn: 1 }
      ).map((weekStart) => {
        const start = startOfWeek(weekStart, { weekStartsOn: 1 });
        return {
          start,
          end: endOfWeek(weekStart, { weekStartsOn: 1 }),
          label: format(start, "d MMM", { locale: enUS }),
        };
      });
    case "monthly":
      return eachMonthOfInterval({ start: subMonths(now, 5), end: now }).map((m) => ({
        start: startOfMonth(m),
        end: endOfMonth(m),
        label: format(m, "MMM yy", { locale: enUS }),
      }));
  }
}

export type RangePreset = "today" | "7-days" | "30-days" | "this-month";

export function rangeForPreset(preset: RangePreset): { start: Date; end: Date } {
  const now = new Date();
  switch (preset) {
    case "today":
      return { start: now, end: now };
    case "7-days":
      return { start: subDays(now, 6), end: now };
    case "30-days":
      return { start: subDays(now, 29), end: now };
    case "this-month":
      return { start: startOfMonth(now), end: now };
  }
}
