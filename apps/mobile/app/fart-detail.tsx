import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { useAuth } from "../src/store/useAuth";
import { Api } from "../src/lib/api";

export default function FartDetail() {
  const params = useLocalSearchParams() as { senderName?: string; senderId?: string; lat?: string; lng?: string };
  const { apiKey } = useAuth();
  const lat = params.lat ? parseFloat(params.lat) : undefined;
  const lng = params.lng ? parseFloat(params.lng) : undefined;
  const hasLocation = lat !== undefined && lng !== undefined;

  const fartBack = async () => {
    if (!apiKey || !params.senderId) {
      Alert.alert("Can't fart back", "Missing sender");
      return;
    }
    try {
      await Api.sendFart(apiKey, { recipientId: params.senderId });
      Alert.alert("Fart back delivered 🫢");
    } catch (e: any) {
      Alert.alert("Failed", e.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 24, alignItems: "center" }}>
        <Text style={{ fontSize: 48 }}>💨</Text>
        <Text style={{ fontSize: 24, fontWeight: "800", marginTop: 12 }}>{params.senderName || "Someone"} farted.</Text>
        <Text style={{ color: "#666", marginTop: 8 }}>{hasLocation ? "With location attached" : "No location"}</Text>
        <Text style={{ color: "#666", marginTop: 4, textAlign: "center", fontStyle: "italic"}}>
          Context-based messaging: you understand by the context what is being said.
        </Text>
      </View>

      {hasLocation ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{ latitude: lat!, longitude: lng!, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
        >
          <Marker coordinate={{ latitude: lat!, longitude: lng! }} title={`${params.senderName} farted here`} />
        </MapView>
      ) : (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Text style={{ fontSize: 16, color: "#666", textAlign: "center" }}>No location attached. The joke is the notification itself.</Text>
        </View>
      )}

      <View style={{ padding: 16 }}>
        <TouchableOpacity onPress={fartBack} style={{ backgroundColor: "#000", padding: 16, borderRadius: 12, alignItems: "center" }}>
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Fart back 💨</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
