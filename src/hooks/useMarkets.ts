import { useQuery } from '@tanstack/react-query';
import { fetchMarkets, type Asset } from '@/api/coingecko';

export const marketKeys = {
  all: ['markets'] as const,
  detail: (id: string) => ['markets', id] as const,
};

/** Live market list with background refetch every 30s and cached-while-revalidate UX. */
export function useMarkets() {
  return useQuery({
    queryKey: marketKeys.all,
    queryFn: ({ signal }) => fetchMarkets(signal),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

export function useAsset(id: string): Asset | undefined {
  const { data } = useMarkets();
  return data?.find((a) => a.id === id);
}
