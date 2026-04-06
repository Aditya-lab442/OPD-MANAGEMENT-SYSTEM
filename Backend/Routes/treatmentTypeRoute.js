const express = require('express')

const treatmentTypeRoute = express.Router()

const treatment = require('../Models/treatmentTypeModel')

treatmentTypeRoute.get('/',async(req,res)=>{
    try {
        const users =  await treatment.find()
        res.json(users)
    } catch (error) {
        res.json(error)
    }
})

treatmentTypeRoute.post('/add',async(req,res)=>{
    try{
        const {treatmentTypeName,treatmentTypeShortName,hospitalID,description} = req.body;
        const addtreatment = await treatment.create({treatmentTypeName,treatmentTypeShortName,hospitalID,description})
        res.json(addtreatment)
    }catch(err){
        res.json(err)
    }
})

treatmentTypeRoute.patch('/edit/:id',async(req,res)=>{
    try {
        const user = await treatment.findByIdAndUpdate(req.params.id,{
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

treatmentTypeRoute.delete('/delete/:id',async(req,res)=>{
    try {
        
        const user = await treatment.findByIdAndDelete(req.params.id);
        if(!user){
            res.json({msg:"NOT FOUND"})
        }
        res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = treatmentTypeRoute