"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import type { CartItem } from "@/types/transaction";

interface MobileCartBarProps {
  cart: CartItem[];
  diskon: number;
  onPay: () => void;
}

export function MobileCartBar({ cart, diskon, onPay }: MobileCartBarProps) {
  if (cart.length === 0) return null;

  const subtotal = cart.reduce((sum, i) => sum + i.subtotal, 0);
  const total = Math.max(0, subtotal - diskon);
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="fixed inset-x-0 bottom-16 z-40 border-t border-border bg-card p-3 shadow-lg print:hidden md:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
          <p className="truncate text-base font-semibold">{formatCurrency(total)}</p>
        </div>
        <Button onClick={onPay} className="shrink-0">
          Pay
        </Button>
      </div>
    </div>
  );
}
