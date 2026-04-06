const express = require("express");
const receiptRoute = express.Router();
const Receipt = require("../Models/receiptModel");
receiptRoute.get("/", async (req, res) => {
  try {
    const receipts = await Receipt.find()
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
receiptRoute.post("/add", async (req, res) => {
  try {
    const {receiptNo,receiptDate,opdID,amountPaid,paymentModeID,referenceNo,referenceDate,description} = req.body;
    const addOpd = await Receipt.create({receiptNo,receiptDate,opdID,amountPaid,paymentModeID,referenceNo,referenceDate,description})
    res.json(addOpd)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
receiptRoute.patch("/edit/:id", async (req, res) => {
  try {
    const updatedReceipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, });
    if (!updatedReceipt) {
      return res.status(404).json({ msg: "RECEIPT NOT FOUND" });
    }
    res.json(updatedReceipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

receiptRoute.delete("/delete/:id", async (req, res) => {
  try {
    const deletedReceipt = await Receipt.findByIdAndDelete(req.params.id);

    if (!deletedReceipt) {
      return res.status(404).json({ msg: "receit not found" });
    }
    res.json(deletedReceipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = receiptRoute;