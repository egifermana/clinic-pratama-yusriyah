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
import { useClinicStore } from "@/lib/store";
import type { Product } from "@/types/product";

interface StockAdjustDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function StockAdjustDialog({ open, onOpenChange, product }: StockAdjustDialogProps) {
  const adjustStock = useClinicStore((s) => s.adjustStock);
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState("0");
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setMode("add");
      setAmount("0");
    }
  }

  if (!product) return null;

  const parsed = Math.max(0, Math.floor(Number(amount) || 0));
  const resultStock =
    mode === "add" ? product.jumlahStok + parsed : Math.max(0, product.jumlahStok - parsed);

  const handleSubmit = () => {
    if (parsed === 0) {
      onOpenChange(false);
      return;
    }
    adjustStock(product.id, mode === "add" ? parsed : -parsed);
    toast.success(`Stock for ${product.nama} adjusted successfully`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogDescription>
            {product.nama} — current stock {product.jumlahStok} {product.satuan}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={mode === "add" ? "default" : "outline"}
              onClick={() => setMode("add")}
            >
              Add Stock
            </Button>
            <Button
              type="button"
              variant={mode === "remove" ? "default" : "outline"}
              onClick={() => setMode("remove")}
            >
              Remove Stock
            </Button>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="amount">Quantity</Label>
            <Input
              id="amount"
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Stock after adjustment:{" "}
            <span className="font-medium text-foreground">
              {resultStock} {product.satuan}
            </span>
          </p>
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
