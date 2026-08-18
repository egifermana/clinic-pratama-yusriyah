"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PurchaseInvoiceTable } from "@/components/accounting/PurchaseInvoiceTable";
import { SalesInvoiceTable } from "@/components/accounting/SalesInvoiceTable";
import { StockOpnameTable } from "@/components/accounting/StockOpnameTable";
import { StockMutationTable } from "@/components/accounting/StockMutationTable";
import { DaftarTransaksiTable } from "@/components/accounting/DaftarTransaksiTable";

export default function PersediaanPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Tabs defaultValue="pembelian">
        <div className="overflow-x-auto">
          <TabsList className="w-max">
            <TabsTrigger value="pembelian">Pembelian</TabsTrigger>
            <TabsTrigger value="penjualan">Penjualan</TabsTrigger>
            <TabsTrigger value="opname">Stock Opname</TabsTrigger>
            <TabsTrigger value="mutasi">Mutasi Stok</TabsTrigger>
            <TabsTrigger value="saldo-awal">Saldo Awal Stok</TabsTrigger>
            <TabsTrigger value="transaksi">Daftar Transaksi</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pembelian" className="pt-4">
          <PurchaseInvoiceTable />
        </TabsContent>
        <TabsContent value="penjualan" className="pt-4">
          <SalesInvoiceTable />
        </TabsContent>
        <TabsContent value="opname" className="pt-4">
          <StockOpnameTable />
        </TabsContent>
        <TabsContent value="mutasi" className="pt-4">
          <StockMutationTable
            tipes={["masuk", "keluar"]}
            addLabel="New Stock Mutation"
            emptyLabel="No stock mutations yet."
          />
        </TabsContent>
        <TabsContent value="saldo-awal" className="pt-4">
          <StockMutationTable
            tipes={["saldo-awal"]}
            addLabel="Set Opening Stock"
            emptyLabel="No opening stock entries yet."
            fixedTipe="saldo-awal"
          />
        </TabsContent>
        <TabsContent value="transaksi" className="pt-4">
          <DaftarTransaksiTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
