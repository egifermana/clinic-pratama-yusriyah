import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  tone?: "default" | "warning" | "destructive";
}

export function KpiCard({ label, value, icon: Icon, tone = "default" }: KpiCardProps) {
  return (
    <Card>
      <CardContent className={cn("flex items-center", Icon && "gap-3")}>
        {Icon && (
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              tone === "default" && "bg-muted text-foreground",
              tone === "warning" && "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
              tone === "destructive" && "bg-destructive/10 text-destructive"
            )}
          >
            <Icon className="size-4" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-xs uppercase text-muted-foreground">{label}</p>
          <p
            className={cn(
              "truncate text-lg font-semibold",
              !Icon && tone === "warning" && "text-amber-700 dark:text-amber-400",
              !Icon && tone === "destructive" && "text-destructive"
            )}
          >
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
