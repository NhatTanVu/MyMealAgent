import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

let paywallRequest: Promise<boolean> | null = null;

function isAlreadyInProgressError(error: unknown) {
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message?: unknown }).message ?? "")
      : String(error ?? "");

  return message.toLowerCase().includes("already in progress") ||
         message.toLowerCase().includes("request in flight");
}

export async function showPaywall() {
  if (paywallRequest) {
    return paywallRequest;
  }

  paywallRequest = (async () => {
    try {
      const result = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: "my_meal_agent_pro",
      });

      return result === PAYWALL_RESULT.PURCHASED ||
             result === PAYWALL_RESULT.RESTORED;
    } catch (error) {
      if (isAlreadyInProgressError(error)) {
        return false;
      }

      throw error;
    } finally {
      paywallRequest = null;
    }
  })();

  return paywallRequest;
}
