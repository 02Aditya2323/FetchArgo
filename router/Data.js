const express=require("express");
const  router=express.Router(); 
const {fetchData}= require("../controller/data")

router.get("/",fetchData);

module.exports = router;