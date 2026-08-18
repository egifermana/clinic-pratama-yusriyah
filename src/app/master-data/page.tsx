"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AccountTable } from "@/components/accounting/AccountTable";
import { PartnerTable } from "@/components/accounting/PartnerTable";
import { DimensionTable } from "@/components/accounting/DimensionTable";
import { ProjectTable } from "@/components/accounting/ProjectTable";
import { AssetSection } from "@/components/accounting/AssetSection";
import { GoodTable } from "@/components/accounting/GoodTable";

export default function MasterDataPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Tabs defaultValue="accounts">
        <div className="overflow-x-auto">
          <TabsList className="w-max">
            <TabsTrigger value="accounts">Daftar Akun</TabsTrigger>
            <TabsTrigger value="partners">Mitra Bisnis</TabsTrigger>
            <TabsTrigger value="dimensions">Dimensi</TabsTrigger>
            <TabsTrigger value="projects">Proyek</TabsTrigger>
            <TabsTrigger value="assets">Aset Tetap</TabsTrigger>
            <TabsTrigger value="goods">Barang &amp; Jasa</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="accounts" className="pt-4">
          <AccountTable />
        </TabsContent>
        <TabsContent value="partners" className="pt-4">
          <PartnerTable />
        </TabsContent>
        <TabsContent value="dimensions" className="pt-4">
          <DimensionTable />
        </TabsContent>
        <TabsContent value="projects" className="pt-4">
          <ProjectTable />
        </TabsContent>
        <TabsContent value="assets" className="pt-4">
          <AssetSection />
        </TabsContent>
        <TabsContent value="goods" className="pt-4">
          <GoodTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
