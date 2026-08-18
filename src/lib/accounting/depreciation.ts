import { differenceInMonths } from "date-fns";
import type { FixedAsset } from "@/types/accounting/asset";

export interface DepreciationSummary {
  akumulasiPenyusutan: number;
  nilaiBuku: number;
}

/** Straight-line depreciation based on whole months elapsed since acquisition. */
export function computeDepreciation(asset: FixedAsset): DepreciationSummary {
  const depreciableBase = Math.max(0, asset.hargaPerolehan - asset.nilaiResidu);
  if (asset.masaManfaatBulan <= 0 || depreciableBase === 0) {
    return { akumulasiPenyusutan: 0, nilaiBuku: asset.hargaPerolehan };
  }

  const monthsElapsed = Math.max(
    0,
    Math.min(asset.masaManfaatBulan, differenceInMonths(new Date(), new Date(asset.tanggalPerolehan)))
  );
  const monthlyDepreciation = depreciableBase / asset.masaManfaatBulan;
  const akumulasiPenyusutan = Math.round(monthlyDepreciation * monthsElapsed);

  return {
    akumulasiPenyusutan,
    nilaiBuku: asset.hargaPerolehan - akumulasiPenyusutan,
  };
}
