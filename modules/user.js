var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//user - username,password
var userSchema = new mongoose.Schema({
    username: String,
    password: String
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user",userSchema);
