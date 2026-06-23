import { seededSeries } from '@/utils/format';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  sparkline: number[];
}

const BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Thin, typed fetch wrapper with timeout + narrow error surface.
 * In offline/demo mode we fall back to a deterministic fixture so the UI is
 * always demoable without a network or API key.
 */
async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 8000);
  signal?.addEventListener('abort', () => ctrl.abort());
  try {
    const res = await fetch(`${BASE_URL}${path}`, { signal: ctrl.signal });
    if (!res.ok) throw new ApiError(res.status, `CoinGecko ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const SEEDS = ['bitcoin', 'ethereum', 'solana', 'cardano', 'chainlink', 'polygon'];

export async function fetchMarkets(signal?: AbortSignal): Promise<Asset[]> {
  try {
    type Raw = {
      id: string; symbol: string; name: string; current_price: number;
      price_change_percentage_24h: number; market_cap: number; sparkline_in_7d?: { price: number[] };
    };
    const raw = await request<Raw[]>(
      '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&sparkline=true',
      signal,
    );
    return raw.map((r) => ({
      id: r.id, symbol: r.symbol.toUpperCase(), name: r.name, price: r.current_price,
      change24h: r.price_change_percentage_24h ?? 0, marketCap: r.market_cap,
      sparkline: r.sparkline_in_7d?.price ?? [],
    }));
  } catch {
    // Graceful offline fixture — keeps the app fully interactive in demos.
    return SEEDS.map((id, i) => {
      const series = seededSeries(i + 7);
      const price = series[series.length - 1]!;
      const first = series[0]!;
      return {
        id, symbol: id.slice(0, 3).toUpperCase(), name: id[0]!.toUpperCase() + id.slice(1),
        price: price * (i === 0 ? 600 : 30), change24h: ((price - first) / first) * 100,
        marketCap: price * 1e9 * (6 - i), sparkline: series,
      };
    });
  }
}
