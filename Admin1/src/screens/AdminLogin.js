import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function AdminLogin({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    console.log("Entered:", trimmedEmail, trimmedPassword);

    if (trimmedEmail === "admin@gmail.com" && trimmedPassword === "admin@1234") {
      Alert.alert("Success", "Login Successful", [
        { text: "OK", onPress: () => navigation.navigate("AdminDashboard") },
      ]);
    } else {
      Alert.alert("Error", "Invalid Email or Password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  title: { fontSize: 28, color: "#fff", marginBottom: 20 },
  input: {
    width: "80%",
    backgroundColor: "#222",
    color: "#fff",
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#FF8C00",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
