var mongoose = require("mongoose");

//comments
var commentSchema = new mongoose.Schema({
    content: String,
    author: String,
    date: Date,
})

module.exports = mongoose.model("comment",commentSchema);
