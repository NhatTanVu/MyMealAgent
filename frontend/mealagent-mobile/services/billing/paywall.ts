import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

export async function showPaywall() {
  const result = await RevenueCatUI.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: "my_meal_agent_pro",
  });

  return result === PAYWALL_RESULT.PURCHASED ||
         result === PAYWALL_RESULT.RESTORED;
}
