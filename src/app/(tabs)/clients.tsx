import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function ClientsScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Sets the header title for this tab screen */}

      <ThemedText  style={styles.text}>Clients Screen</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
  },
});
