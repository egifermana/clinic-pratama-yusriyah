/** Generates the next sequential document number, e.g. "PB-000001". */
export function nextSequentialNomor(existing: string[], prefix: string): string {
  const maxSeq = existing.reduce((max, nomor) => {
    const seq = Number.parseInt(nomor.replace(`${prefix}-`, ""), 10);
    return Number.isFinite(seq) && seq > max ? seq : max;
  }, 0);
  return `${prefix}-${String(maxSeq + 1).padStart(6, "0")}`;
}
