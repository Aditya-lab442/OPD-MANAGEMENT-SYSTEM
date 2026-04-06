const mongoose = require('mongoose')

const doctorSchema = mongoose.Schema({
    doctorName: String,
    staffID: Number,
    studentID: Number,
    hospitalID: Number,
    description: String,
}, { timestamps: true })

module.exports = mongoose.model("doctor", doctorSchema)
