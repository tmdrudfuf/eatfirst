import type { ConfigContext, ExpoConfig } from 'expo/config';

// AdMob app ID: Google's sample ID unless ADMOB_ANDROID_APP_ID is set when building a release.
// The SDK crashes at launch without an app ID, so there is always one.
// (app.json's root "react-native-google-mobile-ads" key only exists because the library's
// android/app-json.gradle fails to evaluate when that key is missing.)
const ADMOB_TEST_APP_ID = 'ca-app-pub-3940256099942544~3347511713';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  plugins: [
    ...(config.plugins ?? []),
    ['react-native-google-mobile-ads', { androidAppId: process.env.ADMOB_ANDROID_APP_ID ?? ADMOB_TEST_APP_ID }],
  ],
});
