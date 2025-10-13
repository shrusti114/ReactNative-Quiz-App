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
  fetchTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
} from "../redux/slices/teacherSlice";
import { fetchDepartments } from "../redux/slices/departmentSlice";
import { fetchSubjects } from "../redux/slices/subjectSlice";

export default function TeacherManagement() {
  const dispatch = useDispatch();

  const { list: teachers, status, error } = useSelector(state => state.teachers);
  const { list: departments } = useSelector(state => state.departments);
  const { list: subjects } = useSelector(state => state.subjects);

  const [form, setForm] = useState({
    teacher_id: "",
    teacher_name: "",
    password: "",
    subject: "",
    date: "",
    time: "",
    departmentName: "",
  });

  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchTeachers());
    dispatch(fetchDepartments());
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleChange = (name, value) => setForm({ ...form, [name]: value });

  const handleSubmit = () => {
    if (
      !form.teacher_id.trim() ||
      !form.teacher_name.trim() ||
      !form.password.trim() ||
      !form.subject ||
      !form.date.trim() ||
      !form.time.trim() ||
      !form.departmentName
    ) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (editId) {
      dispatch(updateTeacher({ id: editId, data: form }));
      setEditId(null);
    } else {
      dispatch(addTeacher(form));
    }

    setForm({
      teacher_id: "",
      teacher_name: "",
      password: "",
      subject: "",
      date: "",
      time: "",
      departmentName: "",
    });
  };

  const handleEdit = teacher => {
    setForm({
      teacher_id: teacher.teacher_id,
      teacher_name: teacher.teacher_name,
      password: teacher.password,
      subject: teacher.subject,
      date: teacher.date,
      time: teacher.time,
      departmentName: teacher.departmentName,
    });
    setEditId(teacher._id);
  };

  const handleDelete = id => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => dispatch(deleteTeacher(id)) },
    ]);
  };

  const filteredTeachers = teachers.filter(t =>
    t.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.teacher_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👩‍🏫 Teacher Management</Text>

      <TextInput
        placeholder="Teacher ID"
        placeholderTextColor="#aaa"
        value={form.teacher_id}
        onChangeText={text => handleChange("teacher_id", text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Teacher Name"
        placeholderTextColor="#aaa"
        value={form.teacher_name}
        onChangeText={text => handleChange("teacher_name", text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={form.password}
        onChangeText={text => handleChange("password", text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Subject"
        placeholderTextColor="#aaa"
        value={form.subject}
        onChangeText={text => handleChange("subject", text)}
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
        placeholder="Department Name"
        placeholderTextColor="#aaa"
        value={form.departmentName}
        onChangeText={text => handleChange("departmentName", text)}
        style={styles.input}
      />

      <Button
        title={editId ? "Update Teacher" : "Add Teacher"}
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
          data={filteredTeachers}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View>
                <Text style={styles.text}>
                  {item.teacher_id} - {item.teacher_name} | {item.date} {item.time}
                </Text>
                <Text style={styles.subText}>
                  Subject: {item.subject} | Dept: {item.departmentName}
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
