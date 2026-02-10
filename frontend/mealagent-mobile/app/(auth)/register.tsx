import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/hooks/useAuth";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    try {
      setError(null);
      await register(username, password, email || undefined);
      router.replace("/");
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "Registration failed");
    }
  };

  return (
    <View style={{ padding: 24 }}>
      <ThemedText style={{ fontSize: 24, marginBottom: 16 }}>Register</ThemedText>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />

      <TextInput
        placeholder="Email (optional)"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />

      {error && <ThemedText style={{ color: "red" }}>{error}</ThemedText>}

      <Pressable onPress={onSubmit}
        style={{
          backgroundColor: "#000",
          padding: 14,
          borderRadius: 6,
          marginBottom: 12,
          alignItems: "center",
        }}>
        <ThemedText style={{ color: "#fff" }}>Create Account</ThemedText>
      </Pressable>


      <Link href="/login" style={{ marginTop: 16, fontSize: 16 }}>
        Already have an account? Login
      </Link>
    </View>
  );
}

