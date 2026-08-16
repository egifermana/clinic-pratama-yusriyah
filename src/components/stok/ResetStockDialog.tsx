"use client";

import { toast } from "sonner";
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
import { useClinicStore } from "@/lib/store";

interface ResetStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResetStockDialog({ open, onOpenChange }: ResetStockDialogProps) {
  const resetAllStock = useClinicStore((s) => s.resetAllStock);

  const handleReset = () => {
    resetAllStock();
    toast.success("All product stock quantities have been reset to 0");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset all stock?</AlertDialogTitle>
          <AlertDialogDescription>
            This will set the stock quantity of every product to 0 — useful before a physical
            stock count. Prices, categories, and other product details are not affected. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleReset}>
            Reset All Stock
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
