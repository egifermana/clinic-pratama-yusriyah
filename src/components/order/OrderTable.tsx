"use client";

import { toast } from "sonner";
import { MoreHorizontal, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  diterima: "Received",
  dibatalkan: "Cancelled",
};

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium",
        status === "pending" &&
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400",
        status === "diterima" && "border-border bg-secondary text-secondary-foreground",
        status === "dibatalkan" && "border-destructive/20 bg-destructive/10 text-destructive"
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function OrderTable() {
  const orders = useClinicStore((s) => s.orders);
  const updateOrderStatus = useClinicStore((s) => s.updateOrderStatus);

  const handleReceive = (id: string, namaSupplier: string) => {
    const missingItems = updateOrderStatus(id, "diterima");
    if (missingItems.length > 0) {
      toast.warning(
        `Order from ${namaSupplier} marked as received, but stock wasn't updated for ${missingItems.join(", ")} — product no longer exists in Inventory`
      );
    } else {
      toast.success(`Order from ${namaSupplier} marked as received, stock updated`);
    }
  };
  const handleCancel = (id: string) => {
    updateOrderStatus(id, "dibatalkan");
    toast.success("Order cancelled");
  };

  const sorted = [...orders].sort(
    (a, b) => new Date(b.tanggalOrder).getTime() - new Date(a.tanggalOrder).getTime()
  );

  return (
    <div className="rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No orders yet.
              </TableCell>
            </TableRow>
          )}
          {sorted.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.namaSupplier}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(order.tanggalOrder)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {order.items.length} products
              </TableCell>
              <TableCell>{formatCurrency(order.totalBiaya)}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right">
                {order.status === "pending" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleReceive(order.id, order.namaSupplier)}>
                        <CheckCircle2 className="size-4" /> Mark as Received
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => handleCancel(order.id)}>
                        <XCircle className="size-4" /> Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
