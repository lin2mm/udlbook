import React from "react";
import { View, Text } from "react-native";
import { useAuth } from "../store/useAuth";

// Placeholder — real implementation uses react-native-google-mobile-ads
// Single gated component per systemPatterns
export function AdBanner() {
  const isAdFree = useAuth((s) => s.isAdFree);
  if (isAdFree) return null;

  return (
    <View style={{ height: 50, backgroundColor: "#f0f0f0", alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#999", fontSize: 12 }}>AdMob Banner — Remove Ads in Settings</Text>
    </View>
  );
}
