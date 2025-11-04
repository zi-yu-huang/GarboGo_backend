////Users
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uname: String,
  pwd: String,
  email: String,
  isVerified:Boolean,
  verificationCode:String,
  codeExpiry:Date
});

const Users = mongoose.model("Users", userSchema, "users");
module.exports = Users;
