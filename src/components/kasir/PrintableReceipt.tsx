"use client";

import { ReceiptContent } from "@/components/kasir/ReceiptContent";
import type { Transaction } from "@/types/transaction";

export function PrintableReceipt({ transaction }: { transaction: Transaction | null }) {
  if (!transaction) return null;

  return (
    <div className="print-area hidden print:block">
      <ReceiptContent transaction={transaction} />
    </div>
  );
}
