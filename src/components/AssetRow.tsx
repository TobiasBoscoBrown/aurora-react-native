import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { Sparkline } from './Sparkline';
import { formatUsd, formatPct } from '@/utils/format';
import type { Asset } from '@/api/coingecko';

/** Memoised so a 30s market refetch only re-renders rows whose data changed. */
export const AssetRow = memo(function AssetRow({ asset }: { asset: Asset }) {
  const { color, space, font } = useTheme();
  const positive = asset.change24h >= 0;
  return (
    <Link href={{ pathname: '/asset/[id]', params: { id: asset.id } }} asChild>
      <Pressable
        onPressIn={() => Haptics.selectionAsync()}
        style={({ pressed }) => ({
          flexDirection: 'row', alignItems: 'center', paddingVertical: space.md,
          paddingHorizontal: space.lg, opacity: pressed ? 0.6 : 1,
        })}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: color.text, fontSize: font.size.md, fontWeight: '600' }}>{asset.symbol}</Text>
          <Text style={{ color: color.textMuted, fontSize: font.size.sm }}>{asset.name}</Text>
        </View>
        <Sparkline data={asset.sparkline} width={72} height={32} positive={positive} />
        <View style={{ width: 96, alignItems: 'flex-end' }}>
          <Text style={{ color: color.text, fontSize: font.size.md, fontVariant: ['tabular-nums'] }}>
            {formatUsd(asset.price)}
          </Text>
          <Text style={{ color: positive ? color.positive : color.negative, fontSize: font.size.sm }}>
            {formatPct(asset.change24h)}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
});
