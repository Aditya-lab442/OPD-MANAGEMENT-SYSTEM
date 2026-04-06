const mongoose = require("mongoose");
const receiptSchema = new mongoose.Schema(
  {
    receiptNo: {
      type: Number,
      required: true,
      unique: true
    },
    receiptDate: {
      type: Date,
      default: Date.now
    },
    opdID: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Opd",
      // required: true
      type:Number
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0
    },
    paymentModeID: {
      type: Number,
      required: true
    },
    referenceNo: {
      type: Number
    },
    referenceDate: {
      type: Date
    },
    description: {
      type: String
    }
  },{timestamps: true});
module.exports = mongoose.model("Receipt", receiptSchema);