import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LineChart, Grid, PieChart } from "react-native-svg-charts";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function AdminDashboard() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  // Dashboard Data
  const stats = [
    { label: "Students", value: 120, color: "#4E73DF" },
    { label: "Teachers", value: 15, color: "#1CC88A" },
    { label: "Departments", value: 5, color: "#F6C23E" },
    { label: "Subjects", value: 20, color: "#E74A3B" },
  ];

  const pieData = stats.map((item, index) => ({
    value: item.value,
    svg: { fill: item.color },
    key: `pie-${index}`,
  }));

  const menuItems = [
    { label: "Dashboard", route: "AdminDashboard" },
    { label: "Departments", route: "DepartmentManagement" },
    { label: "Teachers", route: "TeacherManagement" },
    { label: "Subjects", route: "SubjectManagement" },
    { label: "Logout", route: "AdminLogin" },
  ];

  const handleMenuClick = (item) => {
    setMenuVisible(false);
    if (item.label === "Logout") {
      Alert.alert("Logout", "You have been logged out!");
    } else {
      navigation.navigate(item.route);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={styles.headerRight}>
          <Icon name="account-circle" size={30} color="#4E73DF" />
          <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
            <Icon name="menu" size={30} color="#4E73DF" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Menu */}
      {menuVisible && (
        <View style={styles.menu}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              onPress={() => handleMenuClick(item)}
            >
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* KPI Cards */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { backgroundColor: stat.color }]}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>

      {/* Charts Section */}
      <View style={styles.chartSection}>
        <View style={styles.chartBox}>
          <Text style={styles.chartTitle}>Performance Overview</Text>
          <LineChart
            style={{ height: 200 }}
            data={stats.map((s) => s.value)}
            svg={{ stroke: "#4E73DF", strokeWidth: 3 }}
            contentInset={{ top: 20, bottom: 20 }}
          >
            <Grid />
          </LineChart>
        </View>

        <View style={styles.chartBox}>
          <Text style={styles.chartTitle}>Statistics Breakdown</Text>
          <PieChart style={{ height: 200 }} data={pieData} innerRadius={40} />
          <View style={styles.pieLegend}>
            {stats.map((item) => (
              <Text key={item.label} style={styles.legendText}>
                {item.label}: {item.value}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F9",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1B1F3B",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    color: "#1B1F3B",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "47%",
    borderRadius: 15,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  statLabel: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  chartSection: {
    marginBottom: 40,
  },
  chartBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1B1F3B",
  },
  pieLegend: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  legendText: {
    fontSize: 14,
    color: "#555",
  },
});
