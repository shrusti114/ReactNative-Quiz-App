import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LineChart, Grid, PieChart } from "react-native-svg-charts";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function AdminDashboard() {
  const [report] = useState({ students: 120, teachers: 15, departments: 5, subjects: 20 });
  const [menuVisible, setMenuVisible] = useState(false);

  const statsData = [
    { label: "Students", value: report.students, color: "#4E73DF" },
    { label: "Teachers", value: report.teachers, color: "#1CC88A" },
    { label: "Departments", value: report.departments, color: "#F6C23E" },
    { label: "Subjects", value: report.subjects, color: "#E74A3B" },
  ];

  const pieData = statsData.map((item, index) => ({
    value: item.value,
    svg: { fill: item.color },
    key: `pie-${index}`,
    label: item.label,
  }));

  const menuItems = [
    { label: "Dashboard", emoji: "📊" },
    { label: "Departments", emoji: "🏢" },
    { label: "Teachers", emoji: "👨‍🏫" },
    { label: "Subjects", emoji: "📘" },
    { label: "Logout", emoji: "🚪" },
  ];

  return (
    <ScrollView style={styles.main}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Dashboard</Text>

        {/* Admin Box with Menu */}
        <View style={styles.adminBox}>
          <Icon name="account-circle" size={28} color="#4E73DF" />
          <Text style={styles.adminName}>Admin Name</Text>
          <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
            <Icon name="menu" size={28} color="#4E73DF" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Menu */}
      {menuVisible && (
        <View style={styles.menuDropdown}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              onPress={() => {
                if (item.label === "Logout") {
                  Alert.alert("Logout", "You have been logged out!");
                } else {
                  Alert.alert(item.label, `${item.label} clicked`);
                }
                setMenuVisible(false);
              }}
            >
              <Text style={styles.menuText}>
                {item.emoji} {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* KPI Cards */}
      <View style={styles.statsContainer}>
        {statsData.map((item, idx) => (
          <View key={idx} style={[styles.kpiCard, { backgroundColor: item.color }]}>
            <Text style={styles.kpiLabel}>{item.label}</Text>
            <Text style={styles.kpiValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Line Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Overview Line Chart</Text>
        <LineChart
          style={{ height: 180 }}
          data={statsData.map((item) => item.value)}
          svg={{ stroke: "#4E73DF", strokeWidth: 2 }}
          contentInset={{ top: 20, bottom: 20 }}
          curve={require("d3-shape").curveNatural}
        >
          <Grid />
        </LineChart>
      </View>

      {/* Donut Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Overview Donut Chart</Text>
        <PieChart style={{ height: 180 }} data={pieData} innerRadius={40} outerRadius={70} />
        <View style={styles.pieLegend}>
          {pieData.map((item) => (
            <Text key={item.key} style={styles.legendText}>
              {item.label}: {item.value}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, padding: 20, backgroundColor: "#F5F7FA" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  header: { fontSize: 28, fontWeight: "bold", color: "#1B1F3B" },

  adminBox: { flexDirection: "row", alignItems: "center" },
  adminName: { marginLeft: 8, fontWeight: "600", fontSize: 16, color: "#4E73DF" },

  menuDropdown: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  menuItem: { paddingVertical: 8 },
  menuText: { fontSize: 16, color: "#1B1F3B" },

  statsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 25 },
  kpiCard: {
    width: "48%",
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  kpiLabel: { color: "#fff", fontSize: 14, fontWeight: "500" },
  kpiValue: { color: "#fff", fontSize: 22, fontWeight: "bold", marginTop: 6 },

  chartContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  chartTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  pieLegend: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  legendText: { fontSize: 13, color: "#333" },
});
