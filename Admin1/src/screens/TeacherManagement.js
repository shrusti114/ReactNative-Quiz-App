import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API_BASE } from "../config";

export default function TeacherManagement() {
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editingTeacherId, setEditingTeacherId] = useState(null);

  // ✅ Fetch Teachers
  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_BASE}/teachers`);
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  // ✅ Fetch Departments for Dropdown
  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_BASE}/departments`);
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // ✅ Auto-generate Teacher ID (T001, T002...)
  const generateTeacherId = () => {
    if (teachers.length === 0) return "T001";
    const lastId = teachers[teachers.length - 1].teacher_id;
    const newId = parseInt(lastId.slice(1)) + 1;
    return `T${newId.toString().padStart(3, "0")}`;
  };

  // ✅ Add / Update Teacher
  const saveTeacher = async () => {
    if (!teacherName || !teacherEmail || !password || !departmentId) {
      Alert.alert("⚠️ Please fill all fields");
      return;
    }

    const selectedDept = departments.find((d) => d.department_id === departmentId);
    const teacherData = {
      teacher_name: teacherName,
      teacher_email: teacherEmail,
      password: password,
      department_id: departmentId,
      department: selectedDept ? selectedDept.department_name : "",
    };

    try {
      if (editingTeacherId) {
        await fetch(`${API_BASE}/updateTeacher/${editingTeacherId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teacherData),
        });
        Alert.alert("✅ Teacher updated successfully!");
      } else {
        const newTeacher = { ...teacherData, teacher_id: generateTeacherId() };
        await fetch(`${API_BASE}/addTeacher`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTeacher),
        });
        Alert.alert("✅ Teacher added successfully!");
      }

      fetchTeachers();
      resetForm();
    } catch (error) {
      Alert.alert("❌ Error saving teacher");
      console.error(error);
    }
  };

  // ✅ Delete Teacher
  const deleteTeacher = async (teacher_id) => {
    try {
      await fetch(`${API_BASE}/deleteTeacher/${teacher_id}`, { method: "DELETE" });
      Alert.alert("🗑️ Teacher deleted successfully");
      fetchTeachers();
    } catch (error) {
      Alert.alert("❌ Error deleting teacher");
      console.error(error);
    }
  };

  // ✅ Edit Teacher
  const editTeacher = (teacher) => {
    setTeacherName(teacher.teacher_name);
    setTeacherEmail(teacher.teacher_email);
    setPassword(teacher.password);
    setDepartment(teacher.department);
    setDepartmentId(teacher.department_id);
    setEditingTeacherId(teacher.teacher_id);
  };

  // ✅ Reset Form
  const resetForm = () => {
    setTeacherName("");
    setTeacherEmail("");
    setPassword("");
    setDepartment("");
    setDepartmentId("");
    setEditingTeacherId(null);
  };

  useEffect(() => {
    fetchTeachers();
    fetchDepartments();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>👩‍🏫 Teacher Management</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Teacher Name"
        placeholderTextColor="#888"
        value={teacherName}
        onChangeText={setTeacherName}
      />
      <TextInput
        style={styles.input}
        placeholder="Teacher Email"
        placeholderTextColor="#888"
        value={teacherEmail}
        onChangeText={setTeacherEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Department Dropdown */}
      <Text style={styles.label}>Select Department</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={departmentId}
          onValueChange={(value) => setDepartmentId(value)}
          dropdownIconColor="#00d4ff"
          style={{ color: "white" }}
        >
          <Picker.Item label="-- Select Department --" value="" />
          {departments.map((dept) => (
            <Picker.Item
              key={dept.department_id}
              label={dept.department_name}
              value={dept.department_id}
            />
          ))}
        </Picker>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.addBtn} onPress={saveTeacher}>
        <Text style={styles.btnText}>
          {editingTeacherId ? "Update Teacher" : "Add Teacher"}
        </Text>
      </TouchableOpacity>

      {editingTeacherId && (
        <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
          <Text style={styles.btnText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}

      {/* Teacher List */}
      <Text style={styles.subHeader}>📋 Teacher List</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.headerCell]}>Name</Text>
        <Text style={[styles.cell, styles.headerCell]}>Email</Text>
        <Text style={[styles.cell, styles.headerCell]}>Department</Text>
        <Text style={[styles.cell, styles.headerCell]}>Action</Text>
      </View>

      <FlatList
        data={teachers}
        keyExtractor={(item) => item.teacher_id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.cell}>{item.teacher_name}</Text>
            <Text style={styles.cell}>{item.teacher_email}</Text>
            <Text style={styles.cell}>{item.department}</Text>
            <View style={[styles.cell, { flexDirection: "row" }]}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => editTeacher(item)}
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteTeacher(item.teacher_id)}
              >
                <Text style={styles.btnText}>Del</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    padding: 20,
  },
  header: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    color: "#00d4ff",
    marginBottom: 5,
    marginTop: 5,
  },
  subHeader: {
    color: "#00d4ff",
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#1f1f1f",
    color: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#00d4ff",
    borderWidth: 1,
  },
  dropdown: {
    backgroundColor: "#1f1f1f",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00d4ff",
    marginBottom: 10,
  },
  addBtn: {
    backgroundColor: "#00d4ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelBtn: {
    backgroundColor: "#666",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomColor: "#00d4ff",
    borderBottomWidth: 2,
    paddingVertical: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "#333",
    borderBottomWidth: 1,
    paddingVertical: 6,
    alignItems: "center",
  },
  cell: {
    flex: 1,
    color: "white",
    textAlign: "center",
    fontSize: 13,
  },
  headerCell: {
    fontWeight: "bold",
    color: "#00d4ff",
  },
  editBtn: {
    backgroundColor: "#4CAF50",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 3,
  },
  deleteBtn: {
    backgroundColor: "#ff4444",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 3,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});
