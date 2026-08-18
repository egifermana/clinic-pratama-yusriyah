"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useClinicStore } from "@/lib/store";

export function DimensionTable() {
  const dimensions = useClinicStore((s) => s.dimensions);
  const addDimension = useClinicStore((s) => s.addDimension);
  const deleteDimension = useClinicStore((s) => s.deleteDimension);
  const [nama, setNama] = useState("");

  const handleAdd = () => {
    const trimmed = nama.trim();
    if (!trimmed) return;
    addDimension({ nama: trimmed });
    setNama("");
    toast.success("Dimension added");
  };

  const sorted = [...dimensions].sort((a, b) => a.nama.localeCompare(b.nama));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 sm:w-80">
        <Input
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Dimension name, e.g. Cabang Utara"
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
        />
        <Button type="button" onClick={handleAdd}>
          Add
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                  No dimensions yet.
                </TableCell>
              </TableRow>
            )}
            {sorted.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.nama}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      deleteDimension(d.id);
                      toast.success("Dimension deleted");
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
