"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { FixedAssetFormDialog } from "@/components/accounting/FixedAssetFormDialog";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import { computeDepreciation } from "@/lib/accounting/depreciation";
import type { FixedAsset, FixedAssetStatus } from "@/types/accounting/asset";

const STATUS_LABEL: Record<FixedAssetStatus, string> = {
  aktif: "Aktif",
  dijual: "Dijual",
  dihapusbukukan: "Dihapusbukukan",
};

export function FixedAssetTable() {
  const fixedAssets = useClinicStore((s) => s.fixedAssets);
  const assetTypes = useClinicStore((s) => s.assetTypes);
  const deleteFixedAsset = useClinicStore((s) => s.deleteFixedAsset);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FixedAsset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FixedAsset | null>(null);

  const typeName = (id: string) => assetTypes.find((t) => t.id === id)?.nama ?? "—";

  const sorted = [...fixedAssets].sort((a, b) => a.nama.localeCompare(b.nama));

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (a: FixedAsset) => {
    setEditing(a);
    setFormOpen(true);
  };
  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteFixedAsset(deleteTarget.id);
    toast.success(`${deleteTarget.nama} removed`);
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={openAdd}>Add Fixed Asset</Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Acquired</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Acc. Depreciation</TableHead>
              <TableHead>Book Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No fixed assets yet.
                </TableCell>
              </TableRow>
            )}
            {sorted.map((a) => {
              const { akumulasiPenyusutan, nilaiBuku } = computeDepreciation(a);
              return (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.nama}</TableCell>
                  <TableCell className="text-muted-foreground">{typeName(a.jenisAsetId)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(a.tanggalPerolehan)}
                  </TableCell>
                  <TableCell>{formatCurrency(a.hargaPerolehan)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatCurrency(akumulasiPenyusutan)}
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(nilaiBuku)}</TableCell>
                  <TableCell>
                    <Badge variant={a.status === "aktif" ? "outline" : "secondary"}>
                      {STATUS_LABEL[a.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(a)}>
                          <Pencil className="size-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(a)}>
                          <Trash2 className="size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <FixedAssetFormDialog open={formOpen} onOpenChange={setFormOpen} asset={editing} />

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete fixed asset?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove &quot;{deleteTarget?.nama}&quot;. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
