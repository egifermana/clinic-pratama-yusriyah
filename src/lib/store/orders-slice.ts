import type { StateCreator } from "zustand";
import type { OrderStatus, PurchaseOrder, PurchaseOrderInput } from "@/types/order";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import type { StoreState } from "@/lib/store/types";

export interface OrdersSlice {
  orders: PurchaseOrder[];
  addOrder: (input: PurchaseOrderInput) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

export const createOrdersSlice: StateCreator<StoreState, [], [], OrdersSlice> = (
  set,
  get
) => ({
  orders: [],
  addOrder: (input) => {
    const supplier = get().suppliers.find((s) => s.id === input.supplierId);
    if (!supplier) return;
    const totalBiaya = input.items.reduce((sum, item) => sum + item.qty * item.hargaSatuan, 0);
    const order: PurchaseOrder = {
      id: generateId(),
      supplierId: supplier.id,
      namaSupplier: supplier.nama,
      items: input.items,
      status: "pending",
      tanggalOrder: nowIso(),
      totalBiaya,
      catatan: input.catatan,
    };
    set((state) => ({ orders: [...state.orders, order] }));
  },
  updateOrderStatus: (id, status) => {
    const order = get().orders.find((o) => o.id === id);
    if (!order || order.status === status) return;

    if (status === "diterima" && order.status !== "diterima") {
      for (const item of order.items) {
        get().adjustStock(item.productId, item.qty);
      }
    }

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? { ...o, status, tanggalDiterima: status === "diterima" ? nowIso() : o.tanggalDiterima }
          : o
      ),
    }));
  },
});
