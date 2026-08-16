import { cn } from "@/lib/utils";
import { computeStockStatus, STOCK_STATUS_LABEL } from "@/lib/stock-status";

export function StatusBadge({
  jumlahStok,
  stokMinimum,
}: {
  jumlahStok: number;
  stokMinimum: number;
}) {
  const status = computeStockStatus(jumlahStok, stokMinimum);

  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        status === "aman" && "border-border bg-secondary text-secondary-foreground",
        status === "menipis" &&
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400",
        status === "habis" && "border-destructive/20 bg-destructive/10 text-destructive"
      )}
    >
      {STOCK_STATUS_LABEL[status]}
    </span>
  );
}
