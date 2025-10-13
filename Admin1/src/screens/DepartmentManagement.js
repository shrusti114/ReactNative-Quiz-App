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
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../redux/slices/departmentSlice";

const DepartmentManagement = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.departments);

  const [departmentId, setDepartmentId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (editIndex === null) {
      if (list.length > 0) {
        const lastDept = list[list.length - 1];
        const lastNum = parseInt(lastDept.department_id.slice(1)) || 0;
        setDepartmentId("D" + String(lastNum + 1).padStart(3, "0"));
      } else {
        setDepartmentId("D001");
      }
    }
  }, [list, editIndex]);

  const handleSave = () => {
    if (!departmentName.trim()) return Alert.alert("Error", "Enter department name");

    const payload = { department_id: departmentId, department_name: departmentName };

    if (editIndex !== null) {
      dispatch(updateDepartment(payload));
      setEditIndex(null);
    } else {
      dispatch(addDepartment({ department_name: departmentName }));
    }

    setDepartmentName("");
  };

  const handleEdit = (index) => {
    const dept = list[index];
    setDepartmentId(dept.department_id);
    setDepartmentName(dept.department_name);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this department?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: () => {
            const dept = list[index];
            dispatch(deleteDepartment(dept.department_id));
          },
        },
      ]
    );
  };

  const filteredList = list.filter((dept) =>
    dept.department_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.department_id}</Text>
      <Text style={styles.cell}>{item.department_name}</Text>
      <View style={styles.actions}>
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
      <Text style={styles.title}>Department Management</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={departmentId}
          editable={false}
          placeholder="Department ID"
          placeholderTextColor="#888"
        />
        <TextInput
          style={[styles.input, { flex: 2 }]}
          value={departmentName}
          onChangeText={setDepartmentName}
          placeholder="Department Name"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.btnText}>{editIndex !== null ? "Update" : "Add"}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.input, { marginVertical: 10 }]}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search..."
        placeholderTextColor="#888"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#00d4ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.department_id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{ color: "#aaa", textAlign: "center", marginTop: 20 }}>No departments found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1f1f2e" },
  title: { fontSize: 26, fontWeight: "700", color: "#00d4ff", textAlign: "center", marginBottom: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
  input: {
    backgroundColor: "#2a2a3c",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#444",
    fontSize: 16,
  },
  saveBtn: { backgroundColor: "#00d4ff", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginLeft: 5 },
  btnText: { color: "#1f1f2e", fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderColor: "#444" },
  cell: { flex: 1, color: "#fff", fontSize: 16 },
  actions: { flexDirection: "row" },
  editBtn: { backgroundColor: "#00d4ff", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginRight: 5 },
  deleteBtn: { backgroundColor: "#ff4b5c", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
});

export default DepartmentManagement;
