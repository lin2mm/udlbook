import { View, Text, FlatList, TouchableOpacity, Switch, Alert, RefreshControl } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Link } from "expo-router";
import * as Location from "expo-location";
import { AdBanner } from "../src/components/AdBanner";
import { useAuth } from "../src/store/useAuth";
import { useFriends } from "../src/store/useFriends";
import { Api } from "../src/lib/api";
import * as Notifications from "expo-notifications";
import { getExpoPushToken, ensureNotificationChannel, addNotificationListeners } from "../src/lib/notifications";
import { router } from "expo-router";

export default function Home() {
  const { username, apiKey } = useAuth();
  const { friends, setFriends } = useFriends();
  const [attachLocation, setAttachLocation] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadFriends = useCallback(async () => {
    if (!apiKey) return;
    try {
      const res = await Api.friends(apiKey);
      setFriends(res.friends);
    } catch (e) {
      console.warn("[home] loadFriends failed", e);
    }
  }, [apiKey, setFriends]);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  useEffect(() => {
    // Setup push
    (async () => {
      await ensureNotificationChannel();
      if (apiKey) {
        const token = await getExpoPushToken();
        if (token) {
          try {
            await Api.registerToken(apiKey, { expoPushToken: token as any, platform: "ios" as any });
            console.log("[home] push token registered");
          } catch (e) {
            console.warn("[home] token register failed", e);
          }
        }
      }
    })();

    const cleanup = addNotificationListeners({
      onResponse: (response) => {
        const data = response.notification.request.content.data as any;
        if (data?.type === "fart") {
          router.push({
            pathname: "/fart-detail",
            params: {
              senderName: data.senderName,
              senderId: data.senderId,
              lat: data.lat?.toString(),
              lng: data.lng?.toString(),
            },
          });
        }
      },
    });

    return cleanup;
  }, [apiKey]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFriends();
    setRefreshing(false);
  }, [loadFriends]);

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
      // Refresh to update lastFartAt ordering
      loadFriends();
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
        <View style={{ flexDirection: "row", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <Link href="/onboarding" asChild>
            <TouchableOpacity style={{ backgroundColor: "#000", padding: 10, borderRadius: 8 }}>
              <Text style={{ color: "#fff" }}>Onboarding</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/search" asChild>
            <TouchableOpacity style={{ backgroundColor: "#f0f0f0", padding: 10, borderRadius: 8 }}>
              <Text>Search @</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/contacts" asChild>
            <TouchableOpacity style={{ backgroundColor: "#f0f0f0", padding: 10, borderRadius: 8 }}>
              <Text>Contacts</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/invite" asChild>
            <TouchableOpacity style={{ backgroundColor: "#f0f0f0", padding: 10, borderRadius: 8 }}>
              <Text>Invite</Text>
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
        data={friends}
        keyExtractor={(i) => i.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => sendFart(item.id)}
            disabled={sendingTo === item.id}
            style={{ padding: 16, borderBottomWidth: 1, borderColor: "#f0f0f0", flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.displayName || item.username}</Text>
              <Text style={{ color: "#666" }}>@{item.username} · via {item.addedVia} {item.lastFartAt ? `· last fart ${new Date(item.lastFartAt).toLocaleTimeString()}` : ""}</Text>
            </View>
            <View style={{ backgroundColor: "#000", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, justifyContent: "center", marginLeft: 8 }}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>{sendingTo === item.id ? "..." : "💨 Fart"}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ padding: 16 }}>
            <Text style={{ color: "#666", textAlign: "center" }}>No friends yet — add via username search, contacts, or invite link.</Text>
            <Text style={{ color: "#999", fontSize: 12, textAlign: "center", marginTop: 8 }}>Home = recipient list ordered by most-recently active (Yo-style). No inbox/history — notification IS message.</Text>
          </View>
        }
      />

      <AdBanner />
    </View>
  );
}
