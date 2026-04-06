const express = require('express')

const patientRoute= express.Router()

const Patient = require('../Models/patientModel')

patientRoute.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
patientRoute.post("/add", async (req, res) => {
  try {
    const newPatient = await Patient.create(req.body);
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
patientRoute.patch("/edit/:id", async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true});
    if (!updatedPatient) {
      return res.status(404).json({ msg: "patient not found " });
    }
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
patientRoute.delete("/delete/:id", async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);

    if (!deletedPatient) {
      return res.status(404).json({ msg: "PATIENT NOT FOUND" });
    }

    res.json(deletedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = patientRoute;