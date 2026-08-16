"use client";

import { useEffect } from "react";
import { useClinicStore } from "@/lib/store";

export function StoreHydration() {
  useEffect(() => {
    (async () => {
      await useClinicStore.persist.rehydrate();
      useClinicStore.getState().seedIfEmpty();
    })();
  }, []);

  return null;
}
