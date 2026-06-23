# Aurora — Real-Time Crypto Portfolio Tracker

A reference-quality React Native app built to demonstrate production patterns end to end:
typed data flow, GPU-rendered charts, UI-thread animation, offline-first persistence, and a
properly layered architecture. Runs on iOS, Android, and web from a single codebase.

> Built by **Tobias Bosco Brown** — Full-Stack / React Native developer. Portfolio: buildmytribe.io/portfolio

---

## Highlights

- **Expo Router (typed routes)** — file-based navigation with a typed `/asset/[id]` deep link.
- **TanStack Query** — live markets with 30s background refetch, stale-while-revalidate, request cancellation via `AbortSignal`, and a graceful offline fixture so the app is always demoable.
- **Zustand + MMKV** — portfolio/watchlist state persisted through a synchronous MMKV adapter; business logic lives in **pure selectors** (`selectPortfolioValue`) that are trivially unit-tested.
- **Reanimated 3** — balance counter tweens entirely on the UI thread by driving a whitelisted `TextInput.text` prop from a worklet → zero JS-thread re-renders per frame. Spring entrance transitions on the detail screen.
- **Skia** — sparklines are GPU-rendered cubic paths with a gradient area fill, memoised against their inputs so list scrolling never recomputes geometry.
- **Gesture Handler + Haptics** — native-feeling press states and tactile feedback.
- **TypeScript, maxed out** — `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, path aliases.
- **Tested + CI** — Jest unit tests for the money math and formatters; GitHub Actions runs typecheck → lint → test on every PR.

## Architecture

```
app/                       # Expo Router routes (the only place that knows about navigation)
  _layout.tsx              # providers: GestureHandler, SafeArea, QueryClient, Theme
  (tabs)/index.tsx         # Portfolio — derived totals + animated balance
  (tabs)/markets.tsx       # Markets — FlatList w/ pull-to-refresh
  asset/[id].tsx           # Detail — Skia chart, watch toggle, biometric-ready
src/
  api/        coingecko.ts # typed fetch wrapper, timeouts, ApiError, offline fixture
  hooks/      useMarkets   # query keys + cache config (server state)
  store/      portfolio    # zustand + MMKV persistence (client state) + pure selectors
  components/               # Sparkline (Skia), AnimatedNumber (Reanimated), Card, AssetRow (memo)
  theme/                    # design tokens -> semantic palette -> typed useTheme()
  utils/      format        # Intl money/percent formatting + deterministic series
```

### Why these choices
- **Server state vs client state are separated.** TanStack Query owns anything that comes from the network (caching, retries, refetch). Zustand owns only what the user creates (holdings, watchlist). Conflating the two is the most common source of stale-data bugs in RN apps.
- **Selectors are pure functions.** `selectPortfolioValue` takes holdings + a `priceOf` lookup and returns a number — no hooks, no store coupling — so it's testable in isolation and reusable on any screen.
- **Animation never touches the JS thread per frame.** Both the balance tween and the chart run on the UI/GPU thread, which is what keeps 120Hz ProMotion scrolling smooth.
- **The app degrades gracefully.** Kill the network and the offline fixture keeps every screen interactive — important for demos and flaky mobile connections.

## Run it
```bash
npm install
npm run ios     # or: npm run android / npm run web
npm test        # unit tests + coverage
npm run typecheck && npm run lint
```

## What I'd add next
Detail-screen scrubbable chart (pan gesture → crosshair value), `expo-local-authentication`
gate on the Portfolio tab (wired in app config), and Detox e2e for the buy/watch flows.
