"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/currency";
import type { CartItem } from "@/types/transaction";

interface CartPanelProps {
  cart: CartItem[];
  diskon: number;
  onDiskonChange: (value: number) => void;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

export function CartPanel({
  cart,
  diskon,
  onDiskonChange,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
}: CartPanelProps) {
  const subtotal = cart.reduce((sum, i) => sum + i.subtotal, 0);
  const total = Math.max(0, subtotal - diskon);

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card md:h-full md:min-h-0">
      <div className="border-b border-border p-3">
        <p className="text-sm font-semibold">Cart</p>
      </div>

      <div className="max-h-[30vh] overflow-y-auto p-3 md:max-h-none md:flex-1">
        {cart.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No products selected yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {cart.map((item) => (
              <div key={item.productId} className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.namaProduk}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(item.hargaJualSatuan)} x {item.qty}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-xs"
                    onClick={() => onDecrement(item.productId)}
                  >
                    <Minus className="size-3" />
                  </Button>
                  <span className="w-5 text-center text-sm">{item.qty}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-xs"
                    onClick={() => onIncrement(item.productId)}
                  >
                    <Plus className="size-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onRemove(item.productId)}
                  >
                    <Trash2 className="size-3 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-border p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-2 text-sm">
          <Label htmlFor="diskon" className="text-muted-foreground">
            Discount
          </Label>
          <Input
            id="diskon"
            type="number"
            min={0}
            value={diskon}
            onChange={(e) => onDiskonChange(Math.max(0, Number(e.target.value) || 0))}
            className="h-7 w-28 text-right"
          />
        </div>
        <div className="hidden items-center justify-between text-base font-semibold md:flex">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <Button
          className="mt-1 hidden w-full md:flex"
          disabled={cart.length === 0}
          onClick={onCheckout}
        >
          Pay
        </Button>
      </div>
    </div>
  );
}
