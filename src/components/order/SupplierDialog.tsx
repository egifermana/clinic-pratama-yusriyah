"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
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
import { useClinicStore } from "@/lib/store";

const supplierSchema = z.object({
  nama: z.string().trim().min(2, "Supplier name must be at least 2 characters"),
  kontak: z.string().trim().optional(),
  alamat: z.string().trim().optional(),
});
type SupplierFormValues = z.infer<typeof supplierSchema>;

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupplierDialog({ open, onOpenChange }: SupplierDialogProps) {
  const addSupplier = useClinicStore((s) => s.addSupplier);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: { nama: "", kontak: "", alamat: "" },
  });

  useEffect(() => {
    if (open) reset({ nama: "", kontak: "", alamat: "" });
  }, [open, reset]);

  const onSubmit = (values: SupplierFormValues) => {
    addSupplier(values);
    toast.success("Supplier added successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Supplier</DialogTitle>
          <DialogDescription>Supplier details for medicine orders.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="nama">Supplier Name</Label>
            <Input id="nama" {...register("nama")} placeholder="PBF Anugerah Pharma" />
            {errors.nama && <p className="text-xs text-destructive">{errors.nama.message}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="kontak">Contact (optional)</Label>
            <Input id="kontak" {...register("kontak")} placeholder="021-xxxxxxx" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="alamat">Address (optional)</Label>
            <Input id="alamat" {...register("alamat")} placeholder="Jakarta" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
