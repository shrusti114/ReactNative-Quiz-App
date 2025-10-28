import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BarChart, Grid, PieChart } from "react-native-svg-charts";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function AdminDashboard() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const stats = [
    { label: "Students", value: 120, color: "#4169E1" }, // Royal Blue
    { label: "Teachers", value: 15, color: "#D4AF37" }, // Gold
    { label: "Departments", value: 5, color: "#9B59B6" }, // Purple
    { label: "Subjects", value: 20, color: "#E67E22" }, // Amber
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
    <View style={{ flex: 1, backgroundColor: "#0D0D0D", paddingTop: StatusBar.currentHeight || 0 }}>
      <StatusBar backgroundColor="#0D0D0D" barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 20 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 15 }}>
          <Text style={{ fontSize: 26, fontWeight: "bold", color: "#D4AF37", letterSpacing: 1 }}>Admin Dashboard</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="account-circle" size={32} color="#D4AF37" />
            <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
              <Icon name="menu" size={32} color="#D4AF37" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dropdown Menu */}
        {menuVisible && (
          <View style={{ backgroundColor: "#1A1A1A", borderRadius: 10, padding: 10, marginBottom: 20, borderWidth: 1, borderColor: "#333", shadowColor: "#D4AF37", shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 10 }}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={{ paddingVertical: 12, borderBottomColor: "#2E2E2E", borderBottomWidth: 1 }}
                onPress={() => handleMenuClick(item)}
              >
                <Text style={{ fontSize: 16, color: "#E0E0E0", fontWeight: "500" }}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* KPI Cards */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 }}>
          {stats.map((stat, index) => (
            <View key={index} style={{ width: "47%", borderRadius: 15, padding: 20, marginBottom: 15, backgroundColor: stat.color, shadowColor: "#000", shadowOpacity: 0.5, shadowOffset: { width: 0, height: 6 }, shadowRadius: 8, elevation: 8 }}>
              <Text style={{ fontSize: 16, color: "#fff", fontWeight: "600" }}>{stat.label}</Text>
              <Text style={{ fontSize: 28, fontWeight: "bold", color: "#fff", marginTop: 6 }}>{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* Charts Section */}
        <View style={{ marginBottom: 30 }}>
          {/* Bar Chart */}
          <View style={{ backgroundColor: "#1A1A1A", padding: 20, borderRadius: 15, marginBottom: 25, shadowColor: "#D4AF37", shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#D4AF37", textTransform: "uppercase" }}>Performance Overview</Text>
            <BarChart
              style={{ height: 200 }}
              data={stats.map((s) => s.value)}
              svg={{ fill: "#D4AF37" }}
              contentInset={{ top: 20, bottom: 20 }}
            >
              <Grid svg={{ stroke: "rgba(255,255,255,0.2)" }} />
            </BarChart>
          </View>

          {/* Pie Chart */}
          <View style={{ backgroundColor: "#1A1A1A", padding: 20, borderRadius: 15, marginBottom: 25, shadowColor: "#D4AF37", shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#D4AF37", textTransform: "uppercase" }}>Statistics Breakdown</Text>
            <PieChart style={{ height: 200 }} data={pieData} innerRadius={40} />
            <View style={{ marginTop: 15, flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap" }}>
              {stats.map((item) => (
                <Text key={item.label} style={{ fontSize: 14, color: "#E0E0E0", fontWeight: "500" }}>{item.label}: {item.value}</Text>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
