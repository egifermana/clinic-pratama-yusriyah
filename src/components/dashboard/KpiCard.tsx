import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  tone?: "default" | "warning" | "destructive";
}

export function KpiCard({ label, value, tone = "default" }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="min-w-0">
        <p className="truncate text-xs uppercase text-muted-foreground">{label}</p>
        <p
          className={cn(
            "truncate text-lg font-semibold",
            tone === "warning" && "text-amber-700 dark:text-amber-400",
            tone === "destructive" && "text-destructive"
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
