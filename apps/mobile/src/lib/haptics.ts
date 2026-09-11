/**
 * Haptics for iFarted — tactile feedback for fart button
 * Expo Haptics: light impact on tap, success on sent
 */

let Haptics: any = null;
try {
  // @ts-ignore
  Haptics = require('expo-haptics');
} catch {
  Haptics = null;
}

export async function hapticLight() {
  try {
    if (Haptics?.impactAsync) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch {}
}

export async function hapticSuccess() {
  try {
    if (Haptics?.notificationAsync) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (Haptics?.impactAsync) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  } catch {}
}

export async function hapticError() {
  try {
    if (Haptics?.notificationAsync) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  } catch {}
}
