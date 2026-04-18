const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctor: String,
  patientEmail: String,
  date: String,
  time: String
});

module.exports = mongoose.model("Appointment", appointmentSchema);