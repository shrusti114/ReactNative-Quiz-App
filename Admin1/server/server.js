const http = require("http");
const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

let db, adminCollection, departments, subjects;

async function connectDB() {
  await client.connect();
  db = client.db("Quiz2");
  adminCollection = db.collection("admin");
  departments = db.collection("departments");
  subjects = db.collection("subjects");

  // Ensure default admin exists
  const existingAdmin = await adminCollection.findOne({ username: "Admin@gmail.com" });
  if (!existingAdmin) {
    await adminCollection.insertOne({
      username: "Admin@gmail.com",
      password: "admin@1234",
    });
    console.log("Default admin created: Admin@gmail.com / admin@1234");
  }

  console.log("✅ MongoDB connected to 'Quiz2'");
}

connectDB().catch(console.error);

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.end();

  try {
    // ---------- Departments ----------
    if (req.url === "/departments" && req.method === "GET") {
      const data = await departments.find().toArray();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(data));
    }

    if (req.url === "/departments" && req.method === "POST") {
      let body = "";
      req.on("data", chunk => (body += chunk));
      req.on("end", async () => {
        const { department_name } = JSON.parse(body);
        const lastDept = await departments.find().sort({ department_id: -1 }).limit(1).toArray();
        let newId = "D001";
        if (lastDept.length > 0) {
          const lastNum = parseInt(lastDept[0].department_id.slice(1)) || 0;
          newId = "D" + String(lastNum + 1).padStart(3, "0");
        }
        const newDept = { department_id: newId, department_name };
        await departments.insertOne(newDept);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newDept));
      });
      return;
    }

    if (req.url.startsWith("/departments/") && req.method === "PUT") {
      const id = req.url.split("/")[2];
      let body = "";
      req.on("data", chunk => (body += chunk));
      req.on("end", async () => {
        const { department_name } = JSON.parse(body);
        await departments.updateOne({ department_id: id }, { $set: { department_name } });
        const updatedDept = await departments.findOne({ department_id: id });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedDept));
      });
      return;
    }

    if (req.url.startsWith("/departments/") && req.method === "DELETE") {
      const id = req.url.split("/")[2];
      await departments.deleteOne({ department_id: id });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ deletedId: id }));
      return;
    }

    // ---------- Subjects ----------
    if (req.url === "/subjects" && req.method === "GET") {
      const data = await subjects.find().toArray();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(data));
    }

    if (req.url === "/subjects" && req.method === "POST") {
      let body = "";
      req.on("data", chunk => (body += chunk));
      req.on("end", async () => {
        const { subject_name, department_id } = JSON.parse(body);
        const lastSub = await subjects.find().sort({ subject_id: -1 }).limit(1).toArray();
        let newId = "S001";
        if (lastSub.length > 0) {
          const lastNum = parseInt(lastSub[0].subject_id.slice(1)) || 0;
          newId = "S" + String(lastNum + 1).padStart(3, "0");
        }
        const newSub = { subject_id: newId, subject_name, department_id };
        await subjects.insertOne(newSub);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newSub));
      });
      return;
    }

    if (req.url.startsWith("/subjects/") && req.method === "PUT") {
      const id = req.url.split("/")[2];
      let body = "";
      req.on("data", chunk => (body += chunk));
      req.on("end", async () => {
        const { subject_name, department_id } = JSON.parse(body);
        await subjects.updateOne({ subject_id: id }, { $set: { subject_name, department_id } });
        const updatedSub = await subjects.findOne({ subject_id: id });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedSub));
      });
      return;
    }

    if (req.url.startsWith("/subjects/") && req.method === "DELETE") {
      const id = req.url.split("/")[2];
      await subjects.deleteOne({ subject_id: id });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ deletedId: id }));
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");

  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
});

server.listen(5001, () => console.log("🚀 Server running on port 5001"));
