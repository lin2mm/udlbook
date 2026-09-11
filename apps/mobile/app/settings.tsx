import { View, Text, TouchableOpacity, Alert, Switch } from "react-native";
import { useAuth } from "../src/store/useAuth";
import { Api } from "../src/lib/api";
import { useState, useEffect } from "react";

export default function Settings() {
  const { isAdFree, setAdFree, apiKey, username, clear } = useAuth();
  const [phoneDiscovery, setPhoneDiscovery] = useState(false);

  useEffect(() => {
    if (!apiKey) return;
    Api.me(apiKey)
      .then((me: any) => setPhoneDiscovery(!!me.phoneDiscovery))
      .catch(() => {});
  }, [apiKey]);

  const buyRemoveAds = async () => {
    // Placeholder — real implementation uses expo-iap or RevenueCat
    Alert.alert("Remove Ads", "This would trigger StoreKit / Play Billing for non-consumable remove_ads. Price ~$1.99. Entitlement restorable.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Simulate Purchase",
        onPress: () => {
          setAdFree(true);
          Alert.alert("Purchased", "Ads removed. AdBanner unmounted everywhere.");
        },
      },
    ]);
  };

  const restore = async () => {
    // Real: RevenueCat restore or expo-iap getAvailablePurchases
    Alert.alert("Restore", "Would check store for existing remove_ads entitlement.");
  };

  const createInvite = async () => {
    if (!apiKey) {
      Alert.alert("Not registered");
      return;
    }
    try {
      const res = await Api.createInvite(apiKey);
      Alert.alert("Invite created", `Code: ${res.code}\nLink: ${res.inviteLink}\nDeep: ${res.deepLink}`);
    } catch (e: any) {
      Alert.alert("Failed", e.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Settings</Text>
      <Text style={{ color: "#666", marginTop: 4 }}>@{username || "unknown"}</Text>

      <View style={{ marginTop: 24, gap: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12, backgroundColor: "#f8f8f8", borderRadius: 12 }}>
          <Text>Remove Ads — {isAdFree ? "Ad-free ✅" : "Free with ads"}</Text>
          <TouchableOpacity onPress={buyRemoveAds} style={{ backgroundColor: "#000", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
            <Text style={{ color: "#fff" }}>{isAdFree ? "Purchased" : "Buy $1.99"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={restore} style={{ padding: 12, backgroundColor: "#eee", borderRadius: 12 }}>
          <Text style={{ textAlign: "center" }}>Restore Purchases</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12, backgroundColor: "#f8f8f8", borderRadius: 12 }}>
          <Text>Phone discovery (opt-in)</Text>
          <Switch
            value={phoneDiscovery}
            onValueChange={async (v) => {
              setPhoneDiscovery(v);
              if (!apiKey) return;
              try {
                await Api.setPhoneDiscovery(apiKey, v);
              } catch (e: any) {
                Alert.alert("Failed", e.message);
                setPhoneDiscovery(!v);
              }
            }}
          />
        </View>

        <TouchableOpacity onPress={createInvite} style={{ padding: 12, backgroundColor: "#f8f8f8", borderRadius: 12 }}>
          <Text style={{ textAlign: "center" }}>Create Invite Code + Deep Link</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 16, padding: 12, backgroundColor: "#fff7ed", borderRadius: 12 }}>
          <Text style={{ fontWeight: "600" }}>Privacy note</Text>
          <Text style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
            Location is per-message opt-in, only to chosen recipient. Phone numbers hashed for contacts matching, not stored raw. No message history — notifications are ephemeral. See systemPatterns for Yo hack mitigations.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            clear();
            Alert.alert("Signed out", "Cleared local auth. Re-onboard to continue.");
          }}
          style={{ padding: 12, backgroundColor: "#fee2e2", borderRadius: 12, marginTop: 16 }}
        >
          <Text style={{ textAlign: "center", color: "#dc2626" }}>Sign out / Clear local data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
