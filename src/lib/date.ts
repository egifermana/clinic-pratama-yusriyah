import {
  eachDayOfInterval,
  endOfDay,
  format,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  subDays,
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
