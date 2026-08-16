"use client";

import { Button } from "@/components/ui/button";
import type { RangePreset } from "@/lib/date";

interface DateRangeFilterProps {
  preset: RangePreset;
  onChange: (preset: RangePreset) => void;
}

const PRESETS: { value: RangePreset; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7-days", label: "7 Days" },
  { value: "30-days", label: "30 Days" },
  { value: "this-month", label: "This Month" },
];

export function DateRangeFilter({ preset, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PRESETS.map((p) => (
        <Button
          key={p.value}
          type="button"
          size="sm"
          variant={preset === p.value ? "default" : "outline"}
          onClick={() => onChange(p.value)}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
