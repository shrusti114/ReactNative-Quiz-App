import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons"; // toggle icon

export default function AdminDashboard({ navigation }) {
  const [report, setReport] = useState({ subjects: 10, teachers: 5, quizzes: 8, departments: 3 });
  const [sidebarOpen, setSidebarOpen] = useState(false); // toggle sidebar

  useEffect(() => {
    setReport({ subjects: 10, teachers: 5, quizzes: 8, departments: 3 });
  }, []);

  const chartData = {
    labels: ["Subjects", "Teachers", "Quizzes", "Departments"],
    datasets: [{ data: [report.subjects, report.teachers, report.quizzes, report.departments] }]
  };

  const chartConfig = {
    backgroundGradientFrom: "#f6f6f6",
    backgroundGradientTo: "#f6f6f6",
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
    barPercentage: 0.5,
  };

  const downloadReport = () => {
    Alert.alert("Download Report", "This can be implemented with expo-file-system or sharing library.");
  };

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <ScrollView style={styles.mainContent} contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Toggle Sidebar Button */}
        <TouchableOpacity style={styles.toggleButton} onPress={() => setSidebarOpen(!sidebarOpen)}>
          <Ionicons
            name={sidebarOpen ? "arrow-back-circle-outline" : "menu-outline"}
            size={28}
            color="#007bff"
          />
          <Text style={{ marginLeft: 5 }}>{sidebarOpen ? "Hide Menu" : "Show Menu"}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Admin Dashboard</Text>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Navigate", "Subjects")}>
            <Text style={styles.cardTitle}>Subjects</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => Alert.alert("Navigate", "Teachers")}>
            <Text style={styles.cardTitle}>Teachers</Text>
          </TouchableOpacity>
        </View>

        {/* Bar Chart */}
        <Text style={styles.chartTitle}>Overview Chart</Text>
        <BarChart
          data={chartData}
          width={Dimensions.get("window").width - 40} // fixed width
          height={250}
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          fromZero
          showValuesOnTopOfBars
          style={{ borderRadius: 10, marginVertical: 10 }}
        />

        {/* Download Button */}
        <TouchableOpacity style={styles.downloadButton} onPress={downloadReport}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Download Report</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sidebar Overlay */}
      {sidebarOpen && <TouchableOpacity style={styles.overlay} onPress={() => setSidebarOpen(false)} activeOpacity={1} />}

      {/* Sidebar */}
      {sidebarOpen && (
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Admin Panel</Text>
          <TouchableOpacity style={styles.link} onPress={() => Alert.alert("Navigate", "Subject Management")}>
            📚 Subject Management
              <Text style={styles.linkText}>📚 Subject Management</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={() => Alert.alert("Navigate", "Teacher Management")}>
            👩‍🏫 Teacher Management
             <Text style={styles.linkText}>👩‍🏫 Teacher Management</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={() => Alert.alert("Navigate", "Quiz Management")}>
            📝 Quiz Management
             <Text style={styles.linkText}>📝 Quiz Management</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={() => Alert.alert("Navigate", "Department Management")}>
            🏢 Department Management
            <Text style={styles.linkText}>🏢 Department Management</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={() => Alert.alert("Navigate", "Report Generation")}>
            📊 Report Generation
            <Text style={styles.linkText}>📊 Report Generation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("Home")}>
  <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Logout</Text>
</TouchableOpacity>

        </View>
      )}
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContent: { flex: 1, padding: 15, backgroundColor: "#f6f6f6" },
  toggleButton: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  cardsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  card: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3
  },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  chartTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  downloadButton: { backgroundColor: "#dc3545", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 20 },

  // Sidebar
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: screenWidth * 0.7,
    height: "100%",
    backgroundColor: "#dadbf5ff",
    paddingTop: 40,
    paddingHorizontal: 15,
    zIndex: 1000,
  },
  sidebarTitle: { color: "white", fontSize: 18, marginBottom: 20, fontWeight: "bold" },
  link: { color: "white", marginVertical: 10, fontSize: 16 },
  logoutButton: {
    marginTop: 30,
    padding: 10,
    backgroundColor: "#e74c3c",
    borderRadius: 5,
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 999,
  },
  linkText: {
  color: "rgba(5, 3, 3, 1)",  // Custom color
  fontSize: 16,        // Label size 12 pixels
  fontWeight: "500",   // Medium weight
},
});
