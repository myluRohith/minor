var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var router = express.Router();

Details = require("./modules/Data");
User = require("./modules/users");

router.post("/deduct",function(req,res){
console.log(req.body.rfid);
var choice=req.body.key;
console.log(choice);
   Details.findOne({rfid : req.body.rfid},function(err,p){
       if(err)
       {
           res.send("err");
       }
       else
       {
           if(choice == 1){
            p.amount = (parseInt(p.amount)-5);
            console.log(p);
            Details.findByIdAndUpdate(p._id,p,function(err,q)
            {
                if(err)
                {
                    res.send("error");
                }
                else{
                    res.redirect("/");
                }
            })
           }else if(choice == 2){
            p.amount = (parseInt(p.amount)-8);
            console.log(p);
            Details.findByIdAndUpdate(p._id,p,function(err,q)
            {
                if(err)
                {
                    res.send("error");
                }
                else{
                    res.redirect("/");
                }
            })
           }else if(choice == 3){
            p.amount = (parseInt(p.amount)-10);
            console.log(p);
            Details.findByIdAndUpdate(p._id,p,function(err,q)
            {
                if(err)
                {
                    res.send("error");
                }
                else{
                    res.redirect("/");
                }
            })
           }else if(choice == 4){
            p.amount = (parseInt(p.amount)-12);
            console.log(p);
            Details.findByIdAndUpdate(p._id,p,function(err,q)
            {
                if(err)
                {
                    res.send("error");
                }
                else{
                    res.redirect("/");
                }
            })
           }       
       }
   })
    
})
router.get("/ticket",function(req,res){
    res.render("keyy.ejs")
})

module.exports = router;
