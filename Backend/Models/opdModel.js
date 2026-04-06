const mongoose = require('mongoose')

const opdSchema = mongoose.Schema({
    opdNo: Number,
    opdDateTime: Date,
    patientID: Number,
    isFollowUpCase: {
        type: Boolean,
        default: false
    },
    treatedByDoctorID: Number,
    registrationFee: Number,
    description: String,
    oldOPDNo: String,
    
}, { timestamps: true })

module.exports = mongoose.model("opd", opdSchema)
