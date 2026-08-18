"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { PartnerFormDialog } from "@/components/accounting/PartnerFormDialog";
import { PartnerCategoryPanel } from "@/components/accounting/PartnerCategoryPanel";
import { useClinicStore } from "@/lib/store";
import type { Partner } from "@/types/accounting/partner";

const TYPE_LABEL: Record<Partner["tipe"], string> = {
  pelanggan: "Pelanggan",
  pemasok: "Pemasok",
  lainnya: "Lainnya",
};

export function PartnerTable() {
  const partners = useClinicStore((s) => s.partners);
  const partnerCategories = useClinicStore((s) => s.partnerCategories);
  const deletePartner = useClinicStore((s) => s.deletePartner);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);

  const categoryName = (id?: string) => partnerCategories.find((c) => c.id === id)?.nama;

  const filtered = useMemo(
    () =>
      partners
        .filter((p) => p.nama.toLowerCase().includes(search.trim().toLowerCase()))
        .sort((a, b) => a.nama.localeCompare(b.nama)),
    [partners, search]
  );

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p: Partner) => {
    setEditing(p);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deletePartner(deleteTarget.id);
    toast.success(`${deleteTarget.nama} removed`);
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <PartnerCategoryPanel />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search partner name..."
            className="pl-8"
          />
        </div>
        <Button onClick={openAdd}>Add Partner</Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No partners found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.nama}</TableCell>
                <TableCell>
                  <Badge variant="outline">{TYPE_LABEL[p.tipe]}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {categoryName(p.kategoriId) ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">{p.kontak || "—"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(p)}>
                        <Pencil className="size-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(p)}>
                        <Trash2 className="size-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PartnerFormDialog open={formOpen} onOpenChange={setFormOpen} partner={editing} />

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete partner?</AlertDialogTitle>
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
