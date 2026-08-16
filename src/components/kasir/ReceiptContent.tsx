import { formatCurrency } from "@/lib/currency";
import { formatDateTime } from "@/lib/date";
import type { Transaction } from "@/types/transaction";

export function ReceiptContent({ transaction }: { transaction: Transaction }) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div>
        <p className="font-semibold">Klinik Pratama Yusriyah</p>
        <p className="text-xs text-muted-foreground">{formatDateTime(transaction.timestamp)}</p>
      </div>
      <div className="flex flex-col gap-1 border-b border-dashed border-border pb-2">
        {transaction.items.map((item) => (
          <div key={item.productId} className="flex justify-between gap-2">
            <span className="text-muted-foreground">
              {item.namaProduk} x{item.qty}
            </span>
            <span>{formatCurrency(item.subtotal)}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span>{formatCurrency(transaction.subtotal)}</span>
      </div>
      {transaction.diskon > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Discount</span>
          <span>-{formatCurrency(transaction.diskon)}</span>
        </div>
      )}
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>{formatCurrency(transaction.total)}</span>
      </div>
      {transaction.metodePembayaran === "tunai" && (
        <>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Paid</span>
            <span>{formatCurrency(transaction.uangDibayar ?? 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Change</span>
            <span>{formatCurrency(transaction.kembalian ?? 0)}</span>
          </div>
        </>
      )}
    </div>
  );
}
