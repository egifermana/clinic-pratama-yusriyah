"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
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
import { fixedAssetSchema, type FixedAssetFormValues } from "@/lib/validation/asset-schema";
import type { FixedAsset, FixedAssetStatus } from "@/types/accounting/asset";

const todayStr = () => format(new Date(), "yyyy-MM-dd");

const DEFAULT_VALUES: FixedAssetFormValues = {
  nama: "",
  jenisAsetId: "",
  tanggalPerolehan: todayStr(),
  hargaPerolehan: 0,
  nilaiResidu: 0,
  masaManfaatBulan: 48,
  akunAsetId: "",
  akunAkumPenyusutanId: "",
  akunBebanPenyusutanId: "",
  status: "aktif",
};

interface FixedAssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: FixedAsset | null;
}

export function FixedAssetFormDialog({ open, onOpenChange, asset }: FixedAssetFormDialogProps) {
  const assetTypes = useClinicStore((s) => s.assetTypes);
  const accounts = useClinicStore((s) => s.accounts);
  const addFixedAsset = useClinicStore((s) => s.addFixedAsset);
  const updateFixedAsset = useClinicStore((s) => s.updateFixedAsset);
  const isEdit = Boolean(asset);

  const postableAccounts = accounts.filter((a) => !a.isHeader && a.aktif);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FixedAssetFormValues>({
    resolver: zodResolver(fixedAssetSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      asset
        ? {
            nama: asset.nama,
            jenisAsetId: asset.jenisAsetId,
            tanggalPerolehan: format(new Date(asset.tanggalPerolehan), "yyyy-MM-dd"),
            hargaPerolehan: asset.hargaPerolehan,
            nilaiResidu: asset.nilaiResidu,
            masaManfaatBulan: asset.masaManfaatBulan,
            akunAsetId: asset.akunAsetId,
            akunAkumPenyusutanId: asset.akunAkumPenyusutanId,
            akunBebanPenyusutanId: asset.akunBebanPenyusutanId,
            status: asset.status,
          }
        : DEFAULT_VALUES
    );
  }, [open, asset, reset]);

  const jenisAsetId = watch("jenisAsetId");
  const akunAsetId = watch("akunAsetId");
  const akunAkumPenyusutanId = watch("akunAkumPenyusutanId");
  const akunBebanPenyusutanId = watch("akunBebanPenyusutanId");
  const status = watch("status");

  const handleAssetTypeSelect = (id: string) => {
    setValue("jenisAsetId", id, { shouldValidate: true });
    const type = assetTypes.find((t) => t.id === id);
    if (type && !isEdit) setValue("masaManfaatBulan", type.masaManfaatBulan);
  };

  const onSubmit = (values: FixedAssetFormValues) => {
    const payload = { ...values, tanggalPerolehan: new Date(values.tanggalPerolehan).toISOString() };
    if (isEdit && asset) {
      updateFixedAsset(asset.id, payload);
      toast.success("Fixed asset updated successfully");
    } else {
      addFixedAsset(payload);
      toast.success("Fixed asset added successfully");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Fixed Asset" : "Add Fixed Asset"}</DialogTitle>
          <DialogDescription>Register a fixed asset and its depreciation setup.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid max-h-[85vh] gap-3 overflow-y-auto overflow-x-hidden pr-1"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="nama">Name</Label>
            <Input id="nama" {...register("nama")} placeholder="Mobil Ambulance" />
            {errors.nama && <p className="text-xs text-destructive">{errors.nama.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Asset Type</Label>
              <Select value={jenisAsetId} onValueChange={(v) => v && handleAssetTypeSelect(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.jenisAsetId && (
                <p className="text-xs text-destructive">{errors.jenisAsetId.message}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="tanggalPerolehan">Acquisition Date</Label>
              <Input id="tanggalPerolehan" type="date" {...register("tanggalPerolehan")} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="hargaPerolehan">Cost</Label>
              <Input
                id="hargaPerolehan"
                type="number"
                min={0}
                {...register("hargaPerolehan", { valueAsNumber: true })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="nilaiResidu">Salvage Value</Label>
              <Input
                id="nilaiResidu"
                type="number"
                min={0}
                {...register("nilaiResidu", { valueAsNumber: true })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="masaManfaatBulan">Useful Life (mo.)</Label>
              <Input
                id="masaManfaatBulan"
                type="number"
                min={1}
                {...register("masaManfaatBulan", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-sm font-medium text-foreground">GL Accounts</p>
            <div className="grid gap-1.5">
              <Label className="text-xs">Asset Account</Label>
              <Select
                value={akunAsetId}
                onValueChange={(v) => v && setValue("akunAsetId", v, { shouldValidate: true })}
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
              {errors.akunAsetId && (
                <p className="text-xs text-destructive">{errors.akunAsetId.message}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Accumulated Depreciation Account</Label>
              <Select
                value={akunAkumPenyusutanId}
                onValueChange={(v) =>
                  v && setValue("akunAkumPenyusutanId", v, { shouldValidate: true })
                }
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
              {errors.akunAkumPenyusutanId && (
                <p className="text-xs text-destructive">{errors.akunAkumPenyusutanId.message}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Depreciation Expense Account</Label>
              <Select
                value={akunBebanPenyusutanId}
                onValueChange={(v) =>
                  v && setValue("akunBebanPenyusutanId", v, { shouldValidate: true })
                }
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
              {errors.akunBebanPenyusutanId && (
                <p className="text-xs text-destructive">{errors.akunBebanPenyusutanId.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => v && setValue("status", v as FixedAssetStatus, { shouldValidate: true })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="dijual">Dijual</SelectItem>
                <SelectItem value="dihapusbukukan">Dihapusbukukan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? "Save Changes" : "Add Fixed Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
