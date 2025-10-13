import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";

const API_URL = "http://10.0.2.2:5000";

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [quiz, setQuiz] = useState("");
  const [dropdowns, setDropdowns] = useState({ departments: [], subjects: [], quizzes: [] });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDropdowns();
    fetchTeachers();
  }, []);

  const fetchDropdowns = async () => {
    const res = await fetch(`${API_URL}/dropdowns`);
    const data = await res.json();
    setDropdowns(data);
  };

  const fetchTeachers = async () => {
    const res = await fetch(`${API_URL}/teachers`);
    const data = await res.json();
    setTeachers(data);
  };

  const addTeacher = async () => {
    if (!teacherId || !teacherName || !department || !subject || !quiz)
      return Alert.alert("Please fill all fields");

    await fetch(`${API_URL}/teachers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacher_id: teacherId, teacher_name: teacherName, department, subject, quiz }),
    });
    Alert.alert("Teacher Added");
    fetchTeachers();
    resetForm();
  };

  const updateTeacher = async () => {
    await fetch(`${API_URL}/teachers/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacher_id: teacherId, teacher_name: teacherName, department, subject, quiz }),
    });
    Alert.alert("Teacher Updated");
    fetchTeachers();
    resetForm();
  };

  const deleteTeacher = async (id) => {
    await fetch(`${API_URL}/teachers/${id}`, { method: "DELETE" });
    Alert.alert("Teacher Deleted");
    fetchTeachers();
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setTeacherId(item.teacher_id);
    setTeacherName(item.teacher_name);
    setDepartment(item.department);
    setSubject(item.subject);
    setQuiz(item.quiz);
  };

  const resetForm = () => {
    setTeacherId("");
    setTeacherName("");
    setDepartment("");
    setSubject("");
    setQuiz("");
    setEditingId(null);
  };

  const handleSearch = () => {
    const filtered = teachers.filter((t) =>
      t.teacher_name.toLowerCase().includes(search.toLowerCase())
    );
    setTeachers(filtered);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍🏫 Teacher Management</Text>

      <TextInput
        style={styles.input}
        placeholder="Teacher ID"
        value={teacherId}
        onChangeText={setTeacherId}
      />
      <TextInput
        style={styles.input}
        placeholder="Teacher Name"
        value={teacherName}
        onChangeText={setTeacherName}
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
        selectedValue={subject}
        style={styles.picker}
        onValueChange={setSubject}
      >
        <Picker.Item label="Select Subject" value="" />
        {dropdowns.subjects.map((s) => (
          <Picker.Item key={s._id} label={s.subject_name} value={s.subject_name} />
        ))}
      </Picker>

      <Picker
        selectedValue={quiz}
        style={styles.picker}
        onValueChange={setQuiz}
      >
        <Picker.Item label="Select Quiz" value="" />
        {dropdowns.quizzes.map((q) => (
          <Picker.Item key={q._id} label={q.quiz_name || q.quiz_id} value={q.quiz_name || q.quiz_id} />
        ))}
      </Picker>

      <TouchableOpacity
        style={styles.button}
        onPress={editingId ? updateTeacher : addTeacher}
      >
        <Text style={styles.buttonText}>{editingId ? "Update" : "Add"}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.search}
        placeholder="🔍 Search Teacher"
        value={search}
        onChangeText={setSearch}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      <FlatList
        data={teachers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>
              🆔 {item.teacher_id} | 👨‍🏫 {item.teacher_name}
              {"\n"}🏢 {item.department} | 📘 {item.subject} | 🧩 {item.quiz}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.edit}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTeacher(item._id)}>
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
