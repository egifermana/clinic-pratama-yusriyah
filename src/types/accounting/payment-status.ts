export type PaymentStatus = "belum-lunas" | "sebagian" | "lunas";

export function paymentStatus(total: number, dibayar: number): PaymentStatus {
  if (dibayar <= 0) return "belum-lunas";
  if (dibayar >= total) return "lunas";
  return "sebagian";
}
