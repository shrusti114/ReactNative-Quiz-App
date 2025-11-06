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

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teacherRes, deptRes] = await Promise.all([
        fetch(`${API_BASE}/teachers`),
        fetch(`${API_BASE}/departments`),
      ]);
      const [teacherData, deptData] = await Promise.all([
        teacherRes.json(),
        deptRes.json(),
      ]);
      setTeachers(teacherData);
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
      if (teachers.length > 0) {
        const last = teachers[teachers.length - 1];
        const num = parseInt(last.teacher_id?.slice(1)) || 0;
        setTeacherId("T" + String(num + 1).padStart(3, "0"));
      } else setTeacherId("T001");
    }
  }, [teachers, editIndex]);

  const handleSave = async () => {
    if (!teacherName || !teacherEmail || !teacherPassword || !selectedDept) {
      Alert.alert("Error", "Enter all details");
      return;
    }

    if (!teacherEmail.includes("@")) {
      Alert.alert("Error", "Enter valid email address");
      return;
    }

    if (teacherPassword.length < 4) {
      Alert.alert("Error", "Password must be at least 4 characters");
      return;
    }

    const dept = departments.find((d) => d.department_id === selectedDept);
    if (!dept) {
      Alert.alert("Error", "Invalid department selected");
      return;
    }

    try {
      if (editIndex !== null) {
        // 🔄 Update teacher
        await fetch(`${API_BASE}/teachers/${teacherId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teacher_name: teacherName,
            teacher_email: teacherEmail,
            password: teacherPassword, // ✅ fixed field name
            department_id: dept.department_id,
          }),
        });
        await loadData();
        setEditIndex(null);
      } else {
        // ➕ Add new teacher
        const res = await fetch(`${API_BASE}/teachers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teacher_name: teacherName,
            teacher_email: teacherEmail,
            password: teacherPassword, // ✅ fixed field name
            department_id: dept.department_id,
          }),
        });
        const newTeacher = await res.json();
        if (newTeacher.error) {
          Alert.alert("Error", newTeacher.error);
        } else {
          setTeachers([...teachers, newTeacher]);
        }
      }
    } catch (err) {
      Alert.alert("Error", "Failed to save teacher");
    }

    setTeacherName("");
    setTeacherEmail("");
    setTeacherPassword("");
    setSelectedDept("");
  };

  const handleEdit = (i) => {
    const t = teachers[i];
    setTeacherId(t.teacher_id);
    setTeacherName(t.teacher_name);
    setTeacherEmail(t.teacher_email);
    setTeacherPassword(t.password || ""); // ✅ matches backend
    setSelectedDept(t.department_id);
    setEditIndex(i);
  };

  const handleDelete = async (i) => {
    const t = teachers[i];
    Alert.alert("Delete?", "Confirm delete?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          await fetch(`${API_BASE}/teachers/${t.teacher_id}`, { method: "DELETE" });
          setTeachers(teachers.filter((_, index) => index !== i));
        },
      },
    ]);
  };

  const filtered =
    searchText === ""
      ? teachers
      : teachers.filter((t) =>
          t.teacher_name.toLowerCase().includes(searchText.toLowerCase())
        );

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.headerText, { flex: 0.6, textAlign: "center" }]}>
        Sr No
      </Text>
      <Text style={[styles.cell, styles.headerText, { flex: 1.8 }]}>Name</Text>
      <Text style={[styles.cell, styles.headerText, { flex: 2 }]}>Email</Text>
      <Text style={[styles.cell, styles.headerText, { flex: 1.5 }]}>Department</Text>
      <Text style={[styles.cell, styles.headerText, { flex: 1.5, textAlign: "center" }]}>
        Actions
      </Text>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <View style={[styles.row, index % 2 === 0 ? styles.even : styles.odd]}>
      <Text style={[styles.cell, { flex: 0.6, textAlign: "center" }]}>{index + 1}</Text>
      <Text style={[styles.cell, { flex: 1.8 }]}>{item.teacher_name}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.teacher_email}</Text>
      <Text style={[styles.cell, { flex: 1.5 }]}>{item.department}</Text>
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
      <Text style={styles.title}>Teacher Management</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Teacher Name"
        placeholderTextColor="#aaa"
        value={teacherName}
        onChangeText={setTeacherName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Teacher Email"
        placeholderTextColor="#aaa"
        value={teacherEmail}
        onChangeText={setTeacherEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Teacher Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={teacherPassword}
        onChangeText={setTeacherPassword}
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
        placeholder="Search Teachers..."
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
            keyExtractor={(item) => item.teacher_id}
            ListEmptyComponent={<Text style={styles.empty}>No teachers found.</Text>}
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
  btnTxt: { color: "#4b4be6ff", fontWeight: "700", fontSize: 14 },
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
  },
  empty: { color: "#aaa", textAlign: "center", padding: 19, fontSize: 15 },
});

export default TeacherManagement;
