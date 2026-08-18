"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { generateId } from "@/lib/id";

export interface GoodsLineDraft {
  key: string;
  goodId: string;
  qty: string;
  harga: string;
}

export function emptyGoodsLine(): GoodsLineDraft {
  return { key: generateId(), goodId: "", qty: "1", harga: "0" };
}

export function goodsLinesTotal(lines: GoodsLineDraft[]): number {
  return lines.reduce((sum, l) => sum + (Number(l.qty) || 0) * (Number(l.harga) || 0), 0);
}

interface GoodsLinesEditorProps {
  lines: GoodsLineDraft[];
  onChange: (lines: GoodsLineDraft[]) => void;
  /** "purchase" only lists barang (stock is restocked); "sale" lists barang and jasa. */
  mode: "purchase" | "sale";
  /** Auto-fill the price field from the good's default price when it's selected. */
  autofillPriceField?: "hargaBeli" | "hargaJual";
}

export function GoodsLinesEditor({
  lines,
  onChange,
  mode,
  autofillPriceField,
}: GoodsLinesEditorProps) {
  const goods = useClinicStore((s) => s.goods);
  const options = mode === "purchase" ? goods.filter((g) => g.tipe === "barang") : goods;

  const updateLine = (key: string, patch: Partial<GoodsLineDraft>) => {
    onChange(lines.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  };
  const removeLine = (key: string) => onChange(lines.filter((l) => l.key !== key));
  const addLine = () => onChange([...lines, emptyGoodsLine()]);

  const handleGoodSelect = (key: string, goodId: string) => {
    const good = goods.find((g) => g.id === goodId);
    const patch: Partial<GoodsLineDraft> = { goodId };
    if (good && autofillPriceField) {
      patch.harga = String(autofillPriceField === "hargaBeli" ? good.hargaBeli : good.hargaJual);
    }
    updateLine(key, patch);
  };

  return (
    <div className="flex flex-col gap-2">
      {lines.map((line) => {
        const subtotal = (Number(line.qty) || 0) * (Number(line.harga) || 0);
        return (
          <div key={line.key} className="grid gap-2 rounded-lg border border-border p-2">
            <div className="flex items-center gap-2">
              <Select value={line.goodId} onValueChange={(v) => v && handleGoodSelect(line.key, v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeLine(line.key)}
                aria-label="Remove line"
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
            <div className="grid grid-cols-3 items-center gap-2">
              <Input
                type="number"
                min={1}
                value={line.qty}
                onChange={(e) => updateLine(line.key, { qty: e.target.value })}
                placeholder="Qty"
                className="text-xs sm:text-sm"
              />
              <Input
                type="number"
                min={0}
                value={line.harga}
                onChange={(e) => updateLine(line.key, { harga: e.target.value })}
                placeholder="Price"
                className="text-xs sm:text-sm"
              />
              <span className="truncate text-right text-xs font-medium sm:text-sm">
                {formatCurrency(subtotal)}
              </span>
            </div>
          </div>
        );
      })}

      <Button type="button" variant="outline" size="sm" onClick={addLine}>
        <Plus className="size-4" /> Add Line
      </Button>

      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 text-sm">
        <span className="text-muted-foreground">Total</span>
        <span className="font-semibold">{formatCurrency(goodsLinesTotal(lines))}</span>
      </div>
    </div>
  );
}
