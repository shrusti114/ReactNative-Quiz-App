import React from "react";
import { View, StyleSheet } from "react-native";
import { Title, TextInput, Button, Text } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function StudentRegister() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Student Registered!\nRegister No: ${result.register_no}`);
      } else {
        alert(result.message || "Error saving data!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error!");
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Student Register</Title>

      {/* Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Name"
            mode="outlined"
            style={styles.input}
            value={value}
            onChangeText={onChange}
            error={!!errors.name}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Email"
            mode="outlined"
            style={styles.input}
            value={value}
            onChangeText={onChange}
            error={!!errors.email}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            style={styles.input}
            value={value}
            onChangeText={onChange}
            error={!!errors.password}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      {/* Confirm Password */}
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Confirm Password"
            mode="outlined"
            secureTextEntry
            style={styles.input}
            value={value}
            onChangeText={onChange}
            error={!!errors.confirmPassword}
          />
        )}
      />
      {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

      {/* Submit */}
      <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
        Register
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { textAlign: "center", marginBottom: 20, fontSize: 22 },
  input: { marginBottom: 10 },
  button: { marginTop: 20, padding: 5 },
  error: { color: "red", marginBottom: 8 },
});
