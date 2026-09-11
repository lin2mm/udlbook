import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export function EmptyState() {
  return (
    <View style={{ padding: 24, alignItems: "center" }}>
      <Text style={{ fontSize: 48 }}>💨</Text>
      <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 12 }}>No friends yet</Text>
      <Text style={{ color: "#666", textAlign: "center", marginTop: 8 }}>
        Add friends via username search, contacts (opt-in), or invite code. The notification IS the message — no inbox, no history.
      </Text>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/search" asChild>
          <TouchableOpacity style={{ backgroundColor: "#000", padding: 10, borderRadius: 8 }}>
            <Text style={{ color: "#fff" }}>Search @</Text>
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
      </View>
      <Text style={{ color: "#999", fontSize: 11, textAlign: "center", marginTop: 16 }}>
        Context-based messaging: one phrase, meaning from context. Yo-style ephemeral.
      </Text>
    </View>
  );
}
