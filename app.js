var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var methodOverRide = require("method-override");
var passport = require("passport");
var localStratag = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var stripe = require("stripe")("sk_test_IfCCFwWgsCz05iE3d0LotVV200G29wYQuc");
var to_add ;
var detail1;
var route= require("./deduct");
//mongoose.connect("mongodb://localhost/minor",{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.connect("mongodb+srv://rohithMylu:Mylu12321@cluster0-v3toj.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true})
Details = require("./modules/Data");
User = require("./modules/users");
app.use(bodyparser.urlencoded({ extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(methodOverRide("_method"));
app.use(require("express-session")({
    secret: "rohith",
    resave: false,
    saveUninitialized : false
}))
app.use(route);

//for findByIdAndUpdate :------ mongoose.set('useFindAndModify', false);
mongoose.set('useFindAndModify', false);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratag(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(express.static("public"));
app.set("view engine","ejs");

app.get("/",function(req,res){
    res.render("home"); 
});
app.get("/details",islogedin,function(req,res){
    console.log(req.user.username);
    Details.findOne({username : req.user.username},function(err,p){
        if(err){
            res.send("error");
        }else{
            console.log(p);
            res.render("details",{details : p}); 
        }
    })
    
});
app.get("/register",function(req,res){
    res.render("signUp");
});
app.post("/register",function(req,res){
    var username = req.body.username;
    var phone = req.body.phoneNumber;
    console.log(phone);
    var adress = req.body.adress;
    var amount = req.body.amount;
    var rfid = req.body.rfid;
    var toappend ={username : username ,adress : adress,amount : amount , phoneNumber : phone, rfid: rfid}
    Details.create(toappend,function(err,pic){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(pic);
        }
    })
    User.register(new User ({username : req.body.username, rfid: req.body.rfid }),req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
        }
        passport.authenticate('local')(req,res,function(){
            res.redirect("/Login")
        })
    });
   
});
app.get("/Login",function(req,res){
    res.render("Login");
})
app.post("/Login",passport.authenticate("local",{successRedirect:"/details",failureRedirect:"/Login"}),function(req,res){})


function islogedin(req,res,next){
      
    if(req.isAuthenticated())
    {
        return next();    
    }
    res.redirect("/Login");
}

app.post("/recharge",function(req,res){
    app.use(bodyparser.json);
    var token = req.body.stripeToken;
    var chargeAmount = req.body.bill +0+0;
       to_add = parseInt(chargeAmount) ;
       console.log(to_add);
 if( to_add%100 == 0 ){
     to_add = to_add/100;
   var charge = stripe.charges.create({
        amount : chargeAmount,
        currency :"inr",
        source :token
    },function(err, charge){
        if(err ){
            res.send("error paling!!")
        }
        else{
            res.redirect("/success");
        }
    })}
  else{
    res.send("incorrect denomination");
}
    
})

app.get("/success",function(req,res){
    Details.findOne({username : req.user.username},function(err,p){
        if(err){
            res.send("error");
        }else{
            var a = parseInt(p.amount) ;
            a = a + to_add; 
            var id = p._id;
            var detail = {username : p.username ,adress : p.adress,amount : a , phoneNumber : p.phoneNumber}
            Details.findByIdAndUpdate(id,detail,function(err,update){
                if(err)
                {
                     res.send("error");
                     console.log(err);
                }
                else{
                    res.redirect("/details"); 
                }
            })
           
        }
    })
    
});

app.get("/form",function(req,res){
    res.render("mm.ejs");
});
app.post("/maps",function(req,res){
    var lat=req.body.latti;
    var lon=req.body.longi; 
    var dis=req.body.discp;
    detail1 = {lat:lat, lon:lon, dis:dis};
    res.render("demo",{pumm :detail1});
});
app.get("/maps",function(req,res){
    res.render("demo",{pumm:detail1});
});

app.listen(process.env.PORT || 5000,function(){
    console.log("Server Started");
})