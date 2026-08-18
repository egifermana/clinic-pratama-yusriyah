import type { ProductsSlice } from "@/lib/store/products-slice";
import type { SuppliersSlice } from "@/lib/store/suppliers-slice";
import type { OrdersSlice } from "@/lib/store/orders-slice";
import type { TransactionsSlice } from "@/lib/store/transactions-slice";
import type { DailyEntriesSlice } from "@/lib/store/daily-entries-slice";
import type { MetaSlice } from "@/lib/store/meta-slice";
import type { AccountsSlice } from "@/lib/store/accounting/accounts-slice";
import type { PartnerCategoriesSlice } from "@/lib/store/accounting/partner-categories-slice";
import type { PartnersSlice } from "@/lib/store/accounting/partners-slice";
import type { DimensionsSlice } from "@/lib/store/accounting/dimensions-slice";
import type { ProjectsSlice } from "@/lib/store/accounting/projects-slice";
import type { AssetTypesSlice } from "@/lib/store/accounting/asset-types-slice";
import type { FixedAssetsSlice } from "@/lib/store/accounting/fixed-assets-slice";
import type { GoodsSlice } from "@/lib/store/accounting/goods-slice";
import type { JournalEntriesSlice } from "@/lib/store/accounting/journal-entries-slice";
import type { JournalTemplatesSlice } from "@/lib/store/accounting/journal-templates-slice";
import type { PurchaseInvoicesSlice } from "@/lib/store/accounting/purchase-invoices-slice";
import type { SalesInvoicesSlice } from "@/lib/store/accounting/sales-invoices-slice";
import type { SettlementsSlice } from "@/lib/store/accounting/settlements-slice";
import type { StockOpnamesSlice } from "@/lib/store/accounting/stock-opnames-slice";
import type { StockMutationsSlice } from "@/lib/store/accounting/stock-mutations-slice";

export type StoreState = ProductsSlice &
  SuppliersSlice &
  OrdersSlice &
  TransactionsSlice &
  DailyEntriesSlice &
  MetaSlice &
  AccountsSlice &
  PartnerCategoriesSlice &
  PartnersSlice &
  DimensionsSlice &
  ProjectsSlice &
  AssetTypesSlice &
  FixedAssetsSlice &
  GoodsSlice &
  JournalEntriesSlice &
  JournalTemplatesSlice &
  PurchaseInvoicesSlice &
  SalesInvoicesSlice &
  SettlementsSlice &
  StockOpnamesSlice &
  StockMutationsSlice;
