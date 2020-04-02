var express = require("express");
var router = express.Router();
var passport = require("passport");
var user = require("../modules/user");

//**************************************************
//Authentication Routes
//**************************************************

router.get("/login",function(req,res){
    res.render("auth/login");
})

//LOGIN
router.post("/login",passport.authenticate("local",{
    successRedirect:"/blogs",
    failureRedirect:"/login"
}), function(req,res){
})

router.get("/register",function(req,res){
    res.render("auth/register");
})

//REGISTER
router.post("/register",function(req,res){
    user.register(new user({username:req.body.username}),req.body.password,function(err,user){
        if(err){
          console.log(err);
          res.render("auth/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                console.log(user + "registered successfully");
                res.redirect("/blogs");
            })
            
        }
    })  
})

//LOGOUT
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})

//default
router.get("*",function(req,res){
    res.send("Try a proper route pal!!!!");
})

module.exports=router;