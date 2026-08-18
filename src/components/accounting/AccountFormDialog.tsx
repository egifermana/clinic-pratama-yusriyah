"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClinicStore } from "@/lib/store";
import { accountSchema, type AccountFormValues } from "@/lib/validation/account-schema";
import { normalBalanceForType, type Account, type AccountType } from "@/types/accounting/account";

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "aset", label: "Aset" },
  { value: "liabilitas", label: "Liabilitas" },
  { value: "ekuitas", label: "Ekuitas" },
  { value: "pendapatan", label: "Pendapatan" },
  { value: "hpp", label: "HPP" },
  { value: "beban", label: "Beban" },
];

const NO_PARENT = "none";

const DEFAULT_VALUES: AccountFormValues = {
  kode: "",
  nama: "",
  tipe: "aset",
  parentId: undefined,
  isHeader: false,
  aktif: true,
};

interface AccountFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: Account | null;
}

export function AccountFormDialog({ open, onOpenChange, account }: AccountFormDialogProps) {
  const accounts = useClinicStore((s) => s.accounts);
  const addAccount = useClinicStore((s) => s.addAccount);
  const updateAccount = useClinicStore((s) => s.updateAccount);
  const isEdit = Boolean(account);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      account
        ? {
            kode: account.kode,
            nama: account.nama,
            tipe: account.tipe,
            parentId: account.parentId,
            isHeader: account.isHeader,
            aktif: account.aktif,
          }
        : DEFAULT_VALUES
    );
  }, [open, account, reset]);

  const tipe = watch("tipe");
  const parentId = watch("parentId");
  const isHeader = watch("isHeader");
  const aktif = watch("aktif");

  const headerOptions = accounts.filter(
    (a) => a.isHeader && a.tipe === tipe && a.id !== account?.id
  );

  const onSubmit = (values: AccountFormValues) => {
    const payload = {
      ...values,
      parentId: values.parentId,
      saldoNormal: normalBalanceForType(values.tipe),
    };
    if (isEdit && account) {
      updateAccount(account.id, payload);
      toast.success("Account updated successfully");
    } else {
      addAccount(payload);
      toast.success("Account added successfully");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Account" : "Add Account"}</DialogTitle>
          <DialogDescription>Define a chart of accounts entry.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid max-h-[85vh] gap-3 overflow-y-auto overflow-x-hidden pr-1"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="kode">Code</Label>
              <Input id="kode" {...register("kode")} placeholder="1-1100" />
              {errors.kode && <p className="text-xs text-destructive">{errors.kode.message}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label>Type</Label>
              <Select
                value={tipe}
                onValueChange={(v) => v && setValue("tipe", v as AccountType, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="nama">Name</Label>
            <Input id="nama" {...register("nama")} placeholder="Kas" />
            {errors.nama && <p className="text-xs text-destructive">{errors.nama.message}</p>}
          </div>

          <div className="grid gap-1.5">
            <Label>Parent Group (optional)</Label>
            <Select
              value={parentId ?? NO_PARENT}
              onValueChange={(v) =>
                setValue("parentId", v === NO_PARENT ? undefined : (v ?? undefined))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_PARENT}>None (top level)</SelectItem>
                {headerOptions.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.kode} {h.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="grid gap-0.5">
              <Label htmlFor="isHeader">Group header</Label>
              <p className="text-xs text-muted-foreground">
                A subtotal row (e.g. &quot;Aset Lancar&quot;), not directly postable.
              </p>
            </div>
            <Switch
              id="isHeader"
              checked={isHeader}
              onCheckedChange={(v) => setValue("isHeader", v)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <Label htmlFor="aktif">Active</Label>
            <Switch id="aktif" checked={aktif} onCheckedChange={(v) => setValue("aktif", v)} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? "Save Changes" : "Add Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
