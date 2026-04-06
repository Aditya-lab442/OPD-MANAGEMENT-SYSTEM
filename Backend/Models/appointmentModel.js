
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  specialty: {
    type: String, 
    default: "General Physician"
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  problem: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);