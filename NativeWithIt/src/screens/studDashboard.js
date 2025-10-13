import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function StudDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>

      <View style={styles.row}>
        {/* Student Only */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("StudentRegister")}
        >
          <Image
            source={require("../assets/student1.jpeg")}
            style={styles.image}
          />
          <Text style={styles.label}>Student</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
  },
  card: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 15,
    resizeMode: "cover",
  },
  label: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});
