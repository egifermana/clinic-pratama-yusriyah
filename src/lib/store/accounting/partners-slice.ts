import type { StateCreator } from "zustand";
import type { Partner, PartnerInput } from "@/types/accounting/partner";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import type { StoreState } from "@/lib/store/types";

export interface PartnersSlice {
  partners: Partner[];
  addPartner: (input: PartnerInput) => void;
  updatePartner: (id: string, input: PartnerInput) => void;
  deletePartner: (id: string) => void;
}

export const createPartnersSlice: StateCreator<StoreState, [], [], PartnersSlice> = (
  set
) => ({
  partners: [],
  addPartner: (input) =>
    set((state) => ({
      partners: [
        ...state.partners,
        { ...input, id: generateId(), createdAt: nowIso(), updatedAt: nowIso() },
      ],
    })),
  updatePartner: (id, input) =>
    set((state) => ({
      partners: state.partners.map((p) =>
        p.id === id ? { ...input, id, createdAt: p.createdAt, updatedAt: nowIso() } : p
      ),
    })),
  deletePartner: (id) =>
    set((state) => ({ partners: state.partners.filter((p) => p.id !== id) })),
});
