const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: String,
  status: String
});

module.exports = mongoose.model("Patient", patientSchema);