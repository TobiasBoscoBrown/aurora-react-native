const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 });

export const formatUsd = (n: number): string => usd.format(n);
export const formatCompact = (n: number): string => '$' + compact.format(n);
export const formatPct = (n: number): string => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

/** Deterministic pseudo-random walk so the demo renders identical sparklines every run. */
export function seededSeries(seed: number, points = 40): number[] {
  let s = seed % 2147483647;
  const next = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const out: number[] = [];
  let v = 100;
  for (let i = 0; i < points; i++) {
    v += (next() - 0.48) * 6;
    out.push(Math.max(1, v));
  }
  return out;
}
