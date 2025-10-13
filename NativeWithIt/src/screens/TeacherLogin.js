import React from "react";
import { View, StyleSheet } from "react-native";
import { Title, Text } from "react-native-paper";

export default function TeacherLogin() {
  return (
    <View style={styles.container}>
      <Title>Teacher Login</Title>
      <Text>Here you can add the Teacher login form</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
