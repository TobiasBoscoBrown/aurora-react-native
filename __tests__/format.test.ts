import { formatUsd, formatPct, seededSeries } from '@/utils/format';

describe('formatting', () => {
  it('formats USD', () => expect(formatUsd(1234.5)).toBe('$1,234.50'));
  it('signs percentages', () => {
    expect(formatPct(2.5)).toBe('+2.50%');
    expect(formatPct(-1)).toBe('-1.00%');
  });
  it('seededSeries is deterministic for a given seed', () => {
    expect(seededSeries(7)).toEqual(seededSeries(7));
    expect(seededSeries(7)).toHaveLength(40);
  });
});
