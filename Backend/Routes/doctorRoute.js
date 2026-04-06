const express = require('express')

const doctorRoute = express.Router()

const doctor = require('../Models/doctorModel')

doctorRoute.get('/',async(req,res)=>{
    try {
        const doc =  await doctor.find()
        res.json(doc)
    } catch (error) {
        res.json(error)
    }
})

doctorRoute.post('/add',async(req,res)=>{
    try{
        const {doctorName,staffID,studentID,hospitalID,description} = req.body;
        const addDoctor = await doctor.create({doctorName,staffID,studentID,hospitalID,description})
        res.json(addDoctor)
    }catch(err){
        res.json(err)
    }
})

doctorRoute.patch('/edit/:id',async(req,res)=>{
    try {
        const doc = await doctor.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        if(!doc){
            res.json({msg:"NOT FOUND"})
        }
        res.json(doc)
    } catch (error) {
        res.json(error)
    }
})

doctorRoute.delete('/delete/:id',async(req,res)=>{
    try {
        
        const user = await doctor.findByIdAndDelete(req.params.id);
        if(!user){
            res.json({msg:"NOT FOUND"})
        }
        res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = doctorRoute