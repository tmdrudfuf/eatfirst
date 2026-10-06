import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, useForeground } from 'react-native-google-mobile-ads';

import { BANNER_UNIT_ID, useAds } from '@/services/ads';

// Bottom banner for Eat First and Inventory only. Renders nothing until ads are ready
// and nothing when a request fails (offline / no fill); retries on next foreground.
export function AdBanner() {
  const ready = useAds((s) => s.ready);
  const [failed, setFailed] = useState(false);
  useForeground(() => setFailed(false));
  const shown = ready && !failed;

  useEffect(() => {
    if (!shown) useAds.setState({ bannerHeight: 0 });
  }, [shown]);

  if (!shown) return null;
  return (
    <View
      style={{ alignItems: 'center' }}
      onLayout={(e) => useAds.setState({ bannerHeight: e.nativeEvent.layout.height })}>
      <BannerAd
        unitId={BANNER_UNIT_ID}
        size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}
