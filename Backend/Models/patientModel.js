const mongoose = require("mongoose");
const patientSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true
    },
    patientNo: {
      type: Number,
      required: true,
    },
    hospitalID: {
      type: Number,
      required: true
    },
    registrationDateTime: {
      type: Date,
      default: Date.now
    },
    age: {
      type: Number,
      min: 0
    },
    bloodGroup: {
      type: String
    },
    gender: {
      type: String,
      enum: ["Male", "Female"]
    },
    mobileNo: {
      type: String,
      required: true
    },
    emergencyContactNo: {
      type: String
    },
    occupation: {
      type: String
    },
    referredBy: {
      type: String
    },
    address: {
      type: String
    },
    stateID: {
      type: Number
    },
    cityID: {
      type: Number
    },
    pinCode: {
      type: String
    },
    description: {
      type: String
    }
  },{timestamps: true});
module.exports = mongoose.model("Patient", patientSchema);