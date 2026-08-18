"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/date";

interface TxRow {
  key: string;
  tanggal: string;
  jenis: string;
  nomor: string;
  keterangan: string;
  nominal: number;
}

export function DaftarTransaksiTable() {
  const purchaseInvoices = useClinicStore((s) => s.purchaseInvoices);
  const salesInvoices = useClinicStore((s) => s.salesInvoices);
  const stockOpnames = useClinicStore((s) => s.stockOpnames);
  const stockMutations = useClinicStore((s) => s.stockMutations);
  const settlements = useClinicStore((s) => s.settlements);
  const partners = useClinicStore((s) => s.partners);
  const goods = useClinicStore((s) => s.goods);

  const rows = useMemo<TxRow[]>(() => {
    const partnerName = (id: string) => partners.find((p) => p.id === id)?.nama ?? "—";
    const goodName = (id: string) => goods.find((g) => g.id === id)?.nama ?? "—";

    const purchaseRows: TxRow[] = purchaseInvoices.map((i) => ({
      key: i.id,
      tanggal: i.tanggal,
      jenis: "Pembelian",
      nomor: i.nomor,
      keterangan: partnerName(i.partnerId),
      nominal: i.total,
    }));
    const salesRows: TxRow[] = salesInvoices.map((i) => ({
      key: i.id,
      tanggal: i.tanggal,
      jenis: "Penjualan",
      nomor: i.nomor,
      keterangan: partnerName(i.partnerId),
      nominal: i.total,
    }));
    const opnameRows: TxRow[] = stockOpnames.map((o) => ({
      key: o.id,
      tanggal: o.tanggal,
      jenis: "Stock Opname",
      nomor: o.nomor,
      keterangan: o.catatan || `${o.lines.filter((l) => l.stokFisik !== l.stokSistem).length} item disesuaikan`,
      nominal: o.lines.reduce((sum, l) => sum + Math.abs(l.stokFisik - l.stokSistem), 0),
    }));
    const mutationRows: TxRow[] = stockMutations.map((m) => ({
      key: m.id,
      tanggal: m.tanggal,
      jenis: m.tipe === "saldo-awal" ? "Saldo Awal" : m.tipe === "masuk" ? "Mutasi Masuk" : "Mutasi Keluar",
      nomor: m.nomor,
      keterangan: goodName(m.goodId),
      nominal: m.qty * m.hargaSatuan,
    }));
    const settlementRows: TxRow[] = settlements.map((s) => ({
      key: s.id,
      tanggal: s.tanggal,
      jenis: "Pelunasan",
      nomor: s.nomor,
      keterangan: s.jenis === "pembelian" ? "Pelunasan hutang" : "Pelunasan piutang",
      nominal: s.jumlah,
    }));

    return [...purchaseRows, ...salesRows, ...opnameRows, ...mutationRows, ...settlementRows].sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    );
  }, [purchaseInvoices, salesInvoices, stockOpnames, stockMutations, settlements, partners, goods]);

  return (
    <div className="rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No transactions yet.
              </TableCell>
            </TableRow>
          )}
          {rows.map((r) => (
            <TableRow key={r.key}>
              <TableCell className="font-mono text-xs text-muted-foreground">{r.nomor}</TableCell>
              <TableCell className="text-muted-foreground">{formatDate(r.tanggal)}</TableCell>
              <TableCell>
                <Badge variant="outline">{r.jenis}</Badge>
              </TableCell>
              <TableCell className="max-w-56 truncate">{r.keterangan}</TableCell>
              <TableCell className="text-right">{formatCurrency(r.nominal)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
