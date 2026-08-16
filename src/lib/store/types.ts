import type { ProductsSlice } from "@/lib/store/products-slice";
import type { SuppliersSlice } from "@/lib/store/suppliers-slice";
import type { OrdersSlice } from "@/lib/store/orders-slice";
import type { TransactionsSlice } from "@/lib/store/transactions-slice";
import type { DailyEntriesSlice } from "@/lib/store/daily-entries-slice";
import type { MetaSlice } from "@/lib/store/meta-slice";

export type StoreState = ProductsSlice &
  SuppliersSlice &
  OrdersSlice &
  TransactionsSlice &
  DailyEntriesSlice &
  MetaSlice;
