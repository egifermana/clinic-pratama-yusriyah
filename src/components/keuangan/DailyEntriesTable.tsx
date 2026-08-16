"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
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
import { DailyEntryDialog } from "@/components/keuangan/DailyEntryDialog";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { formatDate, isWithinDateRange } from "@/lib/date";
import type { DailyEntry } from "@/types/finance";

export function DailyEntriesTable({ start, end }: { start: Date; end: Date }) {
  const dailyEntries = useClinicStore((s) => s.dailyEntries);
  const deleteDailyEntry = useClinicStore((s) => s.deleteDailyEntry);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<DailyEntry | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<DailyEntry | null>(null);

  const filtered = dailyEntries
    .filter((e) => isWithinDateRange(e.tanggal, start, end))
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const openEdit = (entry: DailyEntry) => {
    setEditing(entry);
    setEditOpen(true);
  };
  const openDelete = (entry: DailyEntry) => {
    setDeleting(entry);
    setDeleteOpen(true);
  };
  const handleDelete = () => {
    if (!deleting) return;
    deleteDailyEntry(deleting.id);
    toast.success("Transaction deleted");
    setDeleteOpen(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">OP</TableHead>
            <TableHead className="text-right">NOP</TableHead>
            <TableHead className="text-right">Total Visits</TableHead>
            <TableHead className="text-right">OP Rev</TableHead>
            <TableHead className="text-right">NOP Rev</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="text-right">Pharmacy</TableHead>
            <TableHead className="text-right">Medstuff</TableHead>
            <TableHead className="text-right">Utilities</TableHead>
            <TableHead className="text-right">Salary</TableHead>
            <TableHead className="text-right">Cleaning</TableHead>
            <TableHead className="text-right">Net</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={15} className="h-24 text-center text-muted-foreground">
                No transactions in this period.
              </TableCell>
            </TableRow>
          )}
          {filtered.map((e) => {
            const revenue = e.opRevenue + e.nonOpRevenue;
            const expenses = e.change + e.pharmacy + e.medicalSupplies + e.utilities + e.salary + e.cleaning;
            const net = revenue - expenses;
            return (
              <TableRow key={e.id}>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(e.tanggal)}
                </TableCell>
                <TableCell className="text-right">{e.opVisits}</TableCell>
                <TableCell className="text-right">{e.nonOpVisits}</TableCell>
                <TableCell className="text-right">{e.opVisits + e.nonOpVisits}</TableCell>
                <TableCell className="text-right">{formatCurrency(e.opRevenue)}</TableCell>
                <TableCell className="text-right">{formatCurrency(e.nonOpRevenue)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(revenue)}</TableCell>
                <TableCell className="text-right">{formatCurrency(e.change)}</TableCell>
                <TableCell className="text-right">{formatCurrency(e.pharmacy)}</TableCell>
                <TableCell className="text-right">{formatCurrency(e.medicalSupplies)}</TableCell>
                <TableCell className="text-right">{formatCurrency(e.utilities)}</TableCell>
                <TableCell className="text-right">{formatCurrency(e.salary)}</TableCell>
                <TableCell className="text-right">{formatCurrency(e.cleaning)}</TableCell>
                <TableCell
                  className={`text-right font-semibold ${net < 0 ? "text-destructive" : ""}`}
                >
                  {formatCurrency(net)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(e)}>
                        <Pencil className="size-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => openDelete(e)}>
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

      <DailyEntryDialog open={editOpen} onOpenChange={setEditOpen} entry={editing} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? `The entry dated ${formatDate(deleting.tanggal)} will be permanently removed. This action cannot be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
