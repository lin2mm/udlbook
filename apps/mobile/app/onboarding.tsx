import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Api } from "../src/lib/api";
import { useAuth } from "../src/store/useAuth";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export default function Onboarding() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();

  const register = async () => {
    if (!username) {
      Alert.alert("Username required", "Claim a unique @username (3-20 alnum/_)");
      return;
    }
    setLoading(true);
    try {
      const res = await Api.register({ username, phoneE164: phone || undefined, inviteCode: inviteCode || undefined });

      // Get Expo push token
      let expoPushToken: string | null = null;
      if (Device.isDevice) {
        const token = await Notifications.getExpoPushTokenAsync();
        expoPushToken = token.data;
      }

      if (expoPushToken) {
        await Api.registerToken(res.apiKey, { expoPushToken: expoPushToken as any, platform: Platform.OS as any });
      }

      setAuth({ userId: res.userId, apiKey: res.apiKey, username: res.user.username });
      Alert.alert("Welcome to iFarted", `You're @${res.user.username}. Tap a friend to fart.`);
      router.replace("/");
    } catch (e: any) {
      Alert.alert("Register failed", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 28, fontWeight: "800", marginTop: 40 }}>Claim your @username</Text>
      <Text style={{ color: "#666", marginTop: 8, fontSize: 16 }}>
        Context-based messaging: one phrase, meaning from context. No typing, no inbox — notification IS the message.
      </Text>

      <View style={{ marginTop: 32 }}>
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>@username (unique)</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="alex"
          autoCapitalize="none"
          style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 14, fontSize: 16 }}
        />
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>Phone (optional, for contacts matching)</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="+14155552671"
          keyboardType="phone-pad"
          style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 14, fontSize: 16 }}
        />
        <Text style={{ color: "#888", fontSize: 12, marginTop: 6 }}>Opt-in only. Hashed server-side, only reveals matches who enabled discovery.</Text>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>Invite code (if you have one)</Text>
        <TextInput
          value={inviteCode}
          onChangeText={setInviteCode}
          placeholder="A1B2C3D4"
          autoCapitalize="characters"
          style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 14, fontSize: 16 }}
        />
      </View>

      <TouchableOpacity
        onPress={register}
        disabled={loading}
        style={{ backgroundColor: "#000", padding: 16, borderRadius: 12, marginTop: 32, alignItems: "center" }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>{loading ? "Creating..." : "Start farting 💨"}</Text>
      </TouchableOpacity>

      <Text style={{ color: "#888", fontSize: 12, marginTop: 16, textAlign: "center" }}>
        By continuing you agree that iFarted is pure comedic utility. No history, no feed. Notifications are ephemeral.
      </Text>
    </ScrollView>
  );
}
