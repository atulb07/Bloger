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

function isLogged(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//**************************************************
//Routes
//**************************************************

//**************************************************
//blogs
//**************************************************

//home
app.get("/",function(req,res){
    res.render("home");
})

//blogs
app.get("/blogs",function(req,res){
    blog.find({},function(err,items){
        if(err){
            console.log("Nothing found");
        }
        else{
            res.render("blog/index",{blogs:items});

        }
    })
})

//new
app.get("/blogs/new",isLogged,function(req,res){
    res.render("blog/new");
})

//create
app.post("/blogs",function(req,res){
    blog.create({
        title:req.body.blog.title,
        image:req.body.blog.image,
        desc: req.body.blog.desc,
        author:req.user.username,
        date: Date()
    },function(err,item){
        if(err){
            console.log("NO new element created");
        }
        else{
            console.log(item);
            res.redirect("/blogs");        
        }
    })
})

//show
app.get("/blogs/:id",function(req,res){

    blog.findOne({_id:req.params.id}).populate("comments").exec(function(err,item){
        if(err){
            console.log("blog cannot be fetched for show");
        }
        else{
            res.render("blog/blog",{blog:item,comments:item.comments});
        }
    })
})

//edit
app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,item){
        if(err){
            console.log("Error in finding from Database");
        }
        else{
            res.render("blog/edit",{blog:item});
        }
    })
})

//udpate
app.put("/blogs/:id",function(req,res,next){
        req.body.blog.date= Date();
        next();
        },function(req,res){
        console.log(req.body)
        blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,update){
            if(err){
                console.log("Item cannot be updated");
            }
            else{
                res.redirect("/blogs/"+req.params.id)
            }
        })
})

//delete
app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err,item){
        if(err){
            console.log("Item cannot be deleted");
        }
        else{
            console.log(item + "deleted");
            res.redirect("/blogs");
        }
    });
})

//**************************************************
//comments
//**************************************************


app.post("/blogs/:id/comment",function(req,res){
    comment.create({
        content:req.body.comment.content,
        author:req.user.username,
        date: Date()
    },function(err,item){
        if(err){
            console.log("NO new element created");
        }
        else{
            blog.findOne({_id:req.params.id},function(er,found){
                if(er){
                    console.log("Blog not found while new co,ment is made")
                }
                else{
                    found.comments.push(item);
                    found.save();
                }
            })
            console.log(item);
            res.redirect("/blogs/"+req.params.id);        
        }
    })
})

app.delete("/blogs/:id/comment/:cid",function(req,res){
    comment.findByIdAndRemove(req.params.cid,function(err,item){
        if(err){
            console.log("Item cannot be deleted");
        }
        else{
            console.log(item + "deleted");
            res.redirect("/blogs/"+req.params.id);
        }
    });
})

//**************************************************
//Auth
//**************************************************

app.get("/login",function(req,res){
    res.render("auth/login");
})

//LOGIN
app.post("/login",passport.authenticate("local",{
    successRedirect:"/blogs",
    failureRedirect:"/login"
}), function(req,res){
})

app.get("/register",function(req,res){
    res.render("auth/register");
})

//REGISTER
app.post("/register",function(req,res){
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
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})

//default
app.get("*",function(req,res){
    res.send("Try a proper route pal!!!!");
})


//**************************************************
//Start Server
//**************************************************

//app.listen
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Bloger Website online")
})
// app.listen(3000,function(){
//     console.log("Bloger Website online")
// })