const express = require('express')

const hospitalRoute = express.Router()

const hospital = require('../Models/hospitalModel')

hospitalRoute.get('/',async(req,res)=>{
    try {
        const users =  await hospital.find()
        res.json(users)
    } catch (error) {
        res.json(error)
    }
})

hospitalRoute.post('/add',async(req,res)=>{
    try{
        const {hospitalName,address,registrationCharge,openingDate,openingPatientNo,openingOPDNo,openingReceiptNo,description,defaultPaymentModeID,registrationValidityMonths} = req.body;
        const addHospital = await hospital.create({hospitalName,address,registrationCharge,openingDate,openingPatientNo,openingOPDNo,openingReceiptNo,description,defaultPaymentModeID,registrationValidityMonths})
        res.json(addHospital)
    }catch(err){
        res.json(err)
    }
})

hospitalRoute.patch('/edit/:id',async(req,res)=>{
    try {
        const user = await hospital.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        if(!user){
            res.json({msg:"NOT FOUND"})
        }
        res.json(user)
    } catch (error) {
        res.json(error)
    }
})

hospitalRoute.delete('/delete/:id',async(req,res)=>{
    try {
        
        const user = await hospital.findByIdAndDelete(req.params.id);
        if(!user){
            res.json({msg:"NOT FOUND"})
        }
        res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = hospitalRoute