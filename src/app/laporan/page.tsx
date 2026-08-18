"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NeracaReport } from "@/components/accounting/NeracaReport";
import { NeracaSaldoReport } from "@/components/accounting/NeracaSaldoReport";
import { LabaRugiReport } from "@/components/accounting/LabaRugiReport";
import { BukuBesarReport } from "@/components/accounting/BukuBesarReport";

export default function LaporanPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Tabs defaultValue="neraca">
        <div className="overflow-x-auto">
          <TabsList className="w-max">
            <TabsTrigger value="neraca">Neraca</TabsTrigger>
            <TabsTrigger value="laba-rugi">Laba Rugi</TabsTrigger>
            <TabsTrigger value="neraca-saldo">Neraca Saldo</TabsTrigger>
            <TabsTrigger value="buku-besar">Buku Besar</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="neraca" className="pt-4">
          <NeracaReport />
        </TabsContent>
        <TabsContent value="laba-rugi" className="pt-4">
          <LabaRugiReport />
        </TabsContent>
        <TabsContent value="neraca-saldo" className="pt-4">
          <NeracaSaldoReport />
        </TabsContent>
        <TabsContent value="buku-besar" className="pt-4">
          <BukuBesarReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
