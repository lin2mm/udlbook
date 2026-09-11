import * as Contacts from "expo-contacts";
import { Platform } from "react-native";

// Privacy-safe contacts matching — only sends normalized E.164 numbers
// Server only reveals matches who enabled discovery

export async function requestContactsPermission(): Promise<boolean> {
  const { status } = await Contacts.requestPermissionsAsync();
  return status === "granted";
}

export async function getPhoneNumbers(): Promise<string[]> {
  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers],
  });

  const numbers: string[] = [];
  for (const contact of data) {
    if (contact.phoneNumbers) {
      for (const phone of contact.phoneNumbers) {
        if (phone.number) {
          // Normalize to E.164-like (keep + and digits)
          const normalized = phone.number.replace(/[^+0-9]/g, "");
          if (normalized.length >= 7) {
            numbers.push(normalized);
          }
        }
      }
    }
  }

  // Deduplicate
  return Array.from(new Set(numbers));
}

// iOS needs purpose string in app.json — already set
// Android needs READ_CONTACTS permission — already in app.json
