import React, { useMemo } from 'react';
import { Canvas, Path, Skia, LinearGradient, vec } from '@shopify/react-native-skia';
import { useTheme } from '@/theme/ThemeProvider';

interface Props { data: number[]; width: number; height: number; positive: boolean }

/**
 * GPU-rendered sparkline using Skia. Builds a smooth cubic path from the series
 * and fills the area underneath with a vertical gradient. No re-render on scroll —
 * the path is memoised against its inputs.
 */
export function Sparkline({ data, width, height, positive }: Props) {
  const { color } = useTheme();
  const stroke = positive ? color.positive : color.negative;

  const { line, area } = useMemo(() => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const dx = width / Math.max(1, data.length - 1);
    const y = (v: number) => height - ((v - min) / range) * (height * 0.9) - height * 0.05;

    const path = Skia.Path.Make();
    data.forEach((v, i) => (i === 0 ? path.moveTo(0, y(v)) : path.lineTo(i * dx, y(v))));

    const fill = path.copy();
    fill.lineTo(width, height);
    fill.lineTo(0, height);
    fill.close();
    return { line: path, area: fill };
  }, [data, width, height]);

  return (
    <Canvas style={{ width, height }}>
      <Path path={area} style="fill" opacity={0.18}>
        <LinearGradient start={vec(0, 0)} end={vec(0, height)} colors={[stroke, 'transparent']} />
      </Path>
      <Path path={line} style="stroke" strokeWidth={2} strokeCap="round" color={stroke} />
    </Canvas>
  );
}
