import React, { useState } from "react";
import { View, Text, Platform } from "react-native";
import { useAuth } from "../store/useAuth";

// Real implementation with fallback — single gated component per systemPatterns
// Uses react-native-google-mobile-ads when available, otherwise placeholder

let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

try {
  // @ts-ignore - optional dependency, may not be installed in Expo Go
  const ads = require("react-native-google-mobile-ads");
  BannerAd = ads.BannerAd;
  BannerAdSize = ads.BannerAdSize;
  TestIds = ads.TestIds;
} catch {
  console.log("[AdBanner] react-native-google-mobile-ads not available, using placeholder");
}

export function AdBanner() {
  const isAdFree = useAuth((s) => s.isAdFree);
  const [failed, setFailed] = useState(false);

  if (isAdFree) return null;

  // Real AdMob banner when lib available
  if (BannerAd && !failed) {
    const adUnitId = __DEV__
      ? TestIds.BANNER
      : Platform.OS === "ios"
        ? "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy" // TODO: Replace with real iOS banner ID from AdMob
        : "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy"; // TODO: Replace with real Android banner ID

    return (
      <View style={{ alignItems: "center", backgroundColor: "#fff" }}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true, // No ATT needed initially
          }}
          onAdFailedToLoad={(error: any) => {
            console.warn("[AdBanner] failed to load", error);
            setFailed(true);
          }}
        />
      </View>
    );
  }

  // Placeholder fallback — for Expo Go or when ad fails
  return (
    <View style={{ height: 50, backgroundColor: "#f0f0f0", alignItems: "center", justifyContent: "center", borderTopWidth: 1, borderColor: "#eee" }}>
      <Text style={{ color: "#999", fontSize: 12 }}>AdMob Banner — Remove Ads in Settings ($1.99)</Text>
      <Text style={{ color: "#bbb", fontSize: 10, marginTop: 2 }}>Non-personalized, no ATT · Single gated component</Text>
    </View>
  );
}

// Usage: <AdBanner /> only on home screen, unmounts when isAdFree=true
// Entitlement source of truth = store state (RevenueCat or expo-iap)
// AdMob App IDs in app.json: ios.config.googleMobileAdsAppId, android.config.googleMobileAdsAppId
// For production, create ad units in AdMob console and replace placeholder IDs

