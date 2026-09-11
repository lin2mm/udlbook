/**
 * Remove Ads IAP — one-time non-consumable, restorable
 * Library TBD: expo-iap vs RevenueCat (RevenueCat favored for cross-platform entitlement mgmt + restore)
 *
 * This file shows both options, with RevenueCat as primary.
 */

// Option A: RevenueCat (favored)
// npm install react-native-purchases
// import Purchases from 'react-native-purchases';

export const IAP_PRODUCT_ID = "remove_ads";

export async function initIAP() {
  // RevenueCat example:
  // Purchases.configure({
  //   apiKey: Platform.OS === 'ios' ? 'appl_...' : 'goog_...',
  // });
  // const customerInfo = await Purchases.getCustomerInfo();
  // return customerInfo.entitlements.active['ad_free'] !== undefined;

  // expo-iap example:
  // await RNIap.initConnection();
  // const products = await RNIap.getProducts({ skus: [IAP_PRODUCT_ID] });

  console.log("[iap] init placeholder — wire RevenueCat or expo-iap");
  return false;
}

export async function purchaseRemoveAds(): Promise<boolean> {
  try {
    // RevenueCat:
    // const { customerInfo } = await Purchases.purchaseProduct(IAP_PRODUCT_ID);
    // return customerInfo.entitlements.active['ad_free'] !== undefined;

    // expo-iap:
    // await RNIap.requestPurchase({ sku: IAP_PRODUCT_ID });
    // return true;

    console.log("[iap] purchaseRemoveAds placeholder — simulate success");
    return true;
  } catch (e) {
    console.error("[iap] purchase failed", e);
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    // RevenueCat:
    // const customerInfo = await Purchases.restorePurchases();
    // return customerInfo.entitlements.active['ad_free'] !== undefined;

    // expo-iap:
    // const purchases = await RNIap.getAvailablePurchases();
    // return purchases.some(p => p.productId === IAP_PRODUCT_ID);

    console.log("[iap] restore placeholder");
    return false;
  } catch (e) {
    console.error("[iap] restore failed", e);
    return false;
  }
}

// Entitlement source of truth = store state
// Launch + purchase + restore resolve isAdFree → ad components unmount and stop loading
// Product must be non-consumable, restorable, store-billed (out-of-band payment is rejection)
