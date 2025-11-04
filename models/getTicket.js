//getTicket
const mongoose = require("mongoose");

const getTicketSchema = new mongoose.Schema({
  uid: String,
  t0: Number, //卷
  t1: Number,//包
});

const getTicket = mongoose.model("getTicket", getTicketSchema, "getTicket");
module.exports = getTicket;
