const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { verifyToken } = require('./Middleware/authMiddleware')
const errorHandler = require('./Middleware/errorHandler')

dotenv.config()

const app = express()

mongoose.connect(process.env.mongoUrl)
  .then(() => console.log("MongoDB Connected"))

app.use(express.json())
app.use(cors())
const receiptRoute = require('./Routes/receiptRoute')
const patientRoute = require('./Routes/patientRoute')
const doctorRoute = require('./Routes/doctorRoute')
const loginRoute = require('./Routes/loginRoute')
const hospitalRoute = require('./Routes/hospitalRoute')
const treatmentTypeRoute = require('./Routes/treatmentTypeRoute')
const diagnosisRoute = require('./Routes/diagnosisRoute')
const subTratmentRoute = require('./Routes/subTreatment')
const opdRoute = require('./Routes/opdRoute')
const appointmentRoute = require('./Routes/appointmentRoute')

app.use('/appointments', verifyToken, appointmentRoute)
app.use('/patient', verifyToken, patientRoute)
app.use('/receipt', verifyToken, receiptRoute)
app.use('/', loginRoute)
app.use('/hospital', verifyToken, hospitalRoute)
app.use('/doctor', verifyToken, doctorRoute)
app.use('/diagnosis', verifyToken, diagnosisRoute)
app.use('/treatmenttype', verifyToken, treatmentTypeRoute)
app.use('/subtreatment', verifyToken, subTratmentRoute)
app.use('/opd', verifyToken, opdRoute)

app.use(errorHandler)

app.listen(3001, () => {
  console.log("Server running on port 3001")
})