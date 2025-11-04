//addStamp
const mongoose = require("mongoose");

const addStampSchema = new mongoose.Schema({
  uid: String,
  stampDate: String
});
const addStamp = mongoose.model("addStamp", addStampSchema, "addStamp");
module.exports = addStamp;