import { endOfMonth, format, subMonths } from "date-fns";
import { enUS } from "date-fns/locale";
import type { Account } from "@/types/accounting/account";
import type { JournalEntry } from "@/types/accounting/journal";

/**
 * Balance per account, in that account's own normal-balance sign (positive =
 * the "normal" side), for journal entries on or before `asOf` — and, if
 * `since` is given, on or after it too (for a period activity total instead
 * of a cumulative-since-inception one, e.g. an income statement).
 * Header accounts get 0 here — see rollUpBalances for their subtotal.
 */
export function computeAccountBalances(
  journalEntries: JournalEntry[],
  accounts: Account[],
  asOf: Date,
  since?: Date
): Map<string, number> {
  const accountById = new Map(accounts.map((a) => [a.id, a]));
  const balances = new Map<string, number>(accounts.map((a) => [a.id, 0]));

  for (const entry of journalEntries) {
    const tanggal = new Date(entry.tanggal);
    if (tanggal > asOf) continue;
    if (since && tanggal < since) continue;
    for (const line of entry.lines) {
      const account = accountById.get(line.accountId);
      if (!account) continue;
      const delta =
        account.saldoNormal === "debit" ? line.debit - line.kredit : line.kredit - line.debit;
      balances.set(account.id, (balances.get(account.id) ?? 0) + delta);
    }
  }
  return balances;
}

/** Adds header-account subtotals (sum of all descendant leaf balances) to a balance map. */
export function rollUpBalances(accounts: Account[], leafBalances: Map<string, number>): Map<string, number> {
  const result = new Map(leafBalances);
  const childrenOf = new Map<string, Account[]>();
  for (const a of accounts) {
    if (a.parentId) childrenOf.set(a.parentId, [...(childrenOf.get(a.parentId) ?? []), a]);
  }

  function sumFor(accountId: string): number {
    const account = accounts.find((a) => a.id === accountId);
    if (!account?.isHeader) return leafBalances.get(accountId) ?? 0;
    const children = childrenOf.get(accountId) ?? [];
    return children.reduce((sum, c) => sum + sumFor(c.id), 0);
  }

  for (const a of accounts) {
    if (a.isHeader) result.set(a.id, sumFor(a.id));
  }
  return result;
}

export interface PeriodColumn {
  label: string;
  asOf: Date;
}

/** The last `count` month-end dates, oldest first (e.g. Jun, Jul, Aug). */
export function monthEndColumns(count: number): PeriodColumn[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const monthsAgo = count - 1 - i;
    const asOf = endOfMonth(subMonths(now, monthsAgo));
    return { label: format(asOf, "MMM yyyy", { locale: enUS }), asOf };
  });
}

export function percentChange(from: number, to: number): number | null {
  if (from === 0) return null;
  return ((to - from) / Math.abs(from)) * 100;
}

export interface AccountRow {
  account: Account;
  depth: number;
}

/** Depth-first account order (each header immediately followed by its children), sorted by kode within each level. */
export function orderedAccountRows(accounts: Account[]): AccountRow[] {
  const byParent = new Map<string | undefined, Account[]>();
  for (const a of accounts) {
    const list = byParent.get(a.parentId) ?? [];
    list.push(a);
    byParent.set(a.parentId, list);
  }
  for (const list of byParent.values()) list.sort((a, b) => a.kode.localeCompare(b.kode));

  const rows: AccountRow[] = [];
  function walk(parentId: string | undefined, depth: number) {
    for (const a of byParent.get(parentId) ?? []) {
      rows.push({ account: a, depth });
      walk(a.id, depth + 1);
    }
  }
  walk(undefined, 0);
  return rows;
}
