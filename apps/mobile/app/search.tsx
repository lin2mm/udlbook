import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useAuth } from "../src/store/useAuth";
import { Api } from "../src/lib/api";
import { useFriends } from "../src/store/useFriends";

export default function SearchScreen() {
  const { apiKey } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; username: string; displayName?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const { addFriend } = useFriends();

  const search = async () => {
    if (!apiKey) {
      Alert.alert("Not registered");
      return;
    }
    if (query.length < 2) {
      Alert.alert("Type at least 2 chars");
      return;
    }
    setLoading(true);
    try {
      const res = await Api.searchUsers(apiKey, query);
      setResults(res);
    } catch (e: any) {
      Alert.alert("Search failed", e.message);
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
        addedVia: "username",
        addedAt: new Date().toISOString(),
      });
      Alert.alert("Added", `@${username} added to your fart list`);
    } catch (e: any) {
      Alert.alert("Failed", e.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Find by @username</Text>
      <Text style={{ color: "#666", marginTop: 4 }}>Username search is public, never leaks phone. Case-insensitive, unique.</Text>

      <View style={{ flexDirection: "row", marginTop: 16, gap: 8 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="alex"
          autoCapitalize="none"
          style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12 }}
        />
        <TouchableOpacity onPress={search} style={{ backgroundColor: "#000", paddingHorizontal: 16, borderRadius: 12, justifyContent: "center" }}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>{loading ? "..." : "Search"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={results}
        keyExtractor={(i) => i.id}
        style={{ marginTop: 16 }}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 12, borderBottomWidth: 1, borderColor: "#f0f0f0" }}>
            <View>
              <Text style={{ fontWeight: "600" }}>{item.displayName || item.username}</Text>
              <Text style={{ color: "#666" }}>@{item.username}</Text>
            </View>
            <TouchableOpacity onPress={() => add(item.id, item.username)} style={{ backgroundColor: "#000", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 }}>
              <Text style={{ color: "#fff" }}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: "#999", marginTop: 16, textAlign: "center" }}>No results. Try another username.</Text>}
      />
    </View>
  );
}
