import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const mmkv = new MMKV({ id: 'aurora.portfolio' });

/** Zustand persistence adapter backed by MMKV (synchronous, fast, encrypted-capable). */
const storage = createJSONStorage(() => ({
  getItem: (k) => mmkv.getString(k) ?? null,
  setItem: (k, v) => mmkv.set(k, v),
  removeItem: (k) => mmkv.delete(k),
}));

export interface Holding { assetId: string; units: number }

interface PortfolioState {
  holdings: Record<string, Holding>;
  watchlist: string[];
  addHolding: (assetId: string, units: number) => void;
  toggleWatch: (assetId: string) => void;
  reset: () => void;
}

export const usePortfolio = create<PortfolioState>()(
  persist(
    (set) => ({
      holdings: { bitcoin: { assetId: 'bitcoin', units: 0.85 }, ethereum: { assetId: 'ethereum', units: 6.2 } },
      watchlist: ['solana', 'chainlink'],
      addHolding: (assetId, units) =>
        set((s) => ({ holdings: { ...s.holdings, [assetId]: { assetId, units } } })),
      toggleWatch: (assetId) =>
        set((s) => ({
          watchlist: s.watchlist.includes(assetId)
            ? s.watchlist.filter((w) => w !== assetId)
            : [...s.watchlist, assetId],
        })),
      reset: () => set({ holdings: {}, watchlist: [] }),
    }),
    { name: 'portfolio-v1', storage },
  ),
);

/** Pure selector — derives total portfolio value from holdings + live prices. */
export function selectPortfolioValue(
  holdings: Record<string, Holding>,
  priceOf: (id: string) => number | undefined,
): number {
  return Object.values(holdings).reduce((sum, h) => sum + h.units * (priceOf(h.assetId) ?? 0), 0);
}
