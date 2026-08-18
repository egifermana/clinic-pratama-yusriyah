import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { HydrationGate } from "@/components/providers/HydrationGate";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="mx-auto h-full w-full max-w-7xl">
            <HydrationGate>{children}</HydrationGate>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
