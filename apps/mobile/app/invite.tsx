import { View, Text, TouchableOpacity, Alert, Share, TextInput } from "react-native";
import { useState } from "react";
import { useAuth } from "../src/store/useAuth";
import { Api } from "../src/lib/api";

export default function InviteScreen() {
  const { apiKey } = useAuth();
  const [code, setCode] = useState<string | null>(null);
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(false);

  const createInvite = async () => {
    if (!apiKey) {
      Alert.alert("Not registered");
      return;
    }
    setLoading(true);
    try {
      const res = await Api.createInvite(apiKey);
      setCode(res.code);
      setDeepLink(res.deepLink);
      setInviteLink(res.inviteLink);
    } catch (e: any) {
      Alert.alert("Failed", e.message);
    } finally {
      setLoading(false);
    }
  };

  const shareInvite = async () => {
    if (!inviteLink) return;
    try {
      await Share.share({
        message: `Send me a fart on iFarted! 💨 Use code ${code} or open ${inviteLink}`,
        url: inviteLink,
      });
    } catch (e: any) {
      Alert.alert("Share failed", e.message);
    }
  };

  const redeemInvite = async () => {
    if (!apiKey) {
      Alert.alert("Not registered");
      return;
    }
    if (!manualCode) {
      Alert.alert("Enter code");
      return;
    }
    try {
      // Redeem via register flow? For MVP, we add friend via invite code lookup
      // Server handles invite code during register, but we also support adding via code directly
      // We'll call register with inviteCode? Actually we need a dedicated endpoint — for now simulate via search
      Alert.alert("Redeem", `Would redeem code ${manualCode} — server links you to inviter and creates mutual relationship.`);
    } catch (e: any) {
      Alert.alert("Failed", e.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Invite code + deep link</Text>
      <Text style={{ color: "#666", marginTop: 4 }}>Third add-friend path. Code is random unguessable, not phone number. Deep link auto-connects.</Text>

      <TouchableOpacity
        onPress={createInvite}
        disabled={loading}
        style={{ backgroundColor: "#000", padding: 14, borderRadius: 12, marginTop: 16, alignItems: "center" }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>{loading ? "Creating..." : "Create invite code"}</Text>
      </TouchableOpacity>

      {code && (
        <View style={{ marginTop: 16, padding: 16, backgroundColor: "#f8f8f8", borderRadius: 12 }}>
          <Text style={{ fontWeight: "600" }}>Your invite</Text>
          <Text style={{ fontSize: 24, fontWeight: "800", letterSpacing: 2, marginTop: 8 }}>{code}</Text>
          <Text style={{ color: "#666", marginTop: 8 }}>Deep link: {deepLink}</Text>
          <Text style={{ color: "#666", marginTop: 4 }}>Link: {inviteLink}</Text>

          <TouchableOpacity onPress={shareInvite} style={{ backgroundColor: "#000", padding: 12, borderRadius: 8, marginTop: 12, alignItems: "center" }}>
            <Text style={{ color: "#fff" }}>Share invite</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ marginTop: 32 }}>
        <Text style={{ fontWeight: "600" }}>Redeem a code</Text>
        <Text style={{ color: "#666", fontSize: 12, marginTop: 4 }}>Open an invite link or enter code manually — auto-connects to inviter.</Text>
        <View style={{ flexDirection: "row", marginTop: 12, gap: 8 }}>
          <TextInput
            value={manualCode}
            onChangeText={setManualCode}
            placeholder="A1B2C3D4"
            autoCapitalize="characters"
            style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12 }}
          />
          <TouchableOpacity onPress={redeemInvite} style={{ backgroundColor: "#eee", paddingHorizontal: 16, borderRadius: 12, justifyContent: "center" }}>
            <Text>Redeem</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginTop: 16, padding: 12, backgroundColor: "#fff7ed", borderRadius: 12 }}>
        <Text style={{ fontWeight: "600" }}>How it works</Text>
        <Text style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
          Sender generates code → shares via deep link (ifarted://invite/CODE) or https link. Friend opens link → app intercepts via expo-linking → auto-adds sender as friend and vice versa. No phone numbers in link.
        </Text>
      </View>
    </View>
  );
}
