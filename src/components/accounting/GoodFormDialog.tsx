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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClinicStore } from "@/lib/store";
import { goodSchema, type GoodFormValues } from "@/lib/validation/good-schema";
import type { Good, GoodType } from "@/types/accounting/good";

const DEFAULT_VALUES: GoodFormValues = {
  nama: "",
  tipe: "barang",
  satuan: "",
  hargaBeli: 0,
  hargaJual: 0,
  akunPersediaanId: undefined,
  akunPendapatanId: "",
  akunHppId: undefined,
  stok: 0,
};

interface GoodFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  good?: Good | null;
}

export function GoodFormDialog({ open, onOpenChange, good }: GoodFormDialogProps) {
  const accounts = useClinicStore((s) => s.accounts);
  const addGood = useClinicStore((s) => s.addGood);
  const updateGood = useClinicStore((s) => s.updateGood);
  const isEdit = Boolean(good);

  const postableAccounts = accounts.filter((a) => !a.isHeader && a.aktif);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GoodFormValues>({
    resolver: zodResolver(goodSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      good
        ? {
            nama: good.nama,
            tipe: good.tipe,
            satuan: good.satuan,
            hargaBeli: good.hargaBeli,
            hargaJual: good.hargaJual,
            akunPersediaanId: good.akunPersediaanId,
            akunPendapatanId: good.akunPendapatanId,
            akunHppId: good.akunHppId,
            stok: good.stok ?? 0,
          }
        : DEFAULT_VALUES
    );
  }, [open, good, reset]);

  const tipe = watch("tipe");
  const akunPersediaanId = watch("akunPersediaanId");
  const akunPendapatanId = watch("akunPendapatanId");
  const akunHppId = watch("akunHppId");
  const isBarang = tipe === "barang";

  const onSubmit = (values: GoodFormValues) => {
    const payload = {
      ...values,
      akunPersediaanId: isBarang ? values.akunPersediaanId : undefined,
      akunHppId: isBarang ? values.akunHppId : undefined,
      stok: isBarang ? values.stok ?? 0 : undefined,
    };
    if (isEdit && good) {
      updateGood(good.id, payload);
      toast.success("Item updated successfully");
    } else {
      addGood(payload);
      toast.success("Item added successfully");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Item" : "Add Item"}</DialogTitle>
          <DialogDescription>Goods and services used in Purchases &amp; Sales.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid max-h-[85vh] gap-3 overflow-y-auto overflow-x-hidden pr-1"
        >
          <div className="grid grid-cols-[1fr_140px] gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="nama">Name</Label>
              <Input id="nama" {...register("nama")} placeholder="Paracetamol 500mg" />
              {errors.nama && <p className="text-xs text-destructive">{errors.nama.message}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label>Type</Label>
              <Select
                value={tipe}
                onValueChange={(v) => v && setValue("tipe", v as GoodType, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="barang">Barang</SelectItem>
                  <SelectItem value="jasa">Jasa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="satuan">Unit</Label>
              <Input id="satuan" {...register("satuan")} placeholder="Strip" />
              {errors.satuan && <p className="text-xs text-destructive">{errors.satuan.message}</p>}
            </div>
            {isBarang && (
              <div className="grid gap-1.5">
                <Label htmlFor="stok">Stock</Label>
                <Input id="stok" type="number" min={0} {...register("stok", { valueAsNumber: true })} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="hargaBeli">Buy Price</Label>
              <Input
                id="hargaBeli"
                type="number"
                min={0}
                {...register("hargaBeli", { valueAsNumber: true })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="hargaJual">Sell Price</Label>
              <Input
                id="hargaJual"
                type="number"
                min={0}
                {...register("hargaJual", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-sm font-medium text-foreground">GL Accounts</p>
            {isBarang && (
              <div className="grid gap-1.5">
                <Label className="text-xs">Inventory Account</Label>
                <Select
                  value={akunPersediaanId}
                  onValueChange={(v) => v && setValue("akunPersediaanId", v, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {postableAccounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.kode} {a.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.akunPersediaanId && (
                  <p className="text-xs text-destructive">{errors.akunPersediaanId.message}</p>
                )}
              </div>
            )}
            <div className="grid gap-1.5">
              <Label className="text-xs">Revenue Account</Label>
              <Select
                value={akunPendapatanId}
                onValueChange={(v) => v && setValue("akunPendapatanId", v, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {postableAccounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.kode} {a.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.akunPendapatanId && (
                <p className="text-xs text-destructive">{errors.akunPendapatanId.message}</p>
              )}
            </div>
            {isBarang && (
              <div className="grid gap-1.5">
                <Label className="text-xs">COGS Account</Label>
                <Select
                  value={akunHppId}
                  onValueChange={(v) => v && setValue("akunHppId", v, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {postableAccounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.kode} {a.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.akunHppId && (
                  <p className="text-xs text-destructive">{errors.akunHppId.message}</p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
