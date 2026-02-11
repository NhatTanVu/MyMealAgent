import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { AuthProvider } from '@/context/authContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/useAuth';
import { ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const unstable_settings = {
  anchor: 'import',
};

function AppNavigator() {
  const colorScheme = useColorScheme();
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DefaultTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {token ? (
            <Stack.Screen name="(app)" />
          ) : (
            <Stack.Screen name="(auth)" />
          )}
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}