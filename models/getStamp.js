//getStamp
const mongoose = require("mongoose");

const getStampSchema = new mongoose.Schema({
  uid: String,
  isShowChange: Boolean,
  title: String,
});
const getStamp = mongoose.model("getStamp", getStampSchema, "getStamp");
module.exports = getStamp;