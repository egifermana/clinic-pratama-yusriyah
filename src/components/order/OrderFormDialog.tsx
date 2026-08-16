"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import type { OrderItem } from "@/types/order";

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderFormDialog({ open, onOpenChange }: OrderFormDialogProps) {
  const suppliers = useClinicStore((s) => s.suppliers);
  const products = useClinicStore((s) => s.products);
  const addOrder = useClinicStore((s) => s.addOrder);

  const [supplierId, setSupplierId] = useState("");
  const [catatan, setCatatan] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);

  const [draftProductId, setDraftProductId] = useState("");
  const [draftQty, setDraftQty] = useState("1");
  const [draftHarga, setDraftHarga] = useState("0");
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setSupplierId(suppliers[0]?.id ?? "");
      setCatatan("");
      setItems([]);
      setDraftProductId("");
      setDraftQty("1");
      setDraftHarga("0");
    }
  }

  const handleProductSelect = (productId: string) => {
    setDraftProductId(productId);
    const product = products.find((p) => p.id === productId);
    if (product) setDraftHarga(String(product.hargaCogsStrip));
  };

  const handleAddItem = () => {
    const product = products.find((p) => p.id === draftProductId);
    if (!product) {
      toast.error("Select a product first");
      return;
    }
    const qty = Math.max(1, Math.floor(Number(draftQty) || 0));
    const hargaSatuan = Math.max(0, Number(draftHarga) || 0);

    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: i.qty + qty, hargaSatuan } : i
        );
      }
      return [...prev, { productId: product.id, namaProduk: product.nama, qty, hargaSatuan }];
    });
    setDraftProductId("");
    setDraftQty("1");
    setDraftHarga("0");
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const total = items.reduce((sum, i) => sum + i.qty * i.hargaSatuan, 0);

  const handleSubmit = () => {
    if (!supplierId) {
      toast.error("Select a supplier first");
      return;
    }
    if (items.length === 0) {
      toast.error("Add at least one item");
      return;
    }
    addOrder({ supplierId, items, catatan: catatan || undefined });
    toast.success("Order created successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
          <DialogDescription>Order medicine stock from a supplier.</DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[85vh] gap-3 overflow-y-auto overflow-x-hidden pr-1">
          <div className="grid gap-1.5">
            <Label>Supplier</Label>
            {suppliers.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No suppliers yet. Add a supplier first.
              </p>
            ) : (
              <Select value={supplierId} onValueChange={(v) => v && setSupplierId(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="rounded-lg border border-border p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Add Item</p>
            <div className="grid grid-cols-2 items-end gap-2 sm:grid-cols-[1fr_70px_100px_auto]">
              <div className="col-span-2 grid gap-1 sm:col-span-1">
                <Label className="text-xs">Product</Label>
                <Select value={draftProductId} onValueChange={(v) => v && handleProductSelect(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Qty</Label>
                <Input
                  type="number"
                  min={1}
                  value={draftQty}
                  onChange={(e) => setDraftQty(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Price/unit</Label>
                <Input
                  type="number"
                  min={0}
                  value={draftHarga}
                  onChange={(e) => setDraftHarga(e.target.value)}
                />
              </div>
              <Button type="button" size="sm" className="col-span-2 sm:col-span-1" onClick={handleAddItem}>
                Add
              </Button>
            </div>
          </div>

          {items.length > 0 && (
            <div className="flex flex-col gap-1.5 rounded-lg border border-border p-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="min-w-0 flex-1 truncate">{item.namaProduk}</span>
                  <span className="text-muted-foreground">
                    {item.qty} x {formatCurrency(item.hargaSatuan)}
                  </span>
                  <span className="w-24 text-right font-medium">
                    {formatCurrency(item.qty * item.hargaSatuan)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="size-3 text-destructive" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-border pt-1.5 text-sm font-semibold">
                <span>Total Cost</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          <div className="grid gap-1.5">
            <Label htmlFor="catatan">Notes (optional)</Label>
            <Textarea
              id="catatan"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Create Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
