"use client";

import { Button } from "@/components/ui/button";
import type { ChartPeriod } from "@/lib/date";

interface ChartPeriodToggleProps {
  period: ChartPeriod;
  onChange: (period: ChartPeriod) => void;
}

const PERIODS: { value: ChartPeriod; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export function ChartPeriodToggle({ period, onChange }: ChartPeriodToggleProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PERIODS.map((p) => (
        <Button
          key={p.value}
          type="button"
          size="sm"
          variant={period === p.value ? "default" : "outline"}
          onClick={() => onChange(p.value)}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
