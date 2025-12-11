const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3019;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SERVE FRONTEND
app.use(express.static(path.join(__dirname, "../frontend")));

// MONGO CONNECTION
mongoose
  .connect("mongodb://127.0.0.1:27017/ndaiya")   // <- use 127.0.0.1 (fixes connection issues)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

// tutor schema
const LearnerSchema = new mongoose.Schema({
  role: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String
});
// learner SCHEMA
const TutorSchema = new mongoose.Schema({
  role: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String
});

const Tutor = mongoose.model("Tutor", TutorSchema);
const Learner = mongoose.model("Learner", LearnerSchema);

// API: REGISTER tutor
app.post("/api/register", async (req, res) => {
  try {
    const user = await Tutor.create(req.body);
    res.json({ message: "User registered", user });
  } catch (err) {
    res.status(400).json({ message: "Error registering user", error: err });
  }
});


// API: REGISTER learner
app.post("/api/register", async (req, res) => {
  try {
    const user = await Learner.create(req.body);
    res.json({ message: "User registered", user });
  } catch (err) {
    res.status(400).json({ message: "Error registering user", error: err });
  }
});

// API: LOGIN
app.post("/api/login", async (req, res) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    email: identifier,
    password: password
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid login" });
  }

  res.json({ message: "Login successful", user });
});

// DEFAULT ROUTE — SERVE index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
