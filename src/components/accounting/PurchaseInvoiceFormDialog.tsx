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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GoodsLinesEditor,
  emptyGoodsLine,
  goodsLinesTotal,
  type GoodsLineDraft,
} from "@/components/accounting/GoodsLinesEditor";
import { useClinicStore } from "@/lib/store";

const todayStr = () => format(new Date(), "yyyy-MM-dd");

interface PurchaseInvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PurchaseInvoiceFormDialog({ open, onOpenChange }: PurchaseInvoiceFormDialogProps) {
  const partners = useClinicStore((s) => s.partners);
  const accounts = useClinicStore((s) => s.accounts);
  const addPurchaseInvoice = useClinicStore((s) => s.addPurchaseInvoice);
  const postableAccounts = accounts.filter((a) => !a.isHeader && a.aktif);

  const [tanggal, setTanggal] = useState(todayStr());
  const [partnerId, setPartnerId] = useState("");
  const [catatan, setCatatan] = useState("");
  const [lines, setLines] = useState<GoodsLineDraft[]>([emptyGoodsLine()]);
  const [lunasLangsung, setLunasLangsung] = useState(true);
  const [akunKasHutangId, setAkunKasHutangId] = useState("");

  const reset = () => {
    setTanggal(todayStr());
    setPartnerId("");
    setCatatan("");
    setLines([emptyGoodsLine()]);
    setLunasLangsung(true);
    setAkunKasHutangId("");
  };

  const handleOpenChange = (next: boolean) => {
    if (next) reset();
    onOpenChange(next);
  };

  const handleSubmit = () => {
    if (!partnerId) {
      toast.error("Select a supplier");
      return;
    }
    if (lines.length === 0 || lines.some((l) => !l.goodId || !Number(l.qty))) {
      toast.error("Add at least one item, each with a quantity");
      return;
    }
    if (!akunKasHutangId) {
      toast.error(lunasLangsung ? "Select the Kas/Bank account" : "Select the Hutang account");
      return;
    }

    addPurchaseInvoice({
      tanggal: new Date(tanggal).toISOString(),
      partnerId,
      lines: lines.map((l) => ({ goodId: l.goodId, qty: Number(l.qty) || 0, harga: Number(l.harga) || 0 })),
      akunKasHutangId,
      lunasLangsung,
      catatan: catatan || undefined,
    });
    toast.success("Purchase invoice saved");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Purchase Invoice</DialogTitle>
          <DialogDescription>Restocks inventory and posts to the journal.</DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[85vh] gap-3 overflow-y-auto overflow-x-hidden pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="tanggal">Date</Label>
              <Input id="tanggal" type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Supplier</Label>
              <Select value={partnerId} onValueChange={(v) => v && setPartnerId(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {partners.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <GoodsLinesEditor lines={lines} onChange={setLines} mode="purchase" autofillPriceField="hargaBeli" />

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <Label htmlFor="lunasLangsung">Paid immediately (cash)</Label>
            <Switch id="lunasLangsung" checked={lunasLangsung} onCheckedChange={setLunasLangsung} />
          </div>

          <div className="grid gap-1.5">
            <Label>{lunasLangsung ? "Kas/Bank Account" : "Hutang Account"}</Label>
            <Select value={akunKasHutangId} onValueChange={(v) => v && setAkunKasHutangId(v)}>
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
            Save ({goodsLinesTotal(lines) > 0 ? goodsLinesTotal(lines).toLocaleString("en-US") : 0})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
