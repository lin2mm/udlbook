import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useAuth } from "../src/store/useAuth";
import { Api } from "../src/lib/api";
import { requestContactsPermission, getPhoneNumbers } from "../src/lib/contacts";
import { useFriends } from "../src/store/useFriends";

export default function ContactsScreen() {
  const { apiKey } = useAuth();
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<{ id: string; username: string; displayName?: string }[]>([]);
  const { addFriend } = useFriends();

  const findFriends = async () => {
    if (!apiKey) {
      Alert.alert("Not registered");
      return;
    }
    setLoading(true);
    try {
      const granted = await requestContactsPermission();
      if (!granted) {
        Alert.alert("Permission needed", "Contacts permission is required to find friends (opt-in only).");
        setLoading(false);
        return;
      }

      const numbers = await getPhoneNumbers();
      if (numbers.length === 0) {
        Alert.alert("No numbers", "No phone numbers found in contacts.");
        setLoading(false);
        return;
      }

      console.log(`[contacts] found ${numbers.length} numbers, checking with server...`);
      const res = await Api.contacts(apiKey, numbers);
      setMatches(res.matches);
      Alert.alert("Done", `Found ${res.matches.length} friends from contacts who enabled discovery.`);
    } catch (e: any) {
      Alert.alert("Failed", e.message);
    } finally {
      setLoading(false);
    }
  };

  const add = async (userId: string, username: string) => {
    if (!apiKey) return;
    try {
      await Api.addFriend(apiKey, userId);
      addFriend({
        id: userId,
        username,
        displayName: username,
        addedVia: "contacts",
        addedAt: new Date().toISOString(),
      });
      Alert.alert("Added", `@${username} added via contacts`);
    } catch (e: any) {
      Alert.alert("Failed", e.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Find friends from contacts</Text>
      <Text style={{ color: "#666", marginTop: 4 }}>
        Opt-in only. Phone numbers are hashed server-side, never stored raw. Only reveals matches who enabled phone discovery.
      </Text>

      <TouchableOpacity
        onPress={findFriends}
        disabled={loading}
        style={{ backgroundColor: "#000", padding: 14, borderRadius: 12, marginTop: 16, alignItems: "center" }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>{loading ? "Scanning..." : "Scan contacts"}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}

      <FlatList
        data={matches}
        keyExtractor={(i) => i.id}
        style={{ marginTop: 16 }}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 12, borderBottomWidth: 1, borderColor: "#f0f0f0" }}>
            <View>
              <Text style={{ fontWeight: "600" }}>{item.displayName || item.username}</Text>
              <Text style={{ color: "#666" }}>@{item.username} · via contacts</Text>
            </View>
            <TouchableOpacity onPress={() => add(item.id, item.username)} style={{ backgroundColor: "#000", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 }}>
              <Text style={{ color: "#fff" }}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={!loading ? <Text style={{ color: "#999", marginTop: 16, textAlign: "center" }}>No matches yet. Make sure friends enabled phone discovery in Settings.</Text> : null}
      />

      <View style={{ marginTop: 16, padding: 12, backgroundColor: "#f0fdf4", borderRadius: 12 }}>
        <Text style={{ fontWeight: "600" }}>Privacy note</Text>
        <Text style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
          We never upload your entire address book raw. Numbers are normalized and hashed. Server only returns users who explicitly enabled discovery. You can toggle this in Settings.
        </Text>
      </View>
    </View>
  );
}
