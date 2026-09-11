/**
 * AdMob wiring — non-personalized first, no ATT
 * Placeholder for real react-native-google-mobile-ads implementation
 */

import { Platform } from "react-native";

// In real app:
// import mobileAds, { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

export async function initAds() {
  // Real:
  // await mobileAds().initialize();
  // await mobileAds().setRequestConfiguration({
  //   tagForChildDirectedTreatment: false,
  //   tagForUnderAgeOfConsent: false,
  // });
  console.log("[ads] init (placeholder) — replace with mobileAds().initialize()");
}

export function getBannerAdUnitId(): string {
  // Replace with real AdMob IDs from app.json
  // For dev, use TestIds
  if (__DEV__) {
    // return TestIds.BANNER;
    return "ca-app-pub-3940256099942544/6300978111"; // Google test banner
  }
  // Production IDs from AdMob console
  return Platform.OS === "ios"
    ? "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy" // iOS banner
    : "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy"; // Android banner
}

// Single gated component is in components/AdBanner.tsx
// isAdFree flag from Zustand controls unmounting
