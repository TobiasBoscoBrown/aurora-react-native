import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { AssetRow } from '@/components/AssetRow';
import { useMarkets } from '@/hooks/useMarkets';

export default function MarketsScreen() {
  const { color, space, font } = useTheme();
  const insets = useSafeAreaInsets();
  const { data, isLoading, refetch, isRefetching } = useMarkets();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: color.bg, justifyContent: 'center' }}>
        <ActivityIndicator color={color.brand} />
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: color.bg }}
      contentContainerStyle={{ paddingTop: insets.top + space.lg }}
      data={data}
      keyExtractor={(a) => a.id}
      onRefresh={refetch}
      refreshing={isRefetching}
      ListHeaderComponent={
        <Text style={{ color: color.text, fontSize: font.size.xl, fontWeight: '700', paddingHorizontal: space.lg, marginBottom: space.sm }}>
          Markets
        </Text>
      }
      renderItem={({ item }) => <AssetRow asset={item} />}
      ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: color.border, marginLeft: space.lg }} />}
    />
  );
}
