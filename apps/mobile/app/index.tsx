import { View, Text, FlatList, TouchableOpacity, Switch, Alert } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import * as Location from "expo-location";
import { AdBanner } from "../src/components/AdBanner";
import { useAuth } from "../src/store/useAuth";
import { Api } from "../src/lib/api";

// Mock recipient list — in real app, fetched from relationships + recent farts
const MOCK_PEOPLE = [
  { id: "1", username: "alex", displayName: "Alex", lastFartAt: "2m ago" },
  { id: "2", username: "sam", displayName: "Sam", lastFartAt: "1h ago" },
  { id: "3", username: "jordan", displayName: "Jordan", lastFartAt: "yesterday" },
];

export default function Home() {
  const { username, apiKey } = useAuth();
  const [attachLocation, setAttachLocation] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);

  const sendFart = async (recipientId: string) => {
    if (!apiKey) {
      Alert.alert("Not registered", "Go to onboarding first");
      return;
    }
    setSendingTo(recipientId);
    try {
      let lat, lng;
      if (attachLocation) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Location permission needed to attach location");
        } else {
          const loc = await Location.getCurrentPositionAsync({});
          lat = loc.coords.latitude;
          lng = loc.coords.longitude;
        }
      }

      const res = await Api.sendFart(apiKey, { recipientId, lat, lng });
      Alert.alert("Fart delivered 🫢", `Message ${res.messageId}`);
    } catch (e: any) {
      Alert.alert("Failed", e.message);
    } finally {
      setSendingTo(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 16, borderBottomWidth: 1, borderColor: "#eee" }}>
        <Text style={{ fontSize: 24, fontWeight: "700" }}>iFarted</Text>
        <Text style={{ color: "#666", marginTop: 4 }}>
          {username ? `@${username}` : "No username — onboard first"} · Context-based messaging
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
          <Text>Attach location</Text>
          <Switch value={attachLocation} onValueChange={setAttachLocation} style={{ marginLeft: 8 }} />
        </View>
        <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
          <Link href="/onboarding" asChild>
            <TouchableOpacity style={{ backgroundColor: "#000", padding: 10, borderRadius: 8 }}>
              <Text style={{ color: "#fff" }}>Onboarding</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/settings" asChild>
            <TouchableOpacity style={{ backgroundColor: "#eee", padding: 10, borderRadius: 8 }}>
              <Text>Settings</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <FlatList
        data={MOCK_PEOPLE}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => sendFart(item.id)}
            disabled={sendingTo === item.id}
            style={{ padding: 16, borderBottomWidth: 1, borderColor: "#f0f0f0", flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.displayName}</Text>
              <Text style={{ color: "#666" }}>@{item.username} · {item.lastFartAt}</Text>
            </View>
            <View style={{ backgroundColor: "#000", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, justifyContent: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>{sendingTo === item.id ? "..." : "💨 Fart"}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ padding: 16, color: "#666" }}>No friends yet — add via username search, contacts, or invite link.</Text>}
      />

      <AdBanner />
    </View>
  );
}
