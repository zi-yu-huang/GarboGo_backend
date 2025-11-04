//favorite_list
const mongoose = require("mongoose");

// 定義資料表結構（Schema）
const favorite_listSchema = new mongoose.Schema({
  tname: String,
  uid: String,
});

// 建立模型（Model）並指定資料表名稱為 "favorite_list"
const favorite_list = mongoose.model("favorite_list", favorite_listSchema, "favorite_list");

module.exports = favorite_list;
