const express = require('express')

const subTratmentRoute = express.Router()

const subTreatment = require('../Models/subTreatmentModel')

subTratmentRoute.get('/',async(req,res)=>{
    try {
        const tr =  await subTreatment.find()
        res.json(tr)
    } catch (error) {
        res.json(error)
    }
})

subTratmentRoute.post('/add',async(req,res)=>{
    try{
        const {subTreatmentTypeName,treatmentTypeID,rate,accountID,description} = req.body;
        const addSubTr = await subTreatment.create({subTreatmentTypeName,treatmentTypeID,rate,accountID,description})
        res.json(addSubTr)
    }catch(err){
        res.json(err)
    }
})

subTratmentRoute.patch('/edit/:id',async(req,res)=>{
    try {
        const tr = await subTreatment.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        if(!tr){
            res.json({msg:"NOT FOUND"})
        }
        res.json(tr)
    } catch (error) {
        res.json(error)
    }
})

subTratmentRoute.delete('/delete/:id',async(req,res)=>{
    try {
        
        const tr = await subTreatment.findByIdAndDelete(req.params.id);
        if(!tr){
            res.json({msg:"NOT FOUND"})
        }
        res.json(tr)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = subTratmentRoute