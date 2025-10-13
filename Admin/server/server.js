const http = require("http");
const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

let db, adminCollection, departments, teachers, subjects;

async function connectDB() {
  await client.connect();
  db = client.db("Quiz2");
  adminCollection = db.collection("admin");
  departments = db.collection("departments");
  teachers = db.collection("teachers");
  subjects = db.collection("subjects");
  console.log("MongoDB connected");
}

connectDB();

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  // ------------------- ADMIN LOGIN -------------------
  if (req.method === "POST" && req.url === "/admin/login") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      const { admin_id, password } = JSON.parse(body);
      const admin = await adminCollection.findOne({ admin_id, password });
      if (admin) res.end(JSON.stringify({ message: "Login success", admin }));
      else res.end(JSON.stringify({ message: "Invalid credentials" }));
    });
  }

  // ------------------- DEPARTMENTS -------------------
  else if (req.url.startsWith("/departments")) {
    if (req.method === "GET") {
      const allDepartments = await departments.find().toArray();
      res.end(JSON.stringify(allDepartments));
    } 
    else if (req.method === "POST") {
      let body = "";
      req.on("data", chunk => body += chunk);
      req.on("end", async () => {
        const data = JSON.parse(body);
        await departments.insertOne(data);
        res.end(JSON.stringify({ message: "Department added" }));
      });
    } 
    else if (req.method === "PUT") {
      let id = req.url.split("/")[2];
      let body = "";
      req.on("data", chunk => body += chunk);
      req.on("end", async () => {
        const data = JSON.parse(body);
        await departments.updateOne({ _id: new ObjectId(id) }, { $set: data });
        res.end(JSON.stringify({ message: "Department updated" }));
      });
    } 
    else if (req.method === "DELETE") {
      let id = req.url.split("/")[2];
      await departments.deleteOne({ _id: new ObjectId(id) });
      res.end(JSON.stringify({ message: "Department deleted" }));
    }
  }

  // ------------------- TEACHERS -------------------
  else if (req.url.startsWith("/teachers")) {
    if (req.method === "GET") {
      const allTeachers = await teachers.find().toArray();
      res.end(JSON.stringify(allTeachers));
    } 
    else if (req.method === "POST") {
      let body = "";
      req.on("data", chunk => body += chunk);
      req.on("end", async () => {
        const data = JSON.parse(body);
        await teachers.insertOne(data);
        res.end(JSON.stringify({ message: "Teacher added" }));
      });
    } 
    else if (req.method === "PUT") {
      let id = req.url.split("/")[2];
      let body = "";
      req.on("data", chunk => body += chunk);
      req.on("end", async () => {
        const data = JSON.parse(body);
        await teachers.updateOne({ _id: new ObjectId(id) }, { $set: data });
        res.end(JSON.stringify({ message: "Teacher updated" }));
      });
    } 
    else if (req.method === "DELETE") {
      let id = req.url.split("/")[2];
      await teachers.deleteOne({ _id: new ObjectId(id) });
      res.end(JSON.stringify({ message: "Teacher deleted" }));
    }
  }

  // ------------------- SUBJECTS -------------------
  else if (req.url.startsWith("/subjects")) {
    if (req.method === "GET") {
      const allSubjects = await subjects.find().toArray();
      res.end(JSON.stringify(allSubjects));
    } 
    else if (req.method === "POST") {
      let body = "";
      req.on("data", chunk => body += chunk);
      req.on("end", async () => {
        const data = JSON.parse(body);
        await subjects.insertOne(data);
        res.end(JSON.stringify({ message: "Subject added" }));
      });
    } 
    else if (req.method === "PUT") {
      let id = req.url.split("/")[2];
      let body = "";
      req.on("data", chunk => body += chunk);
      req.on("end", async () => {
        const data = JSON.parse(body);
        await subjects.updateOne({ _id: new ObjectId(id) }, { $set: data });
        res.end(JSON.stringify({ message: "Subject updated" }));
      });
    } 
    else if (req.method === "DELETE") {
      let id = req.url.split("/")[2];
      await subjects.deleteOne({ _id: new ObjectId(id) });
      res.end(JSON.stringify({ message: "Subject deleted" }));
    }
  }

  // ------------------- NOT FOUND -------------------
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(5000, () => console.log("Server running on port 5000"));
