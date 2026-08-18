"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AssetTypeTable } from "@/components/accounting/AssetTypeTable";
import { FixedAssetTable } from "@/components/accounting/FixedAssetTable";

export function AssetSection() {
  return (
    <Tabs defaultValue="fixed-assets">
      <TabsList>
        <TabsTrigger value="fixed-assets">Aset Tetap</TabsTrigger>
        <TabsTrigger value="asset-types">Jenis Aset</TabsTrigger>
      </TabsList>
      <TabsContent value="fixed-assets" className="pt-4">
        <FixedAssetTable />
      </TabsContent>
      <TabsContent value="asset-types" className="pt-4">
        <AssetTypeTable />
      </TabsContent>
    </Tabs>
  );
}
