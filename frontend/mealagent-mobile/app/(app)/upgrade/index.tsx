import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useBilling } from "@/context/purchaseProvider";
import { showPaywall } from "@/services/billing/paywall";
import { Button } from "react-native";

export default function UpgradeScreen() {
  const { isPremium, restore } = useBilling();

  return (
    <ThemedView style={{ padding: 24 }}>
      <ThemedText style={{ fontSize: 22 }}>
        {isPremium ? "You're Premium user 🎉" : "Upgrade to Premium"}
      </ThemedText>

      {!isPremium && (
        <Button title="Upgrade" onPress={showPaywall} />
      )}

      <Button title="Restore Purchases" onPress={restore} />
    </ThemedView>
  );
}

