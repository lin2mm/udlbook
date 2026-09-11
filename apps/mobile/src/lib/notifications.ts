import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Custom sound handling — iOS <30s, Android notification channel
export async function ensureNotificationChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("farts", {
      name: "Farts",
      importance: Notifications.AndroidImportance.MAX,
      sound: "fart.mp3", // must be in android/app/src/main/res/raw/
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF0000",
    });

    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export async function getExpoPushToken(): Promise<string | null> {
  try {
    const projectId = (Constants.expoConfig?.extra as any)?.eas?.projectId || Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      console.warn("[notif] no projectId in app.json extra.eas.projectId");
    }

    const token = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
    return token.data;
  } catch (e) {
    console.error("[notif] getExpoPushToken failed", e);
    return null;
  }
}

export function addNotificationListeners(opts: {
  onReceived?: (notification: Notifications.Notification) => void;
  onResponse?: (response: Notifications.NotificationResponse) => void;
}) {
  const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
    console.log("[notif] received", notification.request.content);
    opts.onReceived?.(notification);
  });

  const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log("[notif] response", response.notification.request.content);
    opts.onResponse?.(response);
  });

  return () => {
    receivedSub.remove();
    responseSub.remove();
  };
}
