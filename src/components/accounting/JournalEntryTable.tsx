"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { JournalEntryFormDialog } from "@/components/accounting/JournalEntryFormDialog";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import type { JournalEntry } from "@/types/accounting/journal";

export function JournalEntryTable() {
  const journalEntries = useClinicStore((s) => s.journalEntries);
  const accounts = useClinicStore((s) => s.accounts);
  const deleteJournalEntry = useClinicStore((s) => s.deleteJournalEntry);

  const [formOpen, setFormOpen] = useState(false);
  const [viewing, setViewing] = useState<JournalEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JournalEntry | null>(null);

  const accountLabel = (id: string) => {
    const a = accounts.find((acc) => acc.id === id);
    return a ? `${a.kode} ${a.nama}` : "—";
  };

  const sorted = [...journalEntries].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteJournalEntry(deleteTarget.id);
    toast.success(`${deleteTarget.nomor} deleted`);
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setFormOpen(true)}>Add Journal Entry</Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Memo</TableHead>
              <TableHead>Lines</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No journal entries yet.
                </TableCell>
              </TableRow>
            )}
            {sorted.map((e) => {
              const total = e.lines.reduce((sum, l) => sum + l.debit, 0);
              return (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {e.nomor}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(e.tanggal)}</TableCell>
                  <TableCell className="max-w-48 truncate">{e.memo || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{e.lines.length}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(total)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewing(e)}>
                          <Eye className="size-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(e)}>
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

      <JournalEntryFormDialog open={formOpen} onOpenChange={setFormOpen} />

      <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewing?.nomor}</DialogTitle>
            <DialogDescription>
              {viewing ? formatDate(viewing.tanggal) : ""} {viewing?.memo ? `— ${viewing.memo}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Memo</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Kredit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewing?.lines.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{accountLabel(l.accountId)}</TableCell>
                    <TableCell className="text-muted-foreground">{l.memo || "—"}</TableCell>
                    <TableCell className="text-right">
                      {l.debit ? formatCurrency(l.debit) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {l.kredit ? formatCurrency(l.kredit) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete journal entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove &quot;{deleteTarget?.nomor}&quot;. This cannot be undone.
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
