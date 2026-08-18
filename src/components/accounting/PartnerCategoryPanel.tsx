"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClinicStore } from "@/lib/store";

export function PartnerCategoryPanel() {
  const partnerCategories = useClinicStore((s) => s.partnerCategories);
  const partners = useClinicStore((s) => s.partners);
  const addPartnerCategory = useClinicStore((s) => s.addPartnerCategory);
  const deletePartnerCategory = useClinicStore((s) => s.deletePartnerCategory);
  const [nama, setNama] = useState("");

  const handleAdd = () => {
    const trimmed = nama.trim();
    if (!trimmed) return;
    addPartnerCategory({ nama: trimmed });
    setNama("");
  };

  const handleDelete = (id: string) => {
    if (partners.some((p) => p.kategoriId === id)) {
      toast.error("Category is still used by one or more partners");
      return;
    }
    deletePartnerCategory(id);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="mb-2 text-sm font-medium text-foreground">Kategori Mitra</p>
      <div className="flex gap-2">
        <Input
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Category name"
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
        />
        <Button type="button" size="sm" onClick={handleAdd}>
          Add
        </Button>
      </div>
      {partnerCategories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {partnerCategories.map((c) => (
            <span
              key={c.id}
              className="flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs"
            >
              {c.nama}
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Delete ${c.nama}`}
              >
                <Trash2 className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
