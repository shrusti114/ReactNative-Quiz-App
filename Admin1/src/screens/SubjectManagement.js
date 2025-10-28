import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API_BASE } from "../config";

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subjectRes, deptRes] = await Promise.all([
        fetch(`${API_BASE}/subjects`),
        fetch(`${API_BASE}/departments`),
      ]);
      const [subjectData, deptData] = await Promise.all([
        subjectRes.json(),
        deptRes.json(),
      ]);
      setSubjects(subjectData);
      setDepartments(deptData);
    } catch (err) {
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (editIndex === null) {
      if (subjects.length > 0) {
        const last = subjects[subjects.length - 1];
        const num = parseInt(last.subject_id?.slice(1)) || 0;
        setSubjectId("S" + String(num + 1).padStart(3, "0"));
      } else setSubjectId("S001");
    }
  }, [subjects, editIndex]);

  const handleSave = async () => {
    if (!subjectName || !selectedDept) {
      Alert.alert("Error", "Enter all details");
      return;
    }

    const dept = departments.find((d) => d.department_id === selectedDept);
    try {
      if (editIndex !== null) {
        await fetch(`${API_BASE}/subjects/${subjectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject_name: subjectName,
            department_id: dept.department_id,
            department: dept.department_name,
          }),
        });
        const updated = [...subjects];
        updated[editIndex] = {
          ...updated[editIndex],
          subject_name: subjectName,
          department_id: dept.department_id,
          department: dept.department_name,
        };
        setSubjects(updated);
        setEditIndex(null);
      } else {
        const res = await fetch(`${API_BASE}/subjects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject_id: subjectId,
            subject_name: subjectName,
            department_id: dept.department_id,
            department: dept.department_name,
          }),
        });
        const newSub = await res.json();
        setSubjects([...subjects, newSub]);
      }
    } catch {
      Alert.alert("Error", "Failed to save subject");
    }
    setSubjectName("");
    setSelectedDept("");
  };

  const handleEdit = (i) => {
    const s = subjects[i];
    setSubjectId(s.subject_id);
    setSubjectName(s.subject_name);
    setSelectedDept(s.department_id);
    setEditIndex(i);
  };

  const handleDelete = async (i) => {
    const s = subjects[i];
    Alert.alert("Delete?", "Confirm delete?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          await fetch(`${API_BASE}/subjects/${s.subject_id}`, { method: "DELETE" });
          setSubjects(subjects.filter((_, index) => index !== i));
        },
      },
    ]);
  };

  const filtered =
    searchText === ""
      ? subjects
      : subjects.filter((s) =>
          s.subject_name.toLowerCase().includes(searchText.toLowerCase())
        );

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.headerText, { flex: 0.8, textAlign: "center" }]}>
        Sr No
      </Text>
      <Text style={[styles.cell, styles.headerText, { flex: 2 }]}>Subject Name</Text>
      <Text style={[styles.cell, styles.headerText, { flex: 2 }]}>Department</Text>
      <Text style={[styles.cell, styles.headerText, { flex: 1.5, textAlign: "center" }]}>
        Actions
      </Text>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <View style={[styles.row, index % 2 === 0 ? styles.even : styles.odd]}>
      <Text style={[styles.cell, { flex: 0.8, textAlign: "center" }]}>{index + 1}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.subject_name}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.department}</Text>
      <View style={[styles.actions, { flex: 1.5 }]}>
        <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(index)}>
          <Text style={styles.btnTxt}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.delBtn} onPress={() => handleDelete(index)}>
          <Text style={styles.btnTxt}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subject Management</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Subject Name"
        placeholderTextColor="#aaa"
        value={subjectName}
        onChangeText={setSubjectName}
      />

      <View style={styles.dropdown}>
        <Picker
          selectedValue={selectedDept}
          onValueChange={(v) => setSelectedDept(v)}
          style={styles.picker}
        >
          <Picker.Item label="Select Department" value="" />
          {departments.map((d) => (
            <Picker.Item
              key={d.department_id}
              label={d.department_name}
              value={d.department_id}
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={handleSave}>
        <Text style={styles.btnTxt}>{editIndex !== null ? "Update" : "Add"}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Search Subjects..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#00d4ff" style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.table}>
          {renderHeader()}
          <FlatList
            data={filtered}
            renderItem={renderItem}
            keyExtractor={(item) => item.subject_id}
            ListEmptyComponent={<Text style={styles.empty}>No subjects found.</Text>}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e2a", padding: 20 },
  title: {
    fontSize: 22,
    color: "#00d4ff",
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#2c2c3c",
    color: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#444",
  },
  addBtn: {
    backgroundColor: "#00d4ff",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  btnTxt: { color: "#1e1e2a", fontWeight: "700", fontSize: 14 },
  btnTxtSmall: { color: "#fff", fontSize: 13, fontWeight: "600" },
  table: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  headerRow: { backgroundColor: "#27293d", borderBottomWidth: 1, borderColor: "#444" },
  headerText: { fontWeight: "700", color: "#00d4ff", fontSize: 15 },
  even: { backgroundColor: "#2c2c3c" },
  odd: { backgroundColor: "#252636" },
  cell: { color: "#fff", fontSize: 15, paddingHorizontal: 8 },
  actions: { flexDirection: "column", alignItems: "center" },
  editBtn: {
    backgroundColor: "#00d4ff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  delBtn: {
    backgroundColor: "#ff4b5c",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 6,
    padding: 19
  },
  empty: { color: "#aaa", textAlign: "center", padding: 19, fontSize: 15 },
});

export default SubjectManagement;

