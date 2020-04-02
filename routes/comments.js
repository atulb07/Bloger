var express = require("express");
var router = express.Router({mergeParams:true});
var blog = require("../modules/blog");
var comment = require("../modules/comment");

//**************************************************
//Comment Routes
//**************************************************

router.post("/",function(req,res){
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

router.delete("/:cid",function(req,res){
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

module.exports = router;