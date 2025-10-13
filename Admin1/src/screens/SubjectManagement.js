import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const API_URL = "http://10.0.2.2:5002";

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [department, setDepartment] = useState("");
  const [teacher, setTeacher] = useState("");
  const [dropdowns, setDropdowns] = useState({ departments: [], teachers: [] });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDropdowns();
    fetchSubjects();
  }, []);

  const fetchDropdowns = async () => {
    const res = await fetch(`${API_URL}/subject-dropdowns`);
    const data = await res.json();
    setDropdowns(data);
  };

  const fetchSubjects = async () => {
    const res = await fetch(`${API_URL}/subjects`);
    const data = await res.json();
    setSubjects(data);
  };

  const addSubject = async () => {
    if (!subjectId || !subjectName || !department || !teacher)
      return Alert.alert("Please fill all fields");

    await fetch(`${API_URL}/subjects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject_id: subjectId, subject_name: subjectName, department, teacher }),
    });
    Alert.alert("Subject Added");
    fetchSubjects();
    resetForm();
  };

  const updateSubject = async () => {
    await fetch(`${API_URL}/subjects/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject_id: subjectId, subject_name: subjectName, department, teacher }),
    });
    Alert.alert("Subject Updated");
    fetchSubjects();
    resetForm();
  };

  const deleteSubject = async (id) => {
    await fetch(`${API_URL}/subjects/${id}`, { method: "DELETE" });
    Alert.alert("Subject Deleted");
    fetchSubjects();
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setSubjectId(item.subject_id);
    setSubjectName(item.subject_name);
    setDepartment(item.department);
    setTeacher(item.teacher);
  };

  const resetForm = () => {
    setSubjectId("");
    setSubjectName("");
    setDepartment("");
    setTeacher("");
    setEditingId(null);
  };

  const handleSearch = () => {
    const filtered = subjects.filter((s) =>
      s.subject_name.toLowerCase().includes(search.toLowerCase())
    );
    setSubjects(filtered);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📘 Subject Management</Text>

      <TextInput
        style={styles.input}
        placeholder="Subject ID"
        value={subjectId}
        onChangeText={setSubjectId}
      />
      <TextInput
        style={styles.input}
        placeholder="Subject Name"
        value={subjectName}
        onChangeText={setSubjectName}
      />

      <Picker
        selectedValue={department}
        style={styles.picker}
        onValueChange={setDepartment}
      >
        <Picker.Item label="Select Department" value="" />
        {dropdowns.departments.map((d) => (
          <Picker.Item key={d._id} label={d.department_name} value={d.department_name} />
        ))}
      </Picker>

      <Picker
        selectedValue={teacher}
        style={styles.picker}
        onValueChange={setTeacher}
      >
        <Picker.Item label="Select Teacher" value="" />
        {dropdowns.teachers.map((t) => (
          <Picker.Item key={t._id} label={t.teacher_name} value={t.teacher_name} />
        ))}
      </Picker>

      <TouchableOpacity
        style={styles.button}
        onPress={editingId ? updateSubject : addSubject}
      >
        <Text style={styles.buttonText}>{editingId ? "Update" : "Add"}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.search}
        placeholder="🔍 Search Subject"
        value={search}
        onChangeText={setSearch}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      <FlatList
        data={subjects}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>
              🆔 {item.subject_id} | 📘 {item.subject_name}
              {"\n"}🏢 {item.department} | 👨‍🏫 {item.teacher}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.edit}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteSubject(item._id)}>
                <Text style={styles.delete}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#101010", padding: 20 },
  title: { color: "#fff", fontSize: 22, textAlign: "center", fontWeight: "bold", marginBottom: 20 },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  picker: {
    backgroundColor: "#222",
    color: "#fff",
    marginVertical: 5,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  search: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  searchButton: { backgroundColor: "#007BFF", padding: 10, borderRadius: 10 },
  item: {
    backgroundColor: "#1e1e1e",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  text: { color: "#fff" },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 15 },
  edit: { color: "#FFD700", fontSize: 18 },
  delete: { color: "#FF6347", fontSize: 18 },
});
