import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TopBar() {
  return (
    <View style={styles.topBar}>
      <Text style={styles.title}>IT Quiz App</Text>
      <View style={styles.navButtons}>
        <TouchableOpacity style={styles.navBtn}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}>
          <Text style={styles.navText}>Create Quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
