"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { generateId } from "@/lib/id";

export interface JournalLineDraft {
  key: string;
  accountId: string;
  debit: string;
  kredit: string;
  memo: string;
}

export function emptyJournalLine(): JournalLineDraft {
  return { key: generateId(), accountId: "", debit: "", kredit: "", memo: "" };
}

export function sumSide(lines: JournalLineDraft[], side: "debit" | "kredit"): number {
  return lines.reduce((sum, l) => sum + (Number(l[side]) || 0), 0);
}

interface JournalLinesEditorProps {
  lines: JournalLineDraft[];
  onChange: (lines: JournalLineDraft[]) => void;
  requireBalance?: boolean;
}

export function JournalLinesEditor({
  lines,
  onChange,
  requireBalance = true,
}: JournalLinesEditorProps) {
  const accounts = useClinicStore((s) => s.accounts);
  const postableAccounts = accounts.filter((a) => !a.isHeader && a.aktif);

  const updateLine = (key: string, patch: Partial<JournalLineDraft>) => {
    onChange(lines.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  };
  const removeLine = (key: string) => {
    onChange(lines.filter((l) => l.key !== key));
  };
  const addLine = () => {
    onChange([...lines, emptyJournalLine()]);
  };

  const totalDebit = sumSide(lines, "debit");
  const totalKredit = sumSide(lines, "kredit");
  const difference = totalDebit - totalKredit;
  const balanced = difference === 0;

  return (
    <div className="flex flex-col gap-2">
      {lines.map((line) => (
        <div key={line.key} className="grid gap-2 rounded-lg border border-border p-2">
          <div className="flex items-center gap-2">
            <Select
              value={line.accountId}
              onValueChange={(v) => v && updateLine(line.key, { accountId: v })}
            >
              <SelectTrigger className="w-full">
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
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => removeLine(line.key)}
              aria-label="Remove line"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input
              value={line.memo}
              onChange={(e) => updateLine(line.key, { memo: e.target.value })}
              placeholder="Memo"
              className="text-xs sm:text-sm"
            />
            <Input
              type="number"
              min={0}
              value={line.debit}
              onChange={(e) => updateLine(line.key, { debit: e.target.value, kredit: e.target.value ? "" : line.kredit })}
              placeholder="Debit"
              className="text-xs sm:text-sm"
            />
            <Input
              type="number"
              min={0}
              value={line.kredit}
              onChange={(e) => updateLine(line.key, { kredit: e.target.value, debit: e.target.value ? "" : line.debit })}
              placeholder="Kredit"
              className="text-xs sm:text-sm"
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addLine}>
        <Plus className="size-4" /> Add Line
      </Button>

      <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/30 p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total Debit</span>
          <span className="font-medium">{formatCurrency(totalDebit)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total Kredit</span>
          <span className="font-medium">{formatCurrency(totalKredit)}</span>
        </div>
        {requireBalance && (
          <div className="flex items-center justify-between border-t border-border pt-1">
            <span className="text-muted-foreground">Selisih</span>
            <span className={cn("font-semibold", !balanced && "text-destructive")}>
              {formatCurrency(Math.abs(difference))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
