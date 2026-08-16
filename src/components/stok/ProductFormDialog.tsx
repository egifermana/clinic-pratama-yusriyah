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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClinicStore } from "@/lib/store";
import { productSchema, type ProductFormValues } from "@/lib/validation/product-schema";
import { PRODUCT_CATEGORIES, type Product } from "@/types/product";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

const DEFAULT_VALUES: ProductFormValues = {
  nama: "",
  kategori: "",
  satuan: "",
  satuanBesar: "",
  isiPerBox: 1,
  jumlahStok: 0,
  stokMinimum: 10,
  hargaCogsBox: 0,
  hargaCogsStrip: 0,
  hargaJualBox: 0,
  hargaJualStrip: 0,
  hargaHetBox: 0,
  hargaHetStrip: 0,
  tanggalKadaluarsa: "",
};

const PRICE_TIERS = [
  { title: "COGS", boxField: "hargaCogsBox", stripField: "hargaCogsStrip" },
  { title: "Sell", boxField: "hargaJualBox", stripField: "hargaJualStrip" },
  { title: "HET", boxField: "hargaHetBox", stripField: "hargaHetStrip" },
] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-foreground">{children}</p>;
}

export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const addProduct = useClinicStore((s) => s.addProduct);
  const updateProduct = useClinicStore((s) => s.updateProduct);
  const isEdit = Boolean(product);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      product
        ? {
            nama: product.nama,
            kategori: product.kategori,
            satuan: product.satuan,
            satuanBesar: product.satuanBesar,
            isiPerBox: product.isiPerBox,
            jumlahStok: product.jumlahStok,
            stokMinimum: product.stokMinimum,
            hargaCogsBox: product.hargaCogsBox,
            hargaCogsStrip: product.hargaCogsStrip,
            hargaJualBox: product.hargaJualBox,
            hargaJualStrip: product.hargaJualStrip,
            hargaHetBox: product.hargaHetBox,
            hargaHetStrip: product.hargaHetStrip,
            tanggalKadaluarsa: product.tanggalKadaluarsa ?? "",
          }
        : DEFAULT_VALUES
    );
  }, [open, product, reset]);

  const kategori = watch("kategori");
  const satuan = watch("satuan");
  const satuanKecilLabel = satuan.trim() || "Unit";

  const handleBoxPriceChange = (
    stripField: (typeof PRICE_TIERS)[number]["stripField"],
    value: string
  ) => {
    // Only auto-fill for new products — for an existing product the strip
    // price may have been deliberately set to something non-proportional,
    // and silently overwriting it on every keystroke would destroy that.
    if (isEdit) return;
    const isiPerBox = Number(watch("isiPerBox"));
    const boxPrice = Number(value);
    if (isiPerBox > 0 && !Number.isNaN(boxPrice)) {
      setValue(stripField, Math.round(boxPrice / isiPerBox));
    }
  };

  const onSubmit = (values: ProductFormValues) => {
    const payload = { ...values, tanggalKadaluarsa: values.tanggalKadaluarsa || undefined };
    if (isEdit && product) {
      updateProduct(product.id, payload);
      toast.success("Product updated successfully");
    } else {
      addProduct(payload);
      toast.success("Product added successfully");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogDescription>Fill in the medicine or medical equipment details.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid max-h-[85vh] gap-4 overflow-y-auto overflow-x-hidden pr-1"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
            <div className="grid gap-1.5">
              <Label htmlFor="nama">Product Name</Label>
              <Input id="nama" {...register("nama")} placeholder="Paracetamol 500mg" />
              {errors.nama && <p className="text-xs text-destructive">{errors.nama.message}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label>Category</Label>
              <Select
                value={kategori}
                onValueChange={(v) => v && setValue("kategori", v, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.kategori && (
                <p className="text-xs text-destructive">{errors.kategori.message}</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid gap-3">
            <SectionLabel>Packaging & Stock</SectionLabel>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div className="grid gap-1.5">
                <Label htmlFor="satuan">Unit</Label>
                <Input id="satuan" {...register("satuan")} placeholder="Strip" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="satuanBesar">Box Unit</Label>
                <Input id="satuanBesar" {...register("satuanBesar")} placeholder="Box" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="isiPerBox">Units/Box</Label>
                <Input
                  id="isiPerBox"
                  type="number"
                  min={1}
                  {...register("isiPerBox", { valueAsNumber: true })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="jumlahStok">Stock</Label>
                <Input
                  id="jumlahStok"
                  type="number"
                  min={0}
                  {...register("jumlahStok", { valueAsNumber: true })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="stokMinimum">Min. Stock</Label>
                <Input
                  id="stokMinimum"
                  type="number"
                  min={0}
                  {...register("stokMinimum", { valueAsNumber: true })}
                />
              </div>
            </div>
            {(errors.satuan || errors.satuanBesar || errors.isiPerBox) && (
              <p className="text-xs text-destructive">
                {errors.satuan?.message || errors.satuanBesar?.message || errors.isiPerBox?.message}
              </p>
            )}
          </div>

          <Separator />

          <div className="grid gap-3">
            <SectionLabel>Pricing</SectionLabel>
            <div className="grid grid-cols-[44px_repeat(3,minmax(0,1fr))] items-center gap-x-2 gap-y-2 sm:grid-cols-[64px_repeat(3,minmax(0,1fr))] sm:gap-x-3">
              <div />
              {PRICE_TIERS.map((tier) => (
                <p
                  key={tier.title}
                  className="truncate text-center text-xs font-medium text-muted-foreground sm:text-sm"
                >
                  {tier.title}
                </p>
              ))}

              <Label className="text-xs sm:text-sm">Box</Label>
              {PRICE_TIERS.map((tier) => (
                <Input
                  key={tier.boxField}
                  type="number"
                  min={0}
                  className="px-1.5 text-xs sm:px-2.5 sm:text-sm"
                  {...register(tier.boxField, {
                    valueAsNumber: true,
                    onChange: (e) => handleBoxPriceChange(tier.stripField, e.target.value),
                  })}
                />
              ))}

              <Label className="truncate text-xs sm:text-sm">{satuanKecilLabel}</Label>
              {PRICE_TIERS.map((tier) => (
                <Input
                  key={tier.stripField}
                  type="number"
                  min={0}
                  className="px-1.5 text-xs sm:px-2.5 sm:text-sm"
                  {...register(tier.stripField, { valueAsNumber: true })}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="tanggalKadaluarsa">Expiry Date (optional)</Label>
            <Input id="tanggalKadaluarsa" type="date" className="sm:w-1/2" {...register("tanggalKadaluarsa")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
