import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { StoreHydration } from "@/components/providers/StoreHydration";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Klinik Pratama Yusriyah",
  description: "Inventory, POS, and finance management system for Klinik Pratama Yusriyah",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <StoreHydration />
          <AppShell>{children}</AppShell>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
