//TrashCan
const mongoose = require("mongoose");

// 定義資料表結構（Schema）
const trashcanSchema = new mongoose.Schema({
  tname: String,
  region: String,
  street: String,
  lat: Number,
  lng: Number,
  maxTcapacity: Number,
  General:{
    qrcode:String,
    tcapacity:String,
    tid:Number
  },
  Recycle:{
    qrcode:String,
    tcapacity:String,
    tid:Number
  }
});

// 建立模型（Model）並指定資料表名稱為 "trashcan"
const Trashcan = mongoose.model("Trashcan", trashcanSchema, "trashcan");

module.exports = Trashcan;
