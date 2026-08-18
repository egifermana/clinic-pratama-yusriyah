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

const todayStr = () => format(new Date(), "yyyy-MM-dd");

interface StockOpnameFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StockOpnameFormDialog({ open, onOpenChange }: StockOpnameFormDialogProps) {
  const goods = useClinicStore((s) => s.goods.filter((g) => g.tipe === "barang"));
  const accounts = useClinicStore((s) => s.accounts);
  const addStockOpname = useClinicStore((s) => s.addStockOpname);
  const postableAccounts = accounts.filter((a) => !a.isHeader && a.aktif);

  const [tanggal, setTanggal] = useState(todayStr());
  const [catatan, setCatatan] = useState("");
  const [akunSelisihId, setAkunSelisihId] = useState("");
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setTanggal(todayStr());
      setCatatan("");
      setAkunSelisihId("");
      setCounts(Object.fromEntries(goods.map((g) => [g.id, String(g.stok ?? 0)])));
    }
  }

  const handleSubmit = () => {
    if (!akunSelisihId) {
      toast.error("Select the variance account");
      return;
    }
    const lines = goods.map((g) => ({
      goodId: g.id,
      stokSistem: g.stok ?? 0,
      stokFisik: Number(counts[g.id]) || 0,
    }));
    const changed = lines.filter((l) => l.stokFisik !== l.stokSistem);
    if (changed.length === 0) {
      toast.error("No quantity differs from the system stock");
      return;
    }

    addStockOpname({
      tanggal: new Date(tanggal).toISOString(),
      lines,
      akunSelisihId,
      catatan: catatan || undefined,
    });
    toast.success(`Stock opname saved (${changed.length} item(s) adjusted)`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Stock Opname</DialogTitle>
          <DialogDescription>
            Count physical stock; differences post a variance journal entry.
          </DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[85vh] gap-3 overflow-y-auto overflow-x-hidden pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="tanggal">Date</Label>
              <Input id="tanggal" type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Variance Account</Label>
              <Select value={akunSelisihId} onValueChange={(v) => v && setAkunSelisihId(v)}>
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

          <div className="rounded-lg border border-border">
            <div className="grid grid-cols-[1fr_80px_80px] gap-2 border-b border-border p-2 text-xs font-medium text-muted-foreground">
              <span>Item</span>
              <span className="text-right">System</span>
              <span className="text-right">Physical</span>
            </div>
            {goods.length === 0 && (
              <p className="p-3 text-center text-sm text-muted-foreground">
                No barang items in Master Data yet.
              </p>
            )}
            {goods.map((g) => (
              <div key={g.id} className="grid grid-cols-[1fr_80px_80px] items-center gap-2 border-b border-border p-2 last:border-b-0">
                <span className="truncate text-sm">{g.nama}</span>
                <span className="text-right text-sm text-muted-foreground">{g.stok ?? 0}</span>
                <Input
                  type="number"
                  min={0}
                  value={counts[g.id] ?? ""}
                  onChange={(e) => setCounts((prev) => ({ ...prev, [g.id]: e.target.value }))}
                  className="h-8 text-right text-sm"
                />
              </div>
            ))}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="catatan">Notes (optional)</Label>
            <Input id="catatan" value={catatan} onChange={(e) => setCatatan(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Save Opname
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
