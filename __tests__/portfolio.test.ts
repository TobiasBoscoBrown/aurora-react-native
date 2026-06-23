import { selectPortfolioValue, type Holding } from '@/store/portfolio';

describe('selectPortfolioValue', () => {
  const holdings: Record<string, Holding> = {
    bitcoin: { assetId: 'bitcoin', units: 2 },
    ethereum: { assetId: 'ethereum', units: 10 },
  };
  const prices: Record<string, number> = { bitcoin: 60000, ethereum: 3000 };

  it('sums units * live price across holdings', () => {
    expect(selectPortfolioValue(holdings, (id) => prices[id])).toBe(2 * 60000 + 10 * 3000);
  });

  it('treats a missing price as zero rather than NaN', () => {
    expect(selectPortfolioValue({ solana: { assetId: 'solana', units: 5 } }, () => undefined)).toBe(0);
  });

  it('returns 0 for an empty portfolio', () => {
    expect(selectPortfolioValue({}, () => 100)).toBe(0);
  });
});
