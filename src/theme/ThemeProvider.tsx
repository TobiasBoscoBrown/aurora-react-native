import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { palette, space, radius, font, type ColorScheme } from './tokens';

export interface Theme {
  scheme: ColorScheme;
  color: (typeof palette)['dark'];
  space: typeof space;
  radius: typeof radius;
  font: typeof font;
}

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = (useColorScheme() ?? 'dark') as ColorScheme;
  const value = useMemo<Theme>(
    () => ({ scheme, color: palette[scheme], space, radius, font }),
    [scheme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Strongly-typed theme hook. Throws early if a component renders outside the provider. */
export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>.');
  return ctx;
}
