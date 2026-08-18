"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useClinicStore } from "@/lib/store";

export function AssetTypeTable() {
  const assetTypes = useClinicStore((s) => s.assetTypes);
  const fixedAssets = useClinicStore((s) => s.fixedAssets);
  const addAssetType = useClinicStore((s) => s.addAssetType);
  const deleteAssetType = useClinicStore((s) => s.deleteAssetType);
  const [nama, setNama] = useState("");
  const [masaManfaatBulan, setMasaManfaatBulan] = useState("48");

  const handleAdd = () => {
    const trimmedNama = nama.trim();
    const months = Math.max(1, Math.floor(Number(masaManfaatBulan) || 0));
    if (!trimmedNama) return;
    addAssetType({ nama: trimmedNama, masaManfaatBulan: months, metodePenyusutan: "garis-lurus" });
    setNama("");
    setMasaManfaatBulan("48");
    toast.success("Asset type added");
  };

  const handleDelete = (id: string) => {
    if (fixedAssets.some((a) => a.jenisAsetId === id)) {
      toast.error("Asset type is still used by one or more fixed assets");
      return;
    }
    deleteAssetType(id);
  };

  const sorted = [...assetTypes].sort((a, b) => a.nama.localeCompare(b.nama));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[1fr_140px_auto] items-end gap-2 sm:max-w-lg">
        <div className="grid gap-1">
          <Label className="text-xs">Name</Label>
          <Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Kendaraan" />
        </div>
        <div className="grid gap-1">
          <Label className="text-xs">Useful life (months)</Label>
          <Input
            type="number"
            min={1}
            value={masaManfaatBulan}
            onChange={(e) => setMasaManfaatBulan(e.target.value)}
          />
        </div>
        <Button type="button" onClick={handleAdd}>
          Add
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Useful Life</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No asset types yet.
                </TableCell>
              </TableRow>
            )}
            {sorted.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.nama}</TableCell>
                <TableCell className="text-muted-foreground">{t.masaManfaatBulan} months</TableCell>
                <TableCell className="text-muted-foreground">Garis Lurus</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(t.id)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
