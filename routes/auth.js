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
    successFlash: 'Welcome!',
    failureRedirect:"/login",
    faliureFlash: 'Invalid username or password.'
}), function(req,res){
})

router.get("/register",function(req,res){
    res.render("auth/register");
})

//REGISTER
router.post("/register",function(req,res){
    user.register(new user({username:req.body.username}),req.body.password,function(err,user){
        if(err){
          req.flash("error",err);
          res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success","User Registered successfully");
                res.redirect("/blogs");
            })
            
        }
    })  
})

//LOGOUT
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","User Successfully Signed out!!")
    res.redirect("/");
})

//default
router.get("*",function(req,res){
    res.send("Try a proper route pal!!!!");
})

module.exports=router;