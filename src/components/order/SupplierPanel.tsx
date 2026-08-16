"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupplierDialog } from "@/components/order/SupplierDialog";
import { useClinicStore } from "@/lib/store";

export function SupplierPanel() {
  const suppliers = useClinicStore((s) => s.suppliers);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Suppliers</p>
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          <Plus className="size-3.5" /> Add Supplier
        </Button>
      </div>
      {suppliers.length === 0 ? (
        <p className="text-xs text-muted-foreground">No suppliers yet.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {suppliers.map((s) => (
            <span
              key={s.id}
              className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
            >
              {s.nama}
            </span>
          ))}
        </div>
      )}
      <SupplierDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
