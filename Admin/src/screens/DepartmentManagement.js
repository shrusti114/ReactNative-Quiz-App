import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../redux/slices/departmentSlice";

export default function DepartmentManagement() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector(state => state.departments);

  const [form, setForm] = useState({ department_id: "", department_name: "" });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleChange = (name, value) => setForm({ ...form, [name]: value });

  const handleSubmit = () => {
    if (!form.department_id.trim() || !form.department_name.trim()) {
      Alert.alert("Error", "Both Department ID and Name are required!");
      return;
    }

    if (editId) {
      dispatch(updateDepartment({ id: editId, data: form }));
      setEditId(null);
    } else {
      dispatch(addDepartment(form));
    }

    setForm({ department_id: "", department_name: "" });
  };

  const handleEdit = dep => {
    setForm({ department_id: dep.department_id, department_name: dep.department_name });
    setEditId(dep._id); // use _id from MongoDB for update
  };

  const handleDelete = id => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => dispatch(deleteDepartment(id)) },
    ]);
  };

  const filteredDepartments = list.filter(dep =>
    dep.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dep.department_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏢 Department Management</Text>

      <TextInput
        placeholder="Department ID"
        placeholderTextColor="#aaa"
        value={form.department_id}
        onChangeText={text => handleChange("department_id", text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Department Name"
        placeholderTextColor="#aaa"
        value={form.department_name}
        onChangeText={text => handleChange("department_name", text)}
        style={styles.input}
      />

      <Button
        title={editId ? "Update Department" : "Add Department"}
        onPress={handleSubmit}
        color="#7b4397"
      />

      <TextInput
        placeholder="🔍 Search by Name or ID"
        placeholderTextColor="#aaa"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />

      {status === "loading" ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>{error}</Text>
      ) : (
        <FlatList
          data={filteredDepartments}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View>
                <Text style={styles.text}>{item.department_id} - {item.department_name}</Text>
                <Text style={styles.subText}>{item.created_at ? new Date(item.created_at).toLocaleString() : ""}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
                  <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item._id)}>
                  <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  title: { fontSize: 22, color: "#fff", marginBottom: 15, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#555", borderRadius: 8, padding: 10, color: "#fff", marginBottom: 10 },
  searchInput: { borderWidth: 1, borderColor: "#555", borderRadius: 8, padding: 10, color: "#fff", marginVertical: 15 },
  listItem: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#1e1e1e", padding: 12, borderRadius: 8, marginVertical: 5 },
  text: { color: "#fff", fontSize: 16 },
  subText: { color: "#aaa", fontSize: 12 },
  actions: { flexDirection: "row" },
  editBtn: { backgroundColor: "#6a1b9a", padding: 6, borderRadius: 6, marginRight: 5 },
  deleteBtn: { backgroundColor: "#d32f2f", padding: 6, borderRadius: 6 },
  btnText: { color: "#fff" },
});
