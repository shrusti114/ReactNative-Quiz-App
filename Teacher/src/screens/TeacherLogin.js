// src/screens/TeacherLogin.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTeacher } from "../redux/teacherReducer";

export default function TeacherLogin({ navigation }) {
  const [teacher_name, setTeacherName] = useState("");
  const [teacher_email, setTeacherEmail] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!teacher_name || !teacher_email) {
      Alert.alert("Error", "Please enter both name and email.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/teacherLogin", {
        teacher_name,
        teacher_email,
      });

      if (res.data && res.data.teacher) {
        dispatch(setTeacher(res.data.teacher));
        Alert.alert("Success", "Login successful!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("TeacherDashboard"),
          },
        ]);
      } else {
        Alert.alert("Error", "Invalid login details");
      }
    } catch (err) {
      console.error("Login Error:", err);
      Alert.alert("Error", "Server not responding or invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Teacher Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Teacher Name"
        placeholderTextColor="#ccc"
        value={teacher_name}
        onChangeText={setTeacherName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        placeholderTextColor="#ccc"
        value={teacher_email}
        onChangeText={setTeacherEmail}
        keyboardType="email-address"
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
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    color: "#fff",
    fontSize: 28,
    marginBottom: 30,
    fontWeight: "bold",
  },
  input: {
    width: "90%",
    height: 50,
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 15,
    width: "90%",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
