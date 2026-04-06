const mongoose = require('mongoose')

const subTreatmentTypeSchema = mongoose.Schema({
    subTreatmentTypeName: String,
    treatmentTypeID: Number,
    rate: Number,
    isActive: {
        type: Boolean,
        default:true 
    },
    accountID: Number,
    description: String,
}, { timestamps: true })

module.exports = mongoose.model("SubTreatmentType", subTreatmentTypeSchema)
