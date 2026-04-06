const express = require('express')

const diagnosisRoute = express.Router()

const diagnosis = require('../Models/diagnosisModel')

diagnosisRoute.get('/',async(req,res)=>{
    try {
        const dig =  await diagnosis.find()
        res.json(dig)
    } catch (error) {
        res.json(error)
    }
})

diagnosisRoute.post('/add',async(req,res)=>{
    try{
        const {diagnosisTypeName,diagnosisTypeShortName,isActive,hospitalID,description} = req.body;
        const addDiagnosis = await diagnosis.create({diagnosisTypeName,diagnosisTypeShortName,isActive,hospitalID,description})
        res.json(addDiagnosis)
    }catch(err){
        res.json(err)
    }
})

diagnosisRoute.patch('/edit/:id',async(req,res)=>{
    try {
        const dig = await diagnosis.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        if(!dig){
            res.json({msg:"NOT FOUND"})
        }
        res.json(dig)
    } catch (error) {
        res.json(error)
    }
})

diagnosisRoute.delete('/delete/:id',async(req,res)=>{
    try {
        
        const dig = await diagnosis.findByIdAndDelete(req.params.id);
        if(!dig){
            res.json({msg:"NOT FOUND"})
        }
        res.json(dig)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = diagnosisRoute