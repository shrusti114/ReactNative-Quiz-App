import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { API_BASE } from "../config";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all departments
  const loadDepartments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/departments`);
      if (!res.ok) throw new Error("Failed to fetch departments");
      const data = await res.json();
      console.log("Fetched departments:", data);
      setDepartments(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch departments from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // Generate next departmentId if adding new
  useEffect(() => {
    if (editIndex === null) {
      if (departments.length > 0) {
        const lastDept = departments[departments.length - 1];
        const lastNum = parseInt(lastDept.department_id.slice(1)) || 0;
        setDepartmentId("D" + String(lastNum + 1).padStart(3, "0"));
      } else {
        setDepartmentId("D001");
      }
    }
  }, [departments, editIndex]);

  // Add or update department
  const handleSave = async () => {
    if (!departmentName.trim()) {
      Alert.alert("Error", "Enter department name");
      return;
    }

    try {
      if (editIndex !== null) {
        // Update existing department
        const res = await fetch(`${API_BASE}/departments/${departmentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ department_name: departmentName }),
        });

        if (!res.ok) throw new Error("Failed to update department");

        const updatedDept = await res.json();
        const updatedList = [...departments];
        updatedList[editIndex] = updatedDept;
        setDepartments(updatedList);
        setEditIndex(null);
      } else {
        // Add new department
        const res = await fetch(`${API_BASE}/departments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ department_name: departmentName }),
        });

        if (!res.ok) throw new Error("Failed to add department");

        const newDept = await res.json();
        setDepartments([...departments, newDept]);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save department.");
    }

    setDepartmentName("");
  };

  // Edit department
  const handleEdit = (index) => {
    const dept = departments[index];
    setDepartmentId(dept.department_id);
    setDepartmentName(dept.department_name);
    setEditIndex(index);
  };

  // Delete department
  const handleDelete = (index) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this department?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const dept = departments[index];
            try {
              const res = await fetch(`${API_BASE}/departments/${dept.department_id}`, {
                method: "DELETE",
              });
              if (!res.ok) throw new Error("Failed to delete department");
              setDepartments(departments.filter((_, i) => i !== index));
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to delete department.");
            }
          },
        },
      ]
    );
  };

  // Filter departments by search text
  const filteredList =
    searchText.trim() === ""
      ? departments
      : departments.filter((dept) =>
          dept.department_name.toLowerCase().includes(searchText.toLowerCase())
        );

  // Table header
  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.headerCell, { flex: 0.5 }]}>Sr No</Text>
      <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Department Name</Text>
      <Text style={[styles.cell, styles.headerCell, { flex: 1.2 }]}>Actions</Text>
    </View>
  );

  // Table row
  const renderItem = ({ item, index }) => (
    <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
      <Text style={[styles.cell, { flex: 0.5 }]}>{index + 1}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.department_name}</Text>
      <View style={[styles.actions, { flex: 1.2 }]}>
        <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(index)}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(index)}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Department Management</Text>

        {/* Add / Edit Section */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.nameInput]}
            value={departmentName}
            onChangeText={setDepartmentName}
            placeholder="Enter Department Name"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.btnText}>{editIndex !== null ? "Update" : "Add"}</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search Departments..."
          placeholderTextColor="#888"
        />

        {/* Table Display */}
        {loading ? (
          <ActivityIndicator size="large" color="#00d4ff" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.tableContainer}>
            <FlatList
              data={filteredList}
              keyExtractor={(item) => item.department_id}
              renderItem={renderItem}
              ListHeaderComponent={renderHeader}
              stickyHeaderIndices={[0]}
              ListEmptyComponent={<Text style={styles.emptyText}>No departments found.</Text>}
              contentContainerStyle={{ paddingBottom: 50 }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1e1e2a" },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#00d4ff",
    textAlign: "center",
    marginBottom: 25,
  },
  inputContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  input: {
    backgroundColor: "#2c2c3c",
    color: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#444",
    fontSize: 16,
  },
  nameInput: { flex: 1, marginRight: 10 },
  saveBtn: {
    backgroundColor: "#00d4ff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  btnText: { color: "#1e1e2a", fontWeight: "600" },
  searchInput: {
    backgroundColor: "#2c2c3c",
    color: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#444",
    fontSize: 16,
    marginBottom: 15,
  },
  tableContainer: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#444",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  headerRow: {
    backgroundColor: "#27293d",
    borderBottomWidth: 1,
    borderColor: "#444",
  },
  rowEven: { backgroundColor: "#2c2c3c" },
  rowOdd: { backgroundColor: "#252636" },
  cell: { color: "#fff", fontSize: 16 },
  headerCell: { fontWeight: "700", color: "#00d4ff" },
  actions: { flexDirection: "row", justifyContent: "center" },
  editBtn: {
    backgroundColor: "#00d4ff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
  },
  deleteBtn: {
    backgroundColor: "#ff4b5c",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default DepartmentManagement;
