"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Pencil, PackagePlus, Trash2, Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/stok/StatusBadge";
import { ProductFormDialog } from "@/components/stok/ProductFormDialog";
import { StockAdjustDialog } from "@/components/stok/StockAdjustDialog";
import { DeleteProductDialog } from "@/components/stok/DeleteProductDialog";
import { ResetStockDialog } from "@/components/stok/ResetStockDialog";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { PRODUCT_CATEGORIES, type Product } from "@/types/product";
import { cn } from "@/lib/utils";

function PriceCell({
  box,
  strip,
  unit,
  emphasis,
}: {
  box: number;
  strip: number;
  unit: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1.5 whitespace-nowrap">
      <span className={cn(emphasis && "font-semibold")}>{formatCurrency(box)}</span>
      <span className="text-xs text-muted-foreground">
        / {formatCurrency(strip)} per {unit || "unit"}
      </span>
    </div>
  );
}

export function ProductTable() {
  const products = useClinicStore((s) => s.products);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjusting, setAdjusting] = useState<Product | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  const filtered = useMemo(() => {
    return products
      .filter((p) => (category === "All" ? true : p.kategori === category))
      .filter((p) => p.nama.toLowerCase().includes(search.trim().toLowerCase()))
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [products, search, category]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setFormOpen(true);
  };
  const openAdjust = (p: Product) => {
    setAdjusting(p);
    setAdjustOpen(true);
  };
  const openDelete = (p: Product) => {
    setDeleting(p);
    setDeleteOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product name..."
              className="pl-8"
            />
          </div>
          <Select value={category} onValueChange={(v) => setCategory(v ?? "All")}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {PRODUCT_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setResetOpen(true)}>
            <RotateCcw className="size-4" /> Reset All Stock
          </Button>
          <Button onClick={openAdd}>Add Product</Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Sell</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.nama}</TableCell>
                <TableCell className="text-muted-foreground">{p.kategori}</TableCell>
                <TableCell>
                  {p.jumlahStok} {p.satuan}
                </TableCell>
                <TableCell>
                  <PriceCell
                    box={p.hargaJualBox}
                    strip={p.hargaJualStrip}
                    unit={p.satuan}
                    emphasis
                  />
                </TableCell>
                <TableCell>
                  <StatusBadge jumlahStok={p.jumlahStok} stokMinimum={p.stokMinimum} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(p)}>
                        <Pencil className="size-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openAdjust(p)}>
                        <PackagePlus className="size-4" /> Adjust Stock
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => openDelete(p)}>
                        <Trash2 className="size-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductFormDialog open={formOpen} onOpenChange={setFormOpen} product={editing} />
      <StockAdjustDialog open={adjustOpen} onOpenChange={setAdjustOpen} product={adjusting} />
      <DeleteProductDialog open={deleteOpen} onOpenChange={setDeleteOpen} product={deleting} />
      <ResetStockDialog open={resetOpen} onOpenChange={setResetOpen} />
    </div>
  );
}
