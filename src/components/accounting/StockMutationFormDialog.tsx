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
import type { StockMutationType } from "@/types/accounting/stock-mutation";

const todayStr = () => format(new Date(), "yyyy-MM-dd");

interface StockMutationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fixedTipe?: StockMutationType;
}

export function StockMutationFormDialog({ open, onOpenChange, fixedTipe }: StockMutationFormDialogProps) {
  const goods = useClinicStore((s) => s.goods.filter((g) => g.tipe === "barang"));
  const accounts = useClinicStore((s) => s.accounts);
  const addStockMutation = useClinicStore((s) => s.addStockMutation);
  const postableAccounts = accounts.filter((a) => !a.isHeader && a.aktif);

  const [tanggal, setTanggal] = useState(todayStr());
  const [goodId, setGoodId] = useState("");
  const [tipe, setTipe] = useState<StockMutationType>(fixedTipe ?? "masuk");
  const [qty, setQty] = useState("1");
  const [hargaSatuan, setHargaSatuan] = useState("0");
  const [akunLawanId, setAkunLawanId] = useState("");
  const [catatan, setCatatan] = useState("");

  const reset = () => {
    setTanggal(todayStr());
    setGoodId("");
    setTipe(fixedTipe ?? "masuk");
    setQty("1");
    setHargaSatuan("0");
    setAkunLawanId("");
    setCatatan("");
  };

  const handleOpenChange = (next: boolean) => {
    if (next) reset();
    onOpenChange(next);
  };

  const handleGoodSelect = (id: string) => {
    setGoodId(id);
    const good = goods.find((g) => g.id === id);
    if (good) setHargaSatuan(String(good.hargaBeli));
  };

  const handleSubmit = () => {
    if (!goodId) {
      toast.error("Select an item");
      return;
    }
    if (!Number(qty) || Number(qty) <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }
    if (!akunLawanId) {
      toast.error("Select the counter account");
      return;
    }
    const result = addStockMutation({
      tanggal: new Date(tanggal).toISOString(),
      goodId,
      tipe,
      qty: Number(qty),
      hargaSatuan: Number(hargaSatuan) || 0,
      akunLawanId,
      catatan: catatan || undefined,
    });
    if (!result) {
      toast.error("This item has no inventory account set in Master Data");
      return;
    }
    toast.success("Stock mutation saved");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {fixedTipe === "saldo-awal" ? "Set Opening Stock" : "New Stock Mutation"}
          </DialogTitle>
          <DialogDescription>Adjusts stock and posts to the journal.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="tanggal">Date</Label>
            <Input id="tanggal" type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
          </div>

          <div className="grid gap-1.5">
            <Label>Item</Label>
            <Select value={goodId} onValueChange={(v) => v && handleGoodSelect(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select item" />
              </SelectTrigger>
              <SelectContent>
                {goods.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.nama} (stock: {g.stok ?? 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!fixedTipe && (
            <div className="grid gap-1.5">
              <Label>Direction</Label>
              <Select value={tipe} onValueChange={(v) => v && setTipe(v as StockMutationType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masuk">Masuk (Stock In)</SelectItem>
                  <SelectItem value="keluar">Keluar (Stock Out)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="qty">Quantity</Label>
              <Input id="qty" type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="hargaSatuan">Unit Cost</Label>
              <Input
                id="hargaSatuan"
                type="number"
                min={0}
                value={hargaSatuan}
                onChange={(e) => setHargaSatuan(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>{fixedTipe === "saldo-awal" ? "Equity Account" : "Counter Account"}</Label>
            <Select value={akunLawanId} onValueChange={(v) => v && setAkunLawanId(v)}>
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
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
