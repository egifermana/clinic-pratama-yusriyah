"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { formatDateTime } from "@/lib/date";
import { ReceiptContent } from "@/components/kasir/ReceiptContent";
import {
  PAYMENT_METHODS,
  type CartItem,
  type PaymentMethod,
  type Transaction,
} from "@/types/transaction";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  diskon: number;
  onSuccess: (transaction: Transaction) => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  cart,
  diskon,
  onSuccess,
}: PaymentDialogProps) {
  const addTransaction = useClinicStore((s) => s.addTransaction);
  const [metode, setMetode] = useState<PaymentMethod>("tunai");
  const [uangDibayar, setUangDibayar] = useState("0");
  const [completed, setCompleted] = useState<Transaction | null>(null);
  const [prevOpen, setPrevOpen] = useState(open);

  const subtotal = cart.reduce((sum, i) => sum + i.subtotal, 0);
  const total = Math.max(0, subtotal - diskon);
  const uang = Number(uangDibayar) || 0;
  const kembalian = Math.max(0, uang - total);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setMetode("tunai");
      setUangDibayar(String(total));
      setCompleted(null);
    }
  }

  const handleConfirm = () => {
    if (metode === "tunai" && uang < total) {
      toast.error("Amount paid is less than the total due");
      return;
    }
    const transaction = addTransaction({
      items: cart,
      diskon,
      metodePembayaran: metode,
      uangDibayar: metode === "tunai" ? uang : undefined,
    });
    if (transaction) {
      setCompleted(transaction);
      toast.success("Payment successful");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    if (completed) {
      onSuccess(completed);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-sm">
        {!completed ? (
          <>
            <DialogHeader>
              <DialogTitle>Payment</DialogTitle>
              <DialogDescription>Total due {formatCurrency(total)}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label>Payment Method</Label>
                <Select
                  value={metode}
                  onValueChange={(v) => v && setMetode(v as PaymentMethod)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {metode === "tunai" && (
                <div className="grid gap-1.5">
                  <Label htmlFor="uangDibayar">Amount Paid</Label>
                  <Input
                    id="uangDibayar"
                    type="number"
                    min={0}
                    value={uangDibayar}
                    onChange={(e) => setUangDibayar(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Change:{" "}
                    <span className="font-medium text-foreground">
                      {formatCurrency(kembalian)}
                    </span>
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleConfirm}>
                Confirm Payment
              </Button>
            </DialogFooter>
          </>
        ) : (
          <ReceiptView transaction={completed} onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ReceiptView({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Payment Receipt</DialogTitle>
        <DialogDescription>{formatDateTime(transaction.timestamp)}</DialogDescription>
      </DialogHeader>
      <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden pr-1">
        <ReceiptContent transaction={transaction} />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => window.print()}>
          <Printer className="size-4" /> Print Receipt
        </Button>
        <Button type="button" onClick={onClose}>
          Done
        </Button>
      </DialogFooter>
    </>
  );
}
