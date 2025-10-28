const http = require("http");
const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

let db, adminCollection, departments, subjects, teachers;

// =======================
// 🔗 Database Connection
// =======================
async function connectDB() {
  await client.connect();
  db = client.db("Quiz2");
  adminCollection = db.collection("admin");
  departments = db.collection("departments");
  subjects = db.collection("subjects");
  teachers = db.collection("teachers");

  // ✅ Default Admin
  const existingAdmin = await adminCollection.findOne({ username: "Admin@gmail.com" });
  if (!existingAdmin) {
    await adminCollection.insertOne({
      username: "Admin@gmail.com",
      password: "admin@1234",
    });
    console.log("✅ Default admin created: Admin@gmail.com / admin@1234");
  }

  console.log("✅ MongoDB connected to 'Quiz2'");
}
connectDB().catch(console.error);

// =======================
// 🧠 Helper: Parse Body
// =======================
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

// =======================
// 🚀 Server Setup
// =======================
const server = http.createServer(async (req, res) => {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.end();

  try {
    // ============================
    // 🏫 DEPARTMENTS
    // ============================
    if (req.url === "/departments" && req.method === "GET") {
      const data = await departments.find().toArray();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(data));
    }

    if (req.url === "/departments" && req.method === "POST") {
      const { department_name } = await parseBody(req);
      const lastDept = await departments.find().sort({ department_id: -1 }).limit(1).toArray();

      let newId = "D001";
      if (lastDept.length > 0) {
        const lastNum = parseInt(lastDept[0].department_id.slice(1)) || 0;
        newId = "D" + String(lastNum + 1).padStart(3, "0");
      }

      const newDept = { department_id: newId, department_name };
      await departments.insertOne(newDept);
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(newDept));
    }

    // ============================
    // 📘 SUBJECTS
    // ============================
    if (req.url === "/subjects" && req.method === "GET") {
      const data = await subjects.find().toArray();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(data));
    }

    if (req.url === "/subjects" && req.method === "POST") {
      const { subject_name, department_id } = await parseBody(req);
      const dept = await departments.findOne({ department_id });
      const department_name = dept ? dept.department_name : "Unknown";

      const lastSub = await subjects.find().sort({ subject_id: -1 }).limit(1).toArray();
      let newId = "S001";
      if (lastSub.length > 0) {
        const lastNum = parseInt(lastSub[0].subject_id.slice(1)) || 0;
        newId = "S" + String(lastNum + 1).padStart(3, "0");
      }

      const newSub = {
        subject_id: newId,
        subject_name,
        department_id,
        department: department_name,
      };

      await subjects.insertOne(newSub);
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(newSub));
    }

    // ============================
    // 🧑‍🏫 TEACHERS
    // ============================
    if (req.url === "/teachers" && req.method === "GET") {
      const teacherData = await teachers.find().toArray();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(teacherData));
    }

    if (req.url === "/teachers" && req.method === "POST") {
      const { teacher_name, teacher_email, password, department_id } = await parseBody(req);

      if (!teacher_name || !teacher_email || !password || !department_id) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "All fields are required" }));
      }

      const dept = await departments.findOne({ department_id });
      const department_name = dept ? dept.department_name : "Unknown";

      const lastTeacher = await teachers.find().sort({ teacher_id: -1 }).limit(1).toArray();
      let newId = "T001";
      if (lastTeacher.length > 0) {
        const lastNum = parseInt(lastTeacher[0].teacher_id.slice(1)) || 0;
        newId = "T" + String(lastNum + 1).padStart(3, "0");
      }

      const newTeacher = {
        teacher_id: newId,
        teacher_name,
        teacher_email,
        password,
        department_id,
        department: department_name,
      };

      await teachers.insertOne(newTeacher);
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(newTeacher));
    }

    if (req.url.startsWith("/teachers/") && req.method === "PUT") {
      const id = req.url.split("/")[2];
      const { teacher_name, teacher_email, password, department_id } = await parseBody(req);

      const dept = await departments.findOne({ department_id });
      const department_name = dept ? dept.department_name : "Unknown";

      await teachers.updateOne(
        { teacher_id: id },
        {
          $set: {
            teacher_name,
            teacher_email,
            password,
            department_id,
            department: department_name,
          },
        }
      );

      const updatedTeacher = await teachers.findOne({ teacher_id: id });
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(updatedTeacher));
    }

    if (req.url.startsWith("/teachers/") && req.method === "DELETE") {
      const id = req.url.split("/")[2];
      await teachers.deleteOne({ teacher_id: id });
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ deletedId: id }));
    }

    // ============================
    // ❌ DEFAULT 404
    // ============================
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  } catch (err) {
    console.error("❌ Error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
});

// =======================
// ⚡ Start Server
// =======================
server.listen(5001, "0.0.0.0", () =>
  console.log("🚀 Server running on http://localhost:5001")
);
