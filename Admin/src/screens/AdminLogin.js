// src/screens/AdminLogin.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function AdminLogin({ navigation }) {
  const [email, setEmail] = useState("admin@gamil.com"); // default email
  const [password, setPassword] = useState("admin@1234"); // default password

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    // Hardcoded admin check
    if (email === "admin@gamil.com" && password === "admin@1234") {
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
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0A0A0A", // dark background
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF8C00", // orange title
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#1C1C1C",
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    color: "#fff",
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: "#FF8C00",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
