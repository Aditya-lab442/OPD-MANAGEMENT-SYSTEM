const mongoose = require('mongoose')

const hospitalSchema = mongoose.Schema({
    hospitalName: {
        type:String,
        required:true,
        unique:true
    },
    address: String,
    registrationCharge: Number,
    openingDate: Date,
    openingPatientNo: Number,
    openingOPDNo: Number,
    openingReceiptNo: Number,
    description: String,
    defaultPaymentModeID: Number,
    registrationValidityMonths: Number,
},{timestamps:true})

module.exports = mongoose.model("hospital",hospitalSchema)
