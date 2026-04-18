const express = require("express");
const router = express.Router();

const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient"); // ✅ FIX

// Book appointment
router.post("/book", async (req, res) => {
  try {
    const { doctor, date, time, patientEmail } = req.body;

    console.log("Incoming data:", req.body); // 🔥 DEBUG

    const newApp = new Appointment({
      doctor,
      date,
      time,
      patientEmail
    });

    await newApp.save();

    console.log("Saved to DB:", newApp); // 🔥 CONFIRM

    res.send("Booked successfully");
  } catch (err) {
    console.error("Error saving:", err);
    res.status(500).send("Error booking appointment");
  }
});

// Add patient
router.post("/add", async (req, res) => {
  const { name, age, phone, status } = req.body;

  const newPatient = new Patient({ name, age, phone, status });
  await newPatient.save();

  res.json({ message: "Patient added" });
});

// Get all patients
router.get("/all", async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
});

// Get patient appointments
router.get("/appointments", async (req, res) => {
  const email = req.query.email;

  const data = await Appointment.find({ patientEmail: email });
  res.json(data);
});

module.exports = router;