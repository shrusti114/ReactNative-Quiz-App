// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const API_BASE = "http://192.168.0.129:5001";

// const DepartmentManagement = () => {
//   const [departments, setDepartments] = useState([]);
//   const [departmentId, setDepartmentId] = useState("");
//   const [departmentName, setDepartmentName] = useState("");
//   const [editIndex, setEditIndex] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [loading, setLoading] = useState(false);

//   const loadDepartments = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE}/departments`);
//       if (!res.ok) throw new Error("Failed to fetch");
//       const data = await res.json();
//       setDepartments(data);
//     } catch (err) {
//       console.error("Error fetching departments:", err);
//       Alert.alert("Error", "Failed to fetch departments from server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDepartments();
//   }, []);

//   useEffect(() => {
//     if (editIndex === null) {
//       if (departments.length > 0) {
//         const lastDept = departments[departments.length - 1];
//         const lastNum = parseInt(lastDept.department_id.slice(1)) || 0;
//         setDepartmentId("D" + String(lastNum + 1).padStart(3, "0"));
//       } else setDepartmentId("D001");
//     }
//   }, [departments, editIndex]);

//   const handleSave = async () => {
//     if (!departmentName.trim()) {
//       Alert.alert("Error", "Enter department name");
//       return;
//     }
//     try {
//       if (editIndex !== null) {
//         const res = await fetch(`${API_BASE}/departments/${departmentId}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ department_name: departmentName }),
//         });
//         const updatedDept = await res.json();
//         const updatedList = [...departments];
//         updatedList[editIndex] = updatedDept;
//         setDepartments(updatedList);
//         setEditIndex(null);
//       } else {
//         const res = await fetch(`${API_BASE}/departments`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ department_name: departmentName }),
//         });
//         const newDept = await res.json();
//         setDepartments([...departments, newDept]);
//       }
//     } catch (err) {
//       console.error("Error saving department:", err);
//       Alert.alert("Error", "Failed to save department.");
//     }
//     setDepartmentName("");
//   };

//   const handleEdit = (index) => {
//     const dept = departments[index];
//     setDepartmentId(dept.department_id);
//     setDepartmentName(dept.department_name);
//     setEditIndex(index);
//   };

//   const handleDelete = (index) => {
//     Alert.alert("Confirm Delete", "Are you sure you want to delete this department?", [
//       { text: "Cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: async () => {
//           const dept = departments[index];
//           try {
//             await fetch(`${API_BASE}/departments/${dept.department_id}`, { method: "DELETE" });
//             setDepartments(departments.filter((_, i) => i !== index));
//           } catch (err) {
//             console.error("Error deleting department:", err);
//             Alert.alert("Error", "Failed to delete department.");
//           }
//         },
//       },
//     ]);
//   };

//   const filteredList = departments.filter((dept) =>
//     dept.department_name.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const renderItem = ({ item, index }) => (
//     <View style={styles.row}>
//       <Text style={styles.cell}>{item.department_id}</Text>
//       <Text style={styles.cell}>{item.department_name}</Text>
//       <View style={styles.actions}>
//         <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(index)}>
//           <Text style={styles.btnText}>Edit</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(index)}>
//           <Text style={styles.btnText}>Delete</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   // Table header
//   const renderHeader = () => (
//     <View style={[styles.row, styles.headerRow]}>
//       <Text style={[styles.cell, styles.headerCell]}>Department ID</Text>
//       <Text style={[styles.cell, styles.headerCell]}>Department Name</Text>
//       <Text style={[styles.cell, styles.headerCell]}>Actions</Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Department Management</Text>

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={[styles.input, styles.idInput]}
//           value={departmentId}
//           editable={false}
//           placeholder="Department ID"
//           placeholderTextColor="#aaa"
//         />
//         <TextInput
//           style={[styles.input, styles.nameInput]}
//           value={departmentName}
//           onChangeText={setDepartmentName}
//           placeholder="Department Name"
//           placeholderTextColor="#aaa"
//         />
//         <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
//           <Text style={styles.btnText}>{editIndex !== null ? "Update" : "Add"}</Text>
//         </TouchableOpacity>
//       </View>

//       <TextInput
//         style={styles.searchInput}
//         value={searchText}
//         onChangeText={setSearchText}
//         placeholder="Search Departments..."
//         placeholderTextColor="#888"
//       />

//       {loading ? (
//         <ActivityIndicator size="large" color="#00d4ff" style={{ marginTop: 20 }} />
//       ) : (
//         <FlatList
//           data={filteredList}
//           keyExtractor={(item) => item.department_id}
//           renderItem={renderItem}
//           ListHeaderComponent={renderHeader}
//           stickyHeaderIndices={[0]}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>No departments found.</Text>
//           }
//           contentContainerStyle={{ paddingBottom: 50 }}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#1e1e2a" },
//   title: { fontSize: 28, fontWeight: "700", color: "#00d4ff", textAlign: "center", marginBottom: 25 },
//   inputContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
//   input: {
//     backgroundColor: "#2c2c3c",
//     color: "#fff",
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#444",
//     fontSize: 16,
//   },
//   idInput: { flex: 1, marginRight: 10 },
//   nameInput: { flex: 2, marginRight: 10 },
//   saveBtn: { backgroundColor: "#00d4ff", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
//   btnText: { color: "#1e1e2a", fontWeight: "600" },
//   searchInput: {
//     backgroundColor: "#2c2c3c",
//     color: "#fff",
//     padding: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#444",
//     fontSize: 16,
//     marginBottom: 15,
//   },
//   row: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderColor: "#444" },
//   headerRow: { backgroundColor: "#2c2c3c" },
//   cell: { flex: 1, color: "#fff", fontSize: 16 },
//   headerCell: { fontWeight: "700", color: "#00d4ff" },
//   actions: { flexDirection: "row" },
//   editBtn: { backgroundColor: "#00d4ff", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginRight: 5 },
//   deleteBtn: { backgroundColor: "#ff4b5c", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
//   emptyText: { color: "#aaa", textAlign: "center", marginTop: 20 },
// });

// export default DepartmentManagement;

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

const API_BASE = "http://192.168.0.129:5001"; 

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState(""); 
  const [departmentName, setDepartmentName] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch departments
  const loadDepartments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/departments`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch departments from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // Generate next departmentId internally
  useEffect(() => {
    if (editIndex === null) {
      if (departments.length > 0) {
        const lastDept = departments[departments.length - 1];
        const lastNum = parseInt(lastDept.department_id.slice(1)) || 0;
        setDepartmentId("D" + String(lastNum + 1).padStart(3, "0"));
      } else setDepartmentId("D001");
    }
  }, [departments, editIndex]);

  // Add / Update department
  const handleSave = async () => {
    if (!departmentName.trim()) {
      Alert.alert("Error", "Enter department name");
      return;
    }

    try {
      if (editIndex !== null) {
        // Update
        const res = await fetch(`${API_BASE}/departments/${departmentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ department_name: departmentName }),
        });
        const updatedDept = await res.json();
        const updatedList = [...departments];
        updatedList[editIndex] = updatedDept;
        setDepartments(updatedList);
        setEditIndex(null);
      } else {
        // Add
        const res = await fetch(`${API_BASE}/departments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ department_name: departmentName }),
        });
        const newDept = await res.json();
        setDepartments([...departments, newDept]);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save department.");
    }

    setDepartmentName("");
  };

  // Edit department
  const handleEdit = (index) => {
    const dept = departments[index];
    setDepartmentId(dept.department_id);
    setDepartmentName(dept.department_name);
    setEditIndex(index);
  };

  // Delete department
  const handleDelete = (index) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this department?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const dept = departments[index];
            try {
              await fetch(`${API_BASE}/departments/${dept.department_id}`, {
                method: "DELETE",
              });
              setDepartments(departments.filter((_, i) => i !== index));
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to delete department.");
            }
          },
        },
      ]
    );
  };

  // Filter departments
  const filteredList = departments.filter((dept) =>
    dept.department_name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table header
  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.headerCell]}>Sr No</Text>
      <Text style={[styles.cell, styles.headerCell]}>Department Name</Text>
      <Text style={[styles.cell, styles.headerCell]}>Actions</Text>
    </View>
  );

  // Render single row
  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
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
          style={[styles.input, styles.nameInput]}
          value={departmentName}
          onChangeText={setDepartmentName}
          placeholder="Department Name"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.btnText}>{editIndex !== null ? "Update" : "Add"}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search Departments..."
        placeholderTextColor="#888"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#00d4ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.department_id}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          stickyHeaderIndices={[0]}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No departments found.</Text>
          }
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
  nameInput: { flex: 1 },
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

export default DepartmentManagement;
