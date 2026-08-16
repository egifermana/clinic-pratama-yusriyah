"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
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
import { useClinicStore } from "@/lib/store";
import { dayKey } from "@/lib/date";
import type { DailyEntry } from "@/types/finance";

const dailyEntrySchema = z.object({
  tanggal: z.string().min(1, "Date is required"),
  opVisits: z.number().int("Must be a whole number").min(0, "Cannot be negative"),
  opRevenue: z.number().min(0, "Cannot be negative"),
  nonOpVisits: z.number().int("Must be a whole number").min(0, "Cannot be negative"),
  nonOpRevenue: z.number().min(0, "Cannot be negative"),
  change: z.number().min(0, "Cannot be negative"),
  pharmacy: z.number().min(0, "Cannot be negative"),
  medicalSupplies: z.number().min(0, "Cannot be negative"),
  utilities: z.number().min(0, "Cannot be negative"),
  salary: z.number().min(0, "Cannot be negative"),
  cleaning: z.number().min(0, "Cannot be negative"),
});
type DailyEntryFormValues = z.infer<typeof dailyEntrySchema>;

interface DailyEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: DailyEntry | null;
}

const todayStr = () => format(new Date(), "yyyy-MM-dd");

const DEFAULT_VALUES: DailyEntryFormValues = {
  tanggal: todayStr(),
  opVisits: 0,
  opRevenue: 0,
  nonOpVisits: 0,
  nonOpRevenue: 0,
  change: 0,
  pharmacy: 0,
  medicalSupplies: 0,
  utilities: 0,
  salary: 0,
  cleaning: 0,
};

const VISIT_FIELDS = [
  { name: "opVisits", label: "OP Visits" },
  { name: "opRevenue", label: "OP Revenue" },
  { name: "nonOpVisits", label: "NOP Visits" },
  { name: "nonOpRevenue", label: "NOP Revenue" },
] as const;

const COST_FIELDS = [
  { name: "change", label: "Change" },
  { name: "pharmacy", label: "Pharmacy" },
  { name: "medicalSupplies", label: "Medstuff" },
  { name: "utilities", label: "Utilities" },
  { name: "salary", label: "Salary" },
  { name: "cleaning", label: "Cleaning Service" },
] as const;

export function DailyEntryDialog({ open, onOpenChange, entry }: DailyEntryDialogProps) {
  const dailyEntries = useClinicStore((s) => s.dailyEntries);
  const addDailyEntry = useClinicStore((s) => s.addDailyEntry);
  const updateDailyEntry = useClinicStore((s) => s.updateDailyEntry);
  const isEdit = Boolean(entry);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DailyEntryFormValues>({
    resolver: zodResolver(dailyEntrySchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      entry
        ? {
            tanggal: format(new Date(entry.tanggal), "yyyy-MM-dd"),
            opVisits: entry.opVisits,
            opRevenue: entry.opRevenue,
            nonOpVisits: entry.nonOpVisits,
            nonOpRevenue: entry.nonOpRevenue,
            change: entry.change,
            pharmacy: entry.pharmacy,
            medicalSupplies: entry.medicalSupplies,
            utilities: entry.utilities,
            salary: entry.salary,
            cleaning: entry.cleaning,
          }
        : DEFAULT_VALUES
    );
  }, [open, entry, reset]);

  const onSubmit = (values: DailyEntryFormValues) => {
    const payload = { ...values, tanggal: new Date(values.tanggal).toISOString() };
    if (isEdit && entry) {
      updateDailyEntry(entry.id, payload);
      toast.success("Transaction updated successfully");
    } else {
      const duplicate = dailyEntries.find((e) => dayKey(e.tanggal) === dayKey(payload.tanggal));
      if (duplicate) {
        toast.error(
          `A transaction for ${format(new Date(payload.tanggal), "d MMM yyyy")} already exists — edit that entry instead to avoid double-counting.`
        );
        return;
      }
      addDailyEntry(payload);
      toast.success("Transaction saved");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          <DialogDescription>
            Record the day&apos;s visits, revenue, and operating costs.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid max-h-[85vh] gap-4 overflow-y-auto overflow-x-hidden pr-1"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="tanggal">Date</Label>
            <div className="flex gap-2">
              <Input id="tanggal" type="date" className="flex-1" {...register("tanggal")} />
              <Button
                type="button"
                variant="outline"
                onClick={() => setValue("tanggal", todayStr())}
              >
                Today
              </Button>
            </div>
            {errors.tanggal && (
              <p className="text-xs text-destructive">{errors.tanggal.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <p className="text-sm font-medium text-foreground">Visits & Revenue</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {VISIT_FIELDS.map((field) => (
                <div key={field.name} className="grid gap-1.5">
                  <Label htmlFor={field.name} className="text-sm">
                    {field.label}
                  </Label>
                  <Input
                    id={field.name}
                    type="number"
                    min={0}
                    {...register(field.name, { valueAsNumber: true })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-sm font-medium text-foreground">Operating Costs</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {COST_FIELDS.map((field) => (
                <div key={field.name} className="grid gap-1.5">
                  <Label htmlFor={field.name} className="text-sm">
                    {field.label}
                  </Label>
                  <Input
                    id={field.name}
                    type="number"
                    min={0}
                    {...register(field.name, { valueAsNumber: true })}
                  />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? "Update Transaction" : "Save Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
