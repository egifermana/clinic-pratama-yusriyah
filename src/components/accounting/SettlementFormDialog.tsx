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
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import type { SettlementKind } from "@/types/accounting/settlement";

const todayStr = () => format(new Date(), "yyyy-MM-dd");

interface SettlementTarget {
  id: string;
  nomor: string;
  outstanding: number;
}

interface SettlementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jenis: SettlementKind;
  target: SettlementTarget | null;
}

export function SettlementFormDialog({ open, onOpenChange, jenis, target }: SettlementFormDialogProps) {
  const accounts = useClinicStore((s) => s.accounts);
  const addSettlement = useClinicStore((s) => s.addSettlement);
  const postableAccounts = accounts.filter((a) => !a.isHeader && a.aktif);

  const [tanggal, setTanggal] = useState(todayStr());
  const [jumlah, setJumlah] = useState("");
  const [akunKasBankId, setAkunKasBankId] = useState("");
  const [prevTarget, setPrevTarget] = useState<SettlementTarget | null>(target);

  if (target !== prevTarget) {
    setPrevTarget(target);
    if (target) {
      setTanggal(todayStr());
      setJumlah(String(target.outstanding));
      setAkunKasBankId("");
    }
  }

  const handleSubmit = () => {
    if (!target) return;
    const amount = Number(jumlah) || 0;
    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    if (amount > target.outstanding) {
      toast.error("Amount cannot exceed the outstanding balance");
      return;
    }
    if (!akunKasBankId) {
      toast.error("Select the Kas/Bank account");
      return;
    }
    addSettlement({
      tanggal: new Date(tanggal).toISOString(),
      jenis,
      invoiceId: target.id,
      jumlah: amount,
      akunKasBankId,
    });
    toast.success("Payment recorded");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            {target?.nomor} — outstanding {target ? formatCurrency(target.outstanding) : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="tanggal">Date</Label>
            <Input id="tanggal" type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="jumlah">Amount</Label>
            <Input
              id="jumlah"
              type="number"
              min={0}
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Kas/Bank Account</Label>
            <Select value={akunKasBankId} onValueChange={(v) => v && setAkunKasBankId(v)}>
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
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Save Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
