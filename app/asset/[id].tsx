import React, { useCallback } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { Sparkline } from '@/components/Sparkline';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { Card } from '@/components/Card';
import { useAsset } from '@/hooks/useMarkets';
import { usePortfolio } from '@/store/portfolio';
import { formatPct, formatCompact } from '@/utils/format';

export default function AssetDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { color, space, font } = useTheme();
  const insets = useSafeAreaInsets();
  const asset = useAsset(id);
  const watched = usePortfolio((s) => s.watchlist.includes(id));
  const toggleWatch = usePortfolio((s) => s.toggleWatch);

  const onWatch = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    toggleWatch(id);
  }, [id, toggleWatch]);

  if (!asset) {
    return (
      <View style={{ flex: 1, backgroundColor: color.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: color.textMuted }}>Asset not found.</Text>
      </View>
    );
  }

  const positive = asset.change24h >= 0;
  const width = Dimensions.get('window').width - space.lg * 2;

  return (
    <View style={{ flex: 1, backgroundColor: color.bg, paddingTop: insets.top }}>
      <Stack.Screen options={{ title: asset.name }} />
      <Pressable onPress={() => router.back()} style={{ padding: space.lg }}>
        <Text style={{ color: color.brand, fontSize: font.size.md }}>‹ Back</Text>
      </Pressable>

      <Animated.View entering={FadeInDown.springify().damping(18)} style={{ paddingHorizontal: space.lg }}>
        <Text style={{ color: color.textMuted, fontSize: font.size.md }}>{asset.symbol}</Text>
        <AnimatedNumber value={asset.price} style={{ color: color.text, fontSize: font.size.xl, fontWeight: '700' }} />
        <Text style={{ color: positive ? color.positive : color.negative, fontSize: font.size.md }}>
          {formatPct(asset.change24h)} · 24h
        </Text>
      </Animated.View>

      <Card style={{ margin: space.lg }}>
        <Sparkline data={asset.sparkline} width={width - space.lg * 2} height={160} positive={positive} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: space.lg }}>
          <View>
            <Text style={{ color: color.textMuted, fontSize: font.size.xs }}>Market cap</Text>
            <Text style={{ color: color.text, fontSize: font.size.md }}>{formatCompact(asset.marketCap)}</Text>
          </View>
          <Pressable
            onPress={onWatch}
            style={{
              backgroundColor: watched ? color.brand : 'transparent',
              borderColor: color.brand, borderWidth: 1,
              paddingHorizontal: space.lg, paddingVertical: space.sm, borderRadius: 999,
            }}
          >
            <Text style={{ color: watched ? color.bg : color.brand, fontWeight: '600' }}>
              {watched ? 'Watching' : 'Watch'}
            </Text>
          </Pressable>
        </View>
      </Card>
    </View>
  );
}
