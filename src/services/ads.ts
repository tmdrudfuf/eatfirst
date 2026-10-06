import mobileAds, { AdsConsent, AdsConsentPrivacyOptionsRequirementStatus, TestIds } from 'react-native-google-mobile-ads';
import { create } from 'zustand';

// Debug builds always use Google's test unit. Release builds read the real unit at build time.
export const BANNER_UNIT_ID = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : (process.env.EXPO_PUBLIC_ADMOB_BANNER_ID ?? TestIds.ADAPTIVE_BANNER);

// bannerHeight lets the snackbar sit above the banner, so a tap meant for Undo never lands on an ad.
export const useAds = create(() => ({ ready: false, privacyOptionsRequired: false, bannerHeight: 0 }));

let started = false;

// Consent (UMP) must be gathered before initialize(). Any failure — offline, no fill, SDK
// error — just leaves ads off; the app never surfaces ad errors to the user.
export async function initAds() {
  if (started) return;
  started = true;
  try {
    const info = await AdsConsent.gatherConsent().catch(() => AdsConsent.getConsentInfo());
    useAds.setState({
      privacyOptionsRequired:
        info.privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED,
    });
    if (!info.canRequestAds) return;
    await mobileAds().initialize();
    useAds.setState({ ready: true });
  } catch (e) {
    console.warn('Ads disabled', e);
  }
}

export async function showAdPrivacyOptions() {
  await AdsConsent.showPrivacyOptionsForm();
}
