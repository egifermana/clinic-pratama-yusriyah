"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ProductPicker } from "@/components/kasir/ProductPicker";
import { CartPanel } from "@/components/kasir/CartPanel";
import { PaymentDialog } from "@/components/kasir/PaymentDialog";
import { PrintableReceipt } from "@/components/kasir/PrintableReceipt";
import { MobileCartBar } from "@/components/kasir/MobileCartBar";
import { useClinicStore } from "@/lib/store";
import type { CartItem, Transaction } from "@/types/transaction";
import type { Product } from "@/types/product";

export default function KasirPage() {
  const products = useClinicStore((s) => s.products);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [diskon, setDiskon] = useState(0);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product.id);
      if (existing) {
        if (existing.qty >= product.jumlahStok) {
          toast.error("Not enough stock");
          return prev;
        }
        return prev.map((c) =>
          c.productId === product.id
            ? { ...c, qty: c.qty + 1, subtotal: (c.qty + 1) * c.hargaJualSatuan }
            : c
        );
      }
      if (product.jumlahStok <= 0) {
        toast.error("Out of stock");
        return prev;
      }
      return [
        ...prev,
        {
          productId: product.id,
          namaProduk: product.nama,
          qty: 1,
          hargaJualSatuan: product.hargaJualStrip,
          hargaCogsSatuan: product.hargaCogsStrip,
          subtotal: product.hargaJualStrip,
        },
      ];
    });
  };

  const increment = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setCart((prev) =>
      prev.map((c) => {
        if (c.productId !== productId) return c;
        if (product && c.qty >= product.jumlahStok) {
          toast.error("Not enough stock");
          return c;
        }
        return { ...c, qty: c.qty + 1, subtotal: (c.qty + 1) * c.hargaJualSatuan };
      })
    );
  };

  const decrement = (productId: string) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.productId === productId
            ? { ...c, qty: c.qty - 1, subtotal: (c.qty - 1) * c.hargaJualSatuan }
            : c
        )
        .filter((c) => c.qty > 0)
    );
  };

  const remove = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  };

  const handleSuccess = (transaction: Transaction) => {
    setCart([]);
    setDiskon(0);
    setLastTransaction(transaction);
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-4 pb-24 print:hidden md:grid md:h-full md:grid-cols-[1fr_320px] md:p-6">
        <ProductPicker cart={cart} onAdd={addToCart} />
        <CartPanel
          cart={cart}
          diskon={diskon}
          onDiskonChange={setDiskon}
          onIncrement={increment}
          onDecrement={decrement}
          onRemove={remove}
          onCheckout={() => setPaymentOpen(true)}
        />
        <PaymentDialog
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          cart={cart}
          diskon={diskon}
          onSuccess={handleSuccess}
        />
      </div>
      <MobileCartBar cart={cart} diskon={diskon} onPay={() => setPaymentOpen(true)} />
      <PrintableReceipt transaction={lastTransaction} />
    </>
  );
}
