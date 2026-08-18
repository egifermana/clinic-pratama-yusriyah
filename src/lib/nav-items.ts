import { LayoutDashboard, Pill, Truck, Receipt, Wallet, Database } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Pill },
  { href: "/orders", label: "Orders", icon: Truck },
  { href: "/pos", label: "POS", icon: Receipt },
  { href: "/finance", label: "Finance", icon: Wallet },
  { href: "/master-data", label: "Master Data", icon: Database },
] as const;
