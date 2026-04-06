const mongoose = require('mongoose')

const diagnosisSchema = mongoose.Schema({
    diagnosisTypeName: String,
    diagnosisTypeShortName: String,
    isActive: {
        type: Boolean,
        default:true 
    },
    hospitalID: Number,
    description: String,
}, { timestamps: true })

module.exports = mongoose.model("diagnosis", diagnosisSchema)
