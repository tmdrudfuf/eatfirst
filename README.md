# Eat First

Your fridge's to-do list. Local-first Android app (Expo SDK 57, Expo Router, expo-sqlite). See [masterplan.md](masterplan.md).

## Run (Android)

Needs Android SDK + JDK 17 (`ANDROID_HOME`, `JAVA_HOME`).

```bash
npm install
npm run android        # prebuild + debug build + install (expo run:android)
npx expo start --dev-client
```

## Ads (AdMob)

Debug builds always load Google's test banner. Without env vars, release builds also use Google's
sample app ID and test banner unit. For a real release, set both at build time:

```bash
ADMOB_ANDROID_APP_ID=ca-app-pub-XXXX~YYYY EXPO_PUBLIC_ADMOB_BANNER_ID=ca-app-pub-XXXX/ZZZZ npx expo run:android --variant release
```

Banners appear only on Eat First and Inventory, after UMP consent; any failure (offline, no fill) renders nothing.

## Checks

```bash
npx tsc --noEmit
npx eslint .
npm run check          # self-check: date logic + daily reminder text
```

## Layout

- `src/app` — routes (tabs: Eat First / + / Inventory; add, eat-by, food/[id], settings)
- `src/db` — SQLite connection, migrations (`PRAGMA user_version`), catalog seed
- `src/repositories/foodRepository.ts` — all SQL lives here
- `src/stores` — zustand: active foods + snackbar, add-flow selection
- `src/utils/dates.ts` — Eat By is a local `YYYY-MM-DD`, never `toISOString()`
- `src/services/notificationService.ts` — daily summary: cancel all + schedule next 7 days on every change
- `scripts/make_icons.py` — regenerates the icon set: fork | fridge with check | spoon (Pillow)
