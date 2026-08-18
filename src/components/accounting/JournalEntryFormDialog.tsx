"use client";

import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  JournalLinesEditor,
  emptyJournalLine,
  sumSide,
  type JournalLineDraft,
} from "@/components/accounting/JournalLinesEditor";
import { useClinicStore } from "@/lib/store";

const todayStr = () => format(new Date(), "yyyy-MM-dd");

const NO_TEMPLATE = "none";

interface JournalEntryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JournalEntryFormDialog({ open, onOpenChange }: JournalEntryFormDialogProps) {
  const journalTemplates = useClinicStore((s) => s.journalTemplates);
  const addJournalEntry = useClinicStore((s) => s.addJournalEntry);

  const [tanggal, setTanggal] = useState(todayStr());
  const [memo, setMemo] = useState("");
  const [lines, setLines] = useState<JournalLineDraft[]>([emptyJournalLine(), emptyJournalLine()]);
  const [templateId, setTemplateId] = useState(NO_TEMPLATE);

  const reset = () => {
    setTanggal(todayStr());
    setMemo("");
    setLines([emptyJournalLine(), emptyJournalLine()]);
    setTemplateId(NO_TEMPLATE);
  };

  const handleOpenChange = (next: boolean) => {
    if (next) reset();
    onOpenChange(next);
  };

  const handleTemplateSelect = (id: string) => {
    setTemplateId(id);
    if (id === NO_TEMPLATE) return;
    const template = journalTemplates.find((t) => t.id === id);
    if (!template) return;
    setLines(
      template.lines.map((l) => ({
        key: crypto.randomUUID(),
        accountId: l.accountId,
        debit: l.debit ? String(l.debit) : "",
        kredit: l.kredit ? String(l.kredit) : "",
        memo: l.memo ?? "",
      }))
    );
    if (!memo) setMemo(template.memo ?? "");
  };

  const handleSubmit = () => {
    if (!tanggal) {
      toast.error("Date is required");
      return;
    }
    if (lines.length < 2) {
      toast.error("A journal entry needs at least 2 lines");
      return;
    }
    if (lines.some((l) => !l.accountId)) {
      toast.error("Every line needs an account");
      return;
    }
    if (lines.some((l) => !Number(l.debit) && !Number(l.kredit))) {
      toast.error("Every line needs a debit or kredit amount");
      return;
    }
    const totalDebit = sumSide(lines, "debit");
    const totalKredit = sumSide(lines, "kredit");
    if (totalDebit === 0) {
      toast.error("Total amount cannot be zero");
      return;
    }
    if (totalDebit !== totalKredit) {
      toast.error("Total Debit and Total Kredit must be equal");
      return;
    }

    addJournalEntry({
      tanggal: new Date(tanggal).toISOString(),
      memo: memo || undefined,
      sourceType: "manual",
      lines: lines.map((l) => ({
        accountId: l.accountId,
        debit: Number(l.debit) || 0,
        kredit: Number(l.kredit) || 0,
        memo: l.memo || undefined,
      })),
    });
    toast.success("Journal entry saved");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Journal Entry</DialogTitle>
          <DialogDescription>Record a manual, balanced journal entry.</DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[85vh] gap-3 overflow-y-auto overflow-x-hidden pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="tanggal">Date</Label>
              <Input
                id="tanggal"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Load Template (optional)</Label>
              <Select value={templateId} onValueChange={(v) => v && handleTemplateSelect(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_TEMPLATE}>None</SelectItem>
                  {journalTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="memo">Memo</Label>
            <Input id="memo" value={memo} onChange={(e) => setMemo(e.target.value)} />
          </div>

          <JournalLinesEditor lines={lines} onChange={setLines} />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Save Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
