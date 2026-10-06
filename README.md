# Eat First

Your fridge's to-do list. Local-first Android app (Expo SDK 57, Expo Router, expo-sqlite). See [masterplan.md](masterplan.md).

## Run (Android)

Needs Android SDK + JDK 17 (`ANDROID_HOME`, `JAVA_HOME`).

```bash
npm install
npm run android        # prebuild + debug build + install (expo run:android)
npx expo start --dev-client
```

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
- `scripts/make_icons.py` — regenerates the placeholder icon set (Pillow)
