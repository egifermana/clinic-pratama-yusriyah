"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav-items";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { DataMenu } from "@/components/layout/DataMenu";
import { FullscreenToggle } from "@/components/layout/FullscreenToggle";

export function TopBar() {
  const pathname = usePathname();

  return (
    <header className="shrink-0 border-b border-border bg-card print:hidden">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 md:px-6">
        <nav className="hidden flex-1 items-center gap-1 overflow-x-auto md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-1 shrink-0 items-center justify-end gap-2 md:flex-none">
          <p className="hidden text-sm text-muted-foreground lg:block">
            {format(new Date(), "EEEE, d MMMM yyyy", { locale: enUS })}
          </p>
          <DataMenu />
          <FullscreenToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
