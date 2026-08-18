"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AccountFormDialog } from "@/components/accounting/AccountFormDialog";
import { useClinicStore } from "@/lib/store";
import { loadStarterAccounts } from "@/lib/accounting/starter-accounts";
import type { Account } from "@/types/accounting/account";

export function AccountTable() {
  const accounts = useClinicStore((s) => s.accounts);
  const addAccount = useClinicStore((s) => s.addAccount);
  const updateAccount = useClinicStore((s) => s.updateAccount);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);

  const sorted = useMemo(() => [...accounts].sort((a, b) => a.kode.localeCompare(b.kode)), [accounts]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (a: Account) => {
    setEditing(a);
    setFormOpen(true);
  };
  const toggleActive = (a: Account) => {
    updateAccount(a.id, { aktif: !a.aktif });
    toast.success(a.aktif ? "Account deactivated" : "Account activated");
  };

  const handleLoadStarter = () => {
    loadStarterAccounts(addAccount);
    toast.success("Starter chart of accounts loaded");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button onClick={openAdd}>Add Account</Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <p>No accounts yet.</p>
                    <Button variant="outline" size="sm" onClick={handleLoadStarter}>
                      <Sparkles className="size-4" /> Load starter chart of accounts
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {sorted.map((a) => (
              <TableRow key={a.id} className={!a.aktif ? "opacity-50" : undefined}>
                <TableCell className="font-mono text-xs text-muted-foreground">{a.kode}</TableCell>
                <TableCell className={a.isHeader ? "font-semibold" : "pl-6"}>{a.nama}</TableCell>
                <TableCell className="text-muted-foreground capitalize">{a.tipe}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {a.isHeader && <Badge variant="outline">Header</Badge>}
                    {!a.aktif && <Badge variant="secondary">Inactive</Badge>}
                  </div>
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
                      <DropdownMenuItem onClick={() => toggleActive(a)}>
                        {a.aktif ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AccountFormDialog open={formOpen} onOpenChange={setFormOpen} account={editing} />
    </div>
  );
}
