"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { JournalTemplateFormDialog } from "@/components/accounting/JournalTemplateFormDialog";
import { useClinicStore } from "@/lib/store";
import type { JournalTemplate } from "@/types/accounting/journal";

export function JournalTemplateTable() {
  const journalTemplates = useClinicStore((s) => s.journalTemplates);
  const deleteJournalTemplate = useClinicStore((s) => s.deleteJournalTemplate);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<JournalTemplate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JournalTemplate | null>(null);

  const sorted = [...journalTemplates].sort((a, b) => a.nama.localeCompare(b.nama));

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (t: JournalTemplate) => {
    setEditing(t);
    setFormOpen(true);
  };
  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteJournalTemplate(deleteTarget.id);
    toast.success(`${deleteTarget.nama} removed`);
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={openAdd}>Add Template</Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Memo</TableHead>
              <TableHead>Lines</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No templates yet.
                </TableCell>
              </TableRow>
            )}
            {sorted.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.nama}</TableCell>
                <TableCell className="text-muted-foreground">{t.memo || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{t.lines.length}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(t)}>
                        <Pencil className="size-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(t)}>
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

      <JournalTemplateFormDialog open={formOpen} onOpenChange={setFormOpen} template={editing} />

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete template?</AlertDialogTitle>
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
