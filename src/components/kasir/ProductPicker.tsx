"use client";

import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import type { CartItem } from "@/types/transaction";
import type { Product } from "@/types/product";

interface ProductPickerProps {
  cart: CartItem[];
  onAdd: (product: Product) => void;
}

export function ProductPicker({ cart, onAdd }: ProductPickerProps) {
  const products = useClinicStore((s) => s.products);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      products
        .filter((p) => p.nama.toLowerCase().includes(search.trim().toLowerCase()))
        .sort((a, b) => a.nama.localeCompare(b.nama)),
    [products, search]
  );

  const qtyInCart = (id: string) => cart.find((c) => c.productId === id)?.qty ?? 0;

  return (
    <div className="flex flex-col gap-3 md:h-full">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-8"
        />
      </div>

      <div className="grid max-h-[45vh] auto-rows-min grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2 md:max-h-none md:flex-1 xl:grid-cols-3">
        {filtered.map((p) => {
          const remaining = p.jumlahStok - qtyInCart(p.id);
          const disabled = remaining <= 0;
          return (
            <button
              key={p.id}
              type="button"
              disabled={disabled}
              onClick={() => onAdd(p)}
              className="flex flex-col items-start gap-1 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-foreground/20 hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div className="flex w-full items-start justify-between gap-2">
                <p className="text-sm leading-tight font-medium">{p.nama}</p>
                <Plus className="size-4 shrink-0 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">{p.kategori}</p>
              <div className="mt-1 flex w-full items-center justify-between">
                <span className="text-sm font-semibold">{formatCurrency(p.hargaJualStrip)}</span>
                <span className="text-xs text-muted-foreground">{remaining} left</span>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
