var express = require("express");
var router = express.Router();
var blog = require("../modules/blog");

//Login Middleware
function isLogged(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please log in!!!");
    res.redirect("/login");
}


//**************************************************
//blogs Routes
//**************************************************

//home
router.get("/",function(req,res){
    res.render("home");
})

//blogs
router.get("/blogs",function(req,res){
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
router.get("/blogs/new",isLogged,function(req,res){
    res.render("blog/new");
})

//create
router.post("/blogs",function(req,res){
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
            req.flash("success","Blog Created Successfully");
            res.redirect("/blogs");        
        }
    })
})

//show
router.get("/blogs/:id",function(req,res){

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
router.get("/blogs/:id/edit",isLogged,function(req,res){
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
router.put("/blogs/:id",function(req,res,next){
        req.body.blog.date= Date();
        next();
        },function(req,res){
        console.log(req.body)
        blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,update){
            if(err){
                console.log("Item cannot be updated");
            }
            else{
                req.flash("success","Blog Updated Successfully")
                res.redirect("/blogs/"+req.params.id)
            }
        })
})

//delete
router.delete("/blogs/:id",isLogged,function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err,item){
        if(err){
            console.log("Item cannot be deleted");
        }
        else{
            console.log(item + "deleted");
            req.flash("success","Blog Deleted Successfully");
            res.redirect("/blogs");
        }
    });
})

module.exports = router;