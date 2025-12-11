require('dotenv').config();
const express = require("express"); //引入 Express：定義了您要使用哪個框架來建立伺服器。
const cors = require("cors"); //引入 cors：定義了您的伺服器可以接受哪些來源（例如您的前端網頁）的請求，以避免瀏覽器的安全限制。
const app = express(); //建立 app 實例：定義了一個可操作的伺服器核心，您之後所有的功能（接收請求、回傳資料等）都將在這個 app 上建立。
const mongoose = require("mongoose");

// 中介層（middleware）
app.use(cors());
app.use(express.json());

// MongoDB 連線
async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://ziyuhuang1007_db_user:275F9Q4PpZOQSvgn@cluster0.cl1piyl.mongodb.net/GarboGo?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ MongoDB connected!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

const trashcan = require("./routes/trashcan");
const user = require("./routes/users");
const verifyEmail = require("./routes/verifyEmail");
const favoriteList = require("./routes/favorite_list");
const addStamp = require("./routes/addStamp");
const addTicket = require("./routes/addTicket");
app.use("/api", trashcan); // 定義所有 API 請求都以 /api 為開頭 (例如：/api/trashcans)
app.use("/api", user);
app.use("/api", verifyEmail);
app.use("/api", favoriteList);
app.use("/api", addStamp);
app.use("/api", addTicket);
// // ** A. 處理您的前端基底路徑 **
// // 如果前端的基底路徑是 /GarboGo_/，則增加這個路由
// app.get('/GarboGo_/', (req, res) => {
//   // 您可以回傳一個簡單的訊息，告訴前端這是後端伺服器
//   res.send('Welcome to the GarboGo Backend API Base Path!');
// });

// // ** B. 處理根路徑 ( / ) **
// // 確保連線到 http://localhost:4000/ 時不會報錯
// app.get('/', (req, res) => {
//   res.send('Welcome to the Main Backend Server!');
// });

// 先連線 MongoDB，再啟動伺服器
connectDB().then(() => {
  app.listen(4000, () => {
    console.log("🚀 Server running at http://localhost:4000");
  });
});
