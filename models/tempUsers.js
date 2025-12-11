//tempUser
const mongoose = require("mongoose");

const tempUsersSchema = new mongoose.Schema({
  uname: String,
  email: String,
  isVerified: Boolean,
  verificationCode: String,
  codeExpiry: Date,
});

const tempUsers = mongoose.model("tempUsers",tempUsersSchema,"tempUsers")
module.exports = tempUsers;
