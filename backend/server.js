const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // 🔥 ADD THIS

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 CONNECT DATABASE
connectDB();

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const doctorRoutes = require("./routes/doctorRoutes");
app.use("/api/doctor", doctorRoutes);

const patientRoutes = require("./routes/patientRoutes");
app.use("/api/patient", patientRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});