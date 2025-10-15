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
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import {
  setSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
  setLoading,
} from "../redux/reducers/Admin/subjectReducers";
import { setDepartments } from "../redux/reducers/Admin/departmentReducers";

const API_BASE = "http://192.168.0.129:5001";

const SubjectManagement = () => {
  const dispatch = useDispatch();
  const { subjects = [], loading } = useSelector((state) => state.subject || {});
  const { departments = [] } = useSelector((state) => state.department || {});

  const [subjectId, setSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Load departments safely
  const loadDepartments = async () => {
    try {
      const res = await fetch(`${API_BASE}/departments`);
      const text = await res.text();
      const data = JSON.parse(text);
      dispatch(setDepartments(data));
      if (data.length > 0 && !selectedDept) setSelectedDept(data[0].department_id);
    } catch (err) {
      console.error("Error fetching departments:", err);
      Alert.alert("Error", "Failed to fetch departments");
    }
  };

  // Load subjects safely
  const loadSubjects = async () => {
    try {
      dispatch(setLoading(true));
      const res = await fetch(`${API_BASE}/subjects`);
      const text = await res.text();
      const data = JSON.parse(text);
      dispatch(setSubjects(data));
    } catch (err) {
      console.error("Error fetching subjects:", err);
      Alert.alert("Error", "Failed to fetch subjects");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadDepartments();
    loadSubjects();
  }, []);

  // Auto-generate next Subject ID
  useEffect(() => {
    if (editIndex === null) {
      if (subjects.length > 0) {
        const lastSub = subjects[subjects.length - 1];
        const lastNum = parseInt(lastSub.subject_id.slice(1)) || 0;
        setSubjectId("S" + String(lastNum + 1).padStart(3, "0"));
      } else {
        setSubjectId("S001");
      }
    }
  }, [subjects, editIndex]);

  // Add or Update subject
  const handleSave = async () => {
    if (!subjectName.trim()) return Alert.alert("Error", "Enter subject name");
    if (!selectedDept) return Alert.alert("Error", "Select department");

    try {
      if (editIndex !== null) {
        // Update
        const res = await fetch(`${API_BASE}/subjects/${subjectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject_name: subjectName, department_id: selectedDept }),
        });
        const updatedSub = await res.json();
        dispatch(updateSubject(updatedSub));
        setEditIndex(null);
      } else {
        // Add
        const res = await fetch(`${API_BASE}/subjects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject_name: subjectName, department_id: selectedDept }),
        });
        const newSub = await res.json();
        dispatch(addSubject(newSub));
      }
    } catch (err) {
      console.error("Error saving subject:", err);
      Alert.alert("Error", "Failed to save subject");
    }

    setSubjectName("");
  };

  const handleEdit = (index) => {
    const sub = subjects[index];
    setSubjectId(sub.subject_id);
    setSubjectName(sub.subject_name);
    setSelectedDept(sub.department_id);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this subject?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const sub = subjects[index];
          try {
            await fetch(`${API_BASE}/subjects/${sub.subject_id}`, { method: "DELETE" });
            dispatch(deleteSubject(sub.subject_id));
          } catch (err) {
            console.error("Error deleting subject:", err);
            Alert.alert("Error", "Failed to delete subject");
          }
        },
      },
    ]);
  };

  const filteredList = subjects.filter((sub) =>
    sub.subject_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item, index }) => {
    const deptName = departments.find((d) => d.department_id === item.department_id)?.department_name || "";
    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{index + 1}</Text>
        <Text style={styles.cell}>{item.subject_name}</Text>
        <Text style={styles.cell}>{deptName}</Text>
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
  };

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.headerCell]}>Sr No</Text>
      <Text style={[styles.cell, styles.headerCell]}>Subject Name</Text>
      <Text style={[styles.cell, styles.headerCell]}>Department</Text>
      <Text style={[styles.cell, styles.headerCell]}>Actions</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subject Management</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.idInput]}
          value={subjectId}
          editable={false}
          placeholder="Subject ID"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={[styles.input, styles.nameInput]}
          value={subjectName}
          onChangeText={setSubjectName}
          placeholder="Subject Name"
          placeholderTextColor="#aaa"
        />
        <View style={[styles.input, styles.pickerContainer]}>
          <Picker
            selectedValue={selectedDept}
            onValueChange={(itemValue) => setSelectedDept(itemValue)}
            style={{ color: "#fff" }}
          >
            {departments.map((d) => (
              <Picker.Item key={d.department_id} label={d.department_name} value={d.department_id} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.btnText}>{editIndex !== null ? "Update" : "Add"}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search Subjects..."
        placeholderTextColor="#888"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#00d4ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.subject_id}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          stickyHeaderIndices={[0]}
          ListEmptyComponent={<Text style={styles.emptyText}>No subjects found.</Text>}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1e1e2a" },
  title: { fontSize: 28, fontWeight: "700", color: "#00d4ff", textAlign: "center", marginBottom: 25 },
  inputContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15, gap: 10 },
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
  idInput: { flex: 1 },
  nameInput: { flex: 2 },
  pickerContainer: { flex: 2 },
  saveBtn: { backgroundColor: "#00d4ff", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
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
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderColor: "#444" },
  headerRow: { backgroundColor: "#2c2c3c" },
  cell: { flex: 1, color: "#fff", fontSize: 16 },
  headerCell: { fontWeight: "700", color: "#00d4ff" },
  actions: { flexDirection: "row" },
  editBtn: { backgroundColor: "#00d4ff", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginRight: 5 },
  deleteBtn: { backgroundColor: "#ff4b5c", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  emptyText: { color: "#aaa", textAlign: "center", marginTop: 20 },
});

export default SubjectManagement;
