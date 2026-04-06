const express = require('express')

const appointmentRoute = express.Router()

const appointment = require('../Models/appointmentModel')

appointmentRoute.get('/:patientName',async(req,res)=>{
    // console.log(req.params.patientName)
    try {
        const apt =  await appointment.find({patientName:req.params.patientName})
        // console.log(apt)
        res.json(apt)
    } catch (error) {
        res.json(error)
    }
})

appointmentRoute.get('/doctor/:doctorName',async(req,res)=>{
    
    try {
        const apt =  await appointment.find({doctorName:req.params.doctorName})
        res.json(apt)
    } catch (error) {
        res.json(error)
    }
})

appointmentRoute.post('/add',async(req,res)=>{
    try{
        const {patientName,doctorName,date,time,problem} = req.body;
        const apt = await appointment.create({patientName,doctorName,date,time,problem})
        res.json(apt)
    }catch(err){
        res.json(err)
    }
})

// appointmentRoute.patch('/edit/:id',async(req,res)=>{
//     try {
//         const dig = await diagnosis.findByIdAndUpdate(req.params.id,{
//             $set:req.body
//         },{new:true})
//         if(!dig){
//             res.json({msg:"NOT FOUND"})
//         }
//         res.json(dig)
//     } catch (error) {
//         res.json(error)
//     }
// })

appointmentRoute.delete('/delete/:id',async(req,res)=>{
    try {
        
        const apt = await appointment.findByIdAndDelete(req.params.id);
        if(!apt){
            res.json({msg:"NOT FOUND"})
        }
        res.json(apt)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = appointmentRoute