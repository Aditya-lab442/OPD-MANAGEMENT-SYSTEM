const mongoose = require('mongoose')

const loginSchema = mongoose.Schema({
    username: { type: String, required: true},
    email:    { type: String },
    password: { type: String, required: true },
    role:     { type: String, enum: ['Admin','Doctor','Patient'] }
},{ timestamps:true })

module.exports = mongoose.model("login", loginSchema)
