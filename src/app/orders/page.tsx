"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupplierPanel } from "@/components/order/SupplierPanel";
import { OrderTable } from "@/components/order/OrderTable";
import { OrderFormDialog } from "@/components/order/OrderFormDialog";
import { PrintableOrderList } from "@/components/order/PrintableOrderList";

export default function OrderObatPage() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 p-4 print:hidden md:p-6">
        <SupplierPanel />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold">Order List</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" /> Print Order List
            </Button>
            <Button onClick={() => setFormOpen(true)}>Create Order</Button>
          </div>
        </div>
        <OrderTable />
        <OrderFormDialog open={formOpen} onOpenChange={setFormOpen} />
      </div>
      <PrintableOrderList />
    </>
  );
}
