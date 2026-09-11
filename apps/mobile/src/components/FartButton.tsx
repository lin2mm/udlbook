import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import React from "react";

interface Props {
  onPress: () => void;
  loading?: boolean;
  label?: string;
  size?: "small" | "large";
}

export function FartButton({ onPress, loading, label = "💨 Fart", size = "small" }: Props) {
  const isLarge = size === "large";
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={{
        backgroundColor: "#000",
        paddingHorizontal: isLarge ? 24 : 16,
        paddingVertical: isLarge ? 14 : 8,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        minWidth: isLarge ? 140 : 80,
      }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: isLarge ? 18 : 14 }}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

export function FartBackButton({ onPress, loading }: { onPress: () => void; loading?: boolean }) {
  return <FartButton onPress={onPress} loading={loading} label="Fart back 💨" size="large" />;
}
