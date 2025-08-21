const express = require("express");
const Data=require("../model/Data")


const fetchData=async(req,res)=>{
    try{
        const give= await Data.find()
        return res.status(200).json({message:"Data fetched successfully",data:give});
    }
    catch(err){
        return res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports={fetchData};