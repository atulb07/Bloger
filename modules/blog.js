var mongoose = require("mongoose");

//blogs - pic, title, desc, date
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    desc: String,
    comments: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }],
    author: String,
    date: Date,
})

module.exports = mongoose.model("blog",blogSchema);
