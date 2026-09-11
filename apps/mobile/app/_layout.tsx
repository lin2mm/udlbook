import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

// Notification handler — notification IS the message (ephemeral)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    // Request permissions early but explain why (context-based messaging)
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log("[notif] permission", status);
    })();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "iFarted" }} />
      <Stack.Screen name="onboarding" options={{ title: "Get Started", headerShown: false }} />
      <Stack.Screen name="fart-detail" options={{ title: "Fart" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  );
}
