import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Card } from '@/components/Card';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { AssetRow } from '@/components/AssetRow';
import { useMarkets } from '@/hooks/useMarkets';
import { usePortfolio, selectPortfolioValue } from '@/store/portfolio';
import { formatPct } from '@/utils/format';

export default function PortfolioScreen() {
  const { color, space, font } = useTheme();
  const insets = useSafeAreaInsets();
  const { data: assets = [] } = useMarkets();
  const holdings = usePortfolio((s) => s.holdings);

  const priceOf = useMemo(() => {
    const map = new Map(assets.map((a) => [a.id, a.price] as const));
    return (id: string) => map.get(id);
  }, [assets]);

  const total = selectPortfolioValue(holdings, priceOf);
  const held = assets.filter((a) => holdings[a.id]);
  const dayChange =
    held.reduce((s, a) => s + a.change24h * (holdings[a.id]!.units * a.price), 0) / (total || 1);

  return (
    <ScrollView
      style={{ backgroundColor: color.bg }}
      contentContainerStyle={{ paddingTop: insets.top + space.lg, paddingBottom: space.xxl }}
    >
      <View style={{ paddingHorizontal: space.lg }}>
        <Text style={{ color: color.textMuted, fontSize: font.size.sm }}>Total balance</Text>
        <AnimatedNumber
          value={total}
          style={{ color: color.text, fontSize: font.size.display, fontWeight: '700' }}
        />
        <Text style={{ color: dayChange >= 0 ? color.positive : color.negative, fontSize: font.size.md }}>
          {formatPct(dayChange)} today
        </Text>
      </View>

      <Card style={{ margin: space.lg, padding: 0, overflow: 'hidden' }}>
        {held.map((a) => (
          <AssetRow key={a.id} asset={a} />
        ))}
      </Card>
    </ScrollView>
  );
}
