const express = require('express')

const opdRoute = express.Router()

const opd = require('../Models/opdModel')

opdRoute.get('/',async(req,res)=>{
    try {
        const op =  await opd.find()
        res.json(op)
    } catch (error) {
        res.json(error)
    }
})

opdRoute.post('/add',async(req,res)=>{
    try{
        const {opdNo,opdDateTime,patientID,isFollowUpCase,treatedByDoctorID,registrationFee,description,oldOPDNo} = req.body;
        const addOpd = await opd.create({opdNo,opdDateTime,patientID,isFollowUpCase,treatedByDoctorID,registrationFee,description,oldOPDNo})
        res.json(addOpd)
    }catch(err){
        res.json(err)
    }
})

opdRoute.patch('/edit/:id',async(req,res)=>{
    try {
        const op = await opd.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        if(!op){
            res.json({msg:"NOT FOUND"})
        }
        res.json(op)
    } catch (error) {
        res.json(error)
    }
})

opdRoute.delete('/delete/:id',async(req,res)=>{
    try {
        
        const op = await opd.findByIdAndDelete(req.params.id);
        if(!op){
            res.json({msg:"NOT FOUND"})
        }
        res.json(op)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = opdRoute