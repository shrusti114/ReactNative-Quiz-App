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
  fetchSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
} from "../redux/slices/subjectSlice";
import { fetchTeachers } from "../redux/slices/teacherSlice";
import { fetchDepartments } from "../redux/slices/departmentSlice";

export default function SubjectManagement() {
  const dispatch = useDispatch();

  const { list: subjects, status, error } = useSelector(state => state.subjects);
  const { list: teachers } = useSelector(state => state.teachers);
  const { list: departments } = useSelector(state => state.departments);

  const [form, setForm] = useState({ subject_id: "", subject_name: "", date: "", time: "", teacher_id: "", department_id: "" });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchTeachers());
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleChange = (name, value) => setForm({ ...form, [name]: value });

  const handleSubmit = () => {
    if (!form.subject_id.trim() || !form.subject_name.trim() || !form.date.trim() || !form.time.trim() || !form.teacher_id || !form.department_id) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (editId) {
      dispatch(updateSubject({ id: editId, data: form }));
      setEditId(null);
    } else {
      dispatch(addSubject(form));
    }

    setForm({ subject_id: "", subject_name: "", date: "", time: "", teacher_id: "", department_id: "" });
  };

  const handleEdit = sub => {
    setForm({ subject_id: sub.subject_id, subject_name: sub.subject_name, date: sub.date, time: sub.time, teacher_id: sub.teacher_id, department_id: sub.department_id });
    setEditId(sub._id);
  };

  const handleDelete = id => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => dispatch(deleteSubject(id)) },
    ]);
  };

  const filteredSubjects = subjects.filter(sub =>
    sub.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.subject_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Subject Management</Text>

      <TextInput
        placeholder="Subject ID"
        placeholderTextColor="#aaa"
        value={form.subject_id}
        onChangeText={text => handleChange("subject_id", text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Subject Name"
        placeholderTextColor="#aaa"
        value={form.subject_name}
        onChangeText={text => handleChange("subject_name", text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        placeholderTextColor="#aaa"
        value={form.date}
        onChangeText={text => handleChange("date", text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Time (HH:MM)"
        placeholderTextColor="#aaa"
        value={form.time}
        onChangeText={text => handleChange("time", text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Teacher ID"
        placeholderTextColor="#aaa"
        value={form.teacher_id}
        onChangeText={text => handleChange("teacher_id", text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Department ID"
        placeholderTextColor="#aaa"
        value={form.department_id}
        onChangeText={text => handleChange("department_id", text)}
        style={styles.input}
      />

      <Button
        title={editId ? "Update Subject" : "Add Subject"}
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
          data={filteredSubjects}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View>
                <Text style={styles.text}>
                  {item.subject_id} - {item.subject_name} | {item.date} {item.time}
                </Text>
                <Text style={styles.subText}>
                  Teacher: {item.teacher_id} | Dept: {item.department_id}
                </Text>
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
