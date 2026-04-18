const express = require("express");
const router = express.Router();

const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

// ✅ Get appointments (FILTERED)
router.get("/appointments", async (req, res) => {
  const doctor = req.query.doctor;

  console.log("Doctor filter:", doctor); // debug

  const data = await Appointment.find({
    doctor: { $regex: doctor, $options: "i" }
  });

  res.json(data);
});

// ✅ Get all doctors
router.get("/all", async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
});

// ✅ Add doctor
router.post("/add", async (req, res) => {
  const { name, email, specialization } = req.body;

  const newDoctor = new Doctor({ name, email, specialization });
  await newDoctor.save();

  res.send("Doctor added");
});
router.post("/login", async (req, res) => {
  const { email } = req.body;

  try {
    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      name: doctor.name,
      email: doctor.email
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;