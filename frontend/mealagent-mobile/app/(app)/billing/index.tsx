import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useBilling } from "@/context/purchaseProvider";
import { useAuth } from "@/hooks/useAuth";
import { showPaywall } from "@/services/billing/paywall";
import { useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet } from "react-native";

export default function BillingScreen() {
  const { isPremium, restore } = useBilling();
  const { reloadUser } = useAuth();
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>
        {isPremium ? "You're Premium user 🎉" : "Upgrade to Premium"}
      </ThemedText>

      {!isPremium && (
        <Pressable onPress={() => {
          showPaywall().then(async (result) => {
            if (result) {
              await reloadUser();
              Alert.alert("Upgrade successful!");
            }
            else {
              Alert.alert("Failed to upgrade!");
              router.push("/");
            }
          })
        }} style={styles.button}>
          <ThemedText style={styles.buttonText}>Upgrade</ThemedText>
        </Pressable>
      )}

      <Pressable onPress={restore} style={[styles.button, { backgroundColor: "#A5D6A7" }]} disabled={true}>
        <ThemedText style={styles.buttonText}>Restore Purchases (disabled)</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 34, // fontSize * 1.2
    marginBottom: 8,
  },
  subtitle: {
    color: "#666",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 14,
    minWidth: 200
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center"
  },
});