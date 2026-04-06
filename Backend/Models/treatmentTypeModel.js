const mongoose = require('mongoose')

const treatmentTypeSchema = mongoose.Schema({
    treatmentTypeName: String,
    treatmentTypeShortName: String,
    hospitalID: Number,
    description: String,
}, { timestamps: true })

module.exports = mongoose.model("TreatmentType", treatmentTypeSchema)
