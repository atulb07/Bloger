//**************************************************
//Setup Packages
//**************************************************

//express
var express = require("express")
var app=express()
app.use(express.static("public"));

//body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

//ejs set-engine
app.set("view engine","ejs");

//method-override
var override =require("method-override");
app.use(override("_method"));

//passport
var passport = require('passport');
var passportLocal = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');

//**************************************************
//Database Stuff
//**************************************************

//mongoose
var mongoose = require("mongoose");
//mongoose.connect("mongodb://localhost/bloger")
mongoose.connect("mongodb+srv://atul:kantulji@cluster0-cgsb8.mongodb.net/bloger?retryWrites=true&w=majority");


//blogs - pic, title, desc, date
var blog = require("./modules/blog"); 

//comment - content,author,date
var comment = require("./modules/comment"); 

//user -username,password
var user = require("./modules/user")


//**************************************************
//Authentication
//**************************************************

app.use(require('express-session')({
    secret: "key",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})

//**************************************************
//Routes
//**************************************************

var blogRoutes = require("./routes/blogs");
var authRoutes = require("./routes/auth");
var commentRoutes = require("./routes/comments");

app.use(blogRoutes);
app.use(authRoutes);
app.use("/blogs/:id/comment",commentRoutes);

//**************************************************
//Start Server
//**************************************************

app.listen(process.env.PORT,process.env.IP,function(){
      console.log("Bloger Website online")
})
// app.listen(3000,function(){
//     console.log("Bloger Website online")
// })