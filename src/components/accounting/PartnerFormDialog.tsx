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
import { partnerSchema, type PartnerFormValues } from "@/lib/validation/partner-schema";
import type { Partner, PartnerType } from "@/types/accounting/partner";

const PARTNER_TYPES: { value: PartnerType; label: string }[] = [
  { value: "pelanggan", label: "Pelanggan" },
  { value: "pemasok", label: "Pemasok" },
  { value: "lainnya", label: "Lainnya" },
];

const NO_CATEGORY = "none";

const DEFAULT_VALUES: PartnerFormValues = {
  nama: "",
  tipe: "pelanggan",
  kategoriId: undefined,
  kontak: "",
  alamat: "",
  npwp: "",
};

interface PartnerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner?: Partner | null;
}

export function PartnerFormDialog({ open, onOpenChange, partner }: PartnerFormDialogProps) {
  const partnerCategories = useClinicStore((s) => s.partnerCategories);
  const addPartner = useClinicStore((s) => s.addPartner);
  const updatePartner = useClinicStore((s) => s.updatePartner);
  const isEdit = Boolean(partner);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      partner
        ? {
            nama: partner.nama,
            tipe: partner.tipe,
            kategoriId: partner.kategoriId,
            kontak: partner.kontak ?? "",
            alamat: partner.alamat ?? "",
            npwp: partner.npwp ?? "",
          }
        : DEFAULT_VALUES
    );
  }, [open, partner, reset]);

  const tipe = watch("tipe");
  const kategoriId = watch("kategoriId");

  const onSubmit = (values: PartnerFormValues) => {
    if (isEdit && partner) {
      updatePartner(partner.id, values);
      toast.success("Partner updated successfully");
    } else {
      addPartner(values);
      toast.success("Partner added successfully");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Partner" : "Add Partner"}</DialogTitle>
          <DialogDescription>Customers, suppliers, and other business partners.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid max-h-[85vh] gap-3 overflow-y-auto overflow-x-hidden pr-1"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="nama">Name</Label>
            <Input id="nama" {...register("nama")} placeholder="PT Sumber Sehat" />
            {errors.nama && <p className="text-xs text-destructive">{errors.nama.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Type</Label>
              <Select
                value={tipe}
                onValueChange={(v) => v && setValue("tipe", v as PartnerType, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PARTNER_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Category (optional)</Label>
              <Select
                value={kategoriId ?? NO_CATEGORY}
                onValueChange={(v) =>
                  setValue("kategoriId", v === NO_CATEGORY ? undefined : (v ?? undefined))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CATEGORY}>None</SelectItem>
                  {partnerCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="kontak">Contact (optional)</Label>
            <Input id="kontak" {...register("kontak")} placeholder="021-5551234" />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="alamat">Address (optional)</Label>
            <Input id="alamat" {...register("alamat")} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="npwp">NPWP (optional)</Label>
            <Input id="npwp" {...register("npwp")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? "Save Changes" : "Add Partner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
