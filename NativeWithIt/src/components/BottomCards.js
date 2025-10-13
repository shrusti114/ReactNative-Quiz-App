import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function BottomCards({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation && navigation.navigate("Home")}
      >
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation && navigation.navigate("Dashboard")}
      >
        <Text style={styles.label}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation && navigation.navigate("Register")}
      >
        <Text style={styles.label}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#222", // dark bottom bar
  },
  card: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#444",
    borderRadius: 8,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
