"use client";

import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { formatDate, formatDateTime, nowIso } from "@/lib/date";
import type { OrderStatus } from "@/types/order";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  diterima: "Received",
  dibatalkan: "Cancelled",
};

export function PrintableOrderList() {
  const orders = useClinicStore((s) => s.orders);
  const sorted = [...orders].sort(
    (a, b) => new Date(b.tanggalOrder).getTime() - new Date(a.tanggalOrder).getTime()
  );

  return (
    <div className="print-area hidden text-black print:block">
      <div className="mb-4">
        <h1 className="text-lg font-semibold">Klinik Pratama Yusriyah</h1>
        <p className="text-xs text-gray-600">
          Medicine Order List — printed {formatDateTime(nowIso())}
        </p>
      </div>
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b border-gray-400 text-left">
            <th className="py-1 pr-2">Supplier</th>
            <th className="py-1 pr-2">Date</th>
            <th className="py-1 pr-2">Items</th>
            <th className="py-1 pr-2">Total Cost</th>
            <th className="py-1 pr-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 && (
            <tr>
              <td colSpan={5} className="py-4 text-center text-gray-500">
                No orders yet.
              </td>
            </tr>
          )}
          {sorted.map((order) => (
            <tr key={order.id} className="border-b border-gray-200 align-top">
              <td className="py-1 pr-2">{order.namaSupplier}</td>
              <td className="py-1 pr-2">{formatDate(order.tanggalOrder)}</td>
              <td className="py-1 pr-2">
                {order.items.map((i) => `${i.namaProduk} x${i.qty}`).join(", ")}
              </td>
              <td className="py-1 pr-2">{formatCurrency(order.totalBiaya)}</td>
              <td className="py-1 pr-2">{STATUS_LABEL[order.status]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
