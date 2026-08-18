import type { StateCreator } from "zustand";
import type { Account, AccountInput } from "@/types/accounting/account";
import { generateId } from "@/lib/id";
import { nowIso } from "@/lib/date";
import type { StoreState } from "@/lib/store/types";

export interface AccountsSlice {
  accounts: Account[];
  addAccount: (input: AccountInput) => Account;
  updateAccount: (id: string, input: Partial<AccountInput>) => void;
}

export const createAccountsSlice: StateCreator<StoreState, [], [], AccountsSlice> = (
  set
) => ({
  accounts: [],
  addAccount: (input) => {
    const account: Account = {
      ...input,
      id: generateId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    set((state) => ({ accounts: [...state.accounts, account] }));
    return account;
  },
  updateAccount: (id, input) =>
    set((state) => ({
      accounts: state.accounts.map((a) =>
        a.id === id ? { ...a, ...input, updatedAt: nowIso() } : a
      ),
    })),
});
