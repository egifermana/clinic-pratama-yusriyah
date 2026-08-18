"use client";

import { useState } from "react";
import { toast } from "sonner";
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
  JournalLinesEditor,
  emptyJournalLine,
  type JournalLineDraft,
} from "@/components/accounting/JournalLinesEditor";
import { useClinicStore } from "@/lib/store";
import { generateId } from "@/lib/id";
import type { JournalTemplate } from "@/types/accounting/journal";

interface JournalTemplateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: JournalTemplate | null;
}

export function JournalTemplateFormDialog({
  open,
  onOpenChange,
  template,
}: JournalTemplateFormDialogProps) {
  const addJournalTemplate = useClinicStore((s) => s.addJournalTemplate);
  const updateJournalTemplate = useClinicStore((s) => s.updateJournalTemplate);
  const isEdit = Boolean(template);

  const [nama, setNama] = useState("");
  const [memo, setMemo] = useState("");
  const [lines, setLines] = useState<JournalLineDraft[]>([emptyJournalLine(), emptyJournalLine()]);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      if (template) {
        setNama(template.nama);
        setMemo(template.memo ?? "");
        setLines(
          template.lines.map((l) => ({
            key: generateId(),
            accountId: l.accountId,
            debit: l.debit ? String(l.debit) : "",
            kredit: l.kredit ? String(l.kredit) : "",
            memo: l.memo ?? "",
          }))
        );
      } else {
        setNama("");
        setMemo("");
        setLines([emptyJournalLine(), emptyJournalLine()]);
      }
    }
  }

  const handleSubmit = () => {
    const trimmedNama = nama.trim();
    if (!trimmedNama) {
      toast.error("Template name is required");
      return;
    }
    if (lines.length < 2 || lines.some((l) => !l.accountId)) {
      toast.error("Add at least 2 lines, each with an account");
      return;
    }

    const payload = {
      nama: trimmedNama,
      memo: memo || undefined,
      lines: lines.map((l) => ({
        accountId: l.accountId,
        debit: Number(l.debit) || 0,
        kredit: Number(l.kredit) || 0,
        memo: l.memo || undefined,
      })),
    };

    if (isEdit && template) {
      updateJournalTemplate(template.id, payload);
      toast.success("Template updated successfully");
    } else {
      addJournalTemplate(payload);
      toast.success("Template added successfully");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Template" : "Add Template"}</DialogTitle>
          <DialogDescription>
            Reusable line structure for recurring journal entries. Amounts are optional defaults.
          </DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[85vh] gap-3 overflow-y-auto overflow-x-hidden pr-1">
          <div className="grid gap-1.5">
            <Label htmlFor="nama">Template Name</Label>
            <Input id="nama" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Beban Gaji Bulanan" />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="memo">Default Memo (optional)</Label>
            <Input id="memo" value={memo} onChange={(e) => setMemo(e.target.value)} />
          </div>

          <JournalLinesEditor lines={lines} onChange={setLines} requireBalance={false} />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Add Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
