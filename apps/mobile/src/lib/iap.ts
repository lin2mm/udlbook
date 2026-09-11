/**
 * Remove Ads IAP — one-time non-consumable, restorable
 * Library decision: RevenueCat favored (cross-platform entitlement mgmt + restore), expo-iap as fallback
 * Price: $1.99 suggestion (open decision, research competitors)
 */

import { Platform } from "react-native";

export const IAP_PRODUCT_ID = "remove_ads";
export const ENTITLEMENT_ID = "ad_free"; // RevenueCat entitlement

let Purchases: any = null;
let RNIap: any = null;

try {
  Purchases = require("react-native-purchases").default;
} catch {
  console.log("[iap] react-native-purchases not available");
}

try {
  RNIap = require("react-native-iap");
} catch {
  console.log("[iap] react-native-iap not available");
}

// RevenueCat API keys — set via EAS env vars, never commit
// iOS: appl_..., Android: goog_...
const REVENUECAT_API_KEY = Platform.OS === "ios" ? process.env.EXPO_PUBLIC_RC_IOS_KEY || "appl_placeholder" : process.env.EXPO_PUBLIC_RC_ANDROID_KEY || "goog_placeholder";

export async function initIAP(): Promise<boolean> {
  try {
    if (Purchases) {
      // RevenueCat (favored)
      Purchases.configure({ apiKey: REVENUECAT_API_KEY });
      // Enable debug logs in dev
      if (__DEV__) {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      }
      const customerInfo = await Purchases.getCustomerInfo();
      const isAdFree = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      console.log(`[iap] RevenueCat init, isAdFree=${isAdFree}`);
      return isAdFree;
    } else if (RNIap) {
      // expo-iap fallback
      await RNIap.initConnection();
      const products = await RNIap.getProducts({ skus: [IAP_PRODUCT_ID] });
      console.log("[iap] expo-iap products", products);
      const purchases = await RNIap.getAvailablePurchases();
      const isAdFree = purchases.some((p: any) => p.productId === IAP_PRODUCT_ID);
      return isAdFree;
    }
  } catch (e) {
    console.warn("[iap] init failed", e);
  }

  console.log("[iap] init placeholder — no IAP lib, returning false (ads shown)");
  return false;
}

export async function purchaseRemoveAds(): Promise<boolean> {
  try {
    if (Purchases) {
      const { customerInfo } = await Purchases.purchaseProduct(IAP_PRODUCT_ID);
      const isAdFree = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      console.log(`[iap] RevenueCat purchase, isAdFree=${isAdFree}`);
      return isAdFree;
    } else if (RNIap) {
      await RNIap.requestPurchase({ sku: IAP_PRODUCT_ID });
      // For expo-iap, purchase is async via listener — for MVP return true and rely on restore/listener
      return true;
    }

    console.log("[iap] purchaseRemoveAds placeholder — simulate success for dev");
    return true;
  } catch (e: any) {
    if (e.userCancelled) {
      console.log("[iap] user cancelled");
      return false;
    }
    console.error("[iap] purchase failed", e);
    throw e;
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    if (Purchases) {
      const customerInfo = await Purchases.restorePurchases();
      const isAdFree = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      console.log(`[iap] RevenueCat restore, isAdFree=${isAdFree}`);
      return isAdFree;
    } else if (RNIap) {
      const purchases = await RNIap.getAvailablePurchases();
      const isAdFree = purchases.some((p: any) => p.productId === IAP_PRODUCT_ID);
      console.log(`[iap] expo-iap restore, isAdFree=${isAdFree}`);
      return isAdFree;
    }

    console.log("[iap] restore placeholder — no lib");
    return false;
  } catch (e) {
    console.error("[iap] restore failed", e);
    return false;
  }
}

// Listener for expo-iap purchase updates (if using expo-iap)
// Should be set up in app/_layout.tsx:
// RNIap.purchaseUpdatedListener(async (purchase) => { ... })
// RNIap.purchaseErrorListener((error) => { ... })

// Entitlement source of truth = store state
// Launch + purchase + restore resolve isAdFree → ad components unmount and stop loading
// Product must be non-consumable, restorable, store-billed (out-of-band payment is rejection)
// Price: $1.99 suggestion — create product in App Store Connect + Play Console with same ID "remove_ads"
// RevenueCat: create entitlement "ad_free" linked to product "remove_ads" in dashboard

