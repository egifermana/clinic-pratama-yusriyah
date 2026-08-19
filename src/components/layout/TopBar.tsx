"use client";

import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { DataMenu } from "@/components/layout/DataMenu";
import { FullscreenToggle } from "@/components/layout/FullscreenToggle";

export function TopBar() {
  return (
    <header className="shrink-0 border-b border-border bg-card print:hidden">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-end gap-2 px-4 md:px-6">
        <p className="hidden text-sm text-muted-foreground lg:block">
          {format(new Date(), "EEEE, d MMMM yyyy", { locale: enUS })}
        </p>
        <DataMenu />
        <FullscreenToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
