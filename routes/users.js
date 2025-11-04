const express = require("express");
const router = express.Router();

const Users = require("../models/users");

//註冊會員
router.post("/addUser", async (req, res) => {
  const { uname, email, pwd, id } = req.body;
  const hasUser = await Users.findOne({ _id:id });
  if (hasUser) {
    const updateData = {};
    updateData.uname = uname;
    updateData.email = email;
    if (pwd) updateData.pwd = pwd;
    const updatedUser = await Users.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "會員資料更新成功。",
      data: {
        pwd: updatedUser.pwd,
        name: updatedUser.uname,
        email: updatedUser.email,
      },
    });
  } else {
    try {
      const newUser = new Users({
        uname: req.body.uname,
        pwd: req.body.pwd,
        email: req.body.email,
      });
      await newUser.save();
      res.status(201).json({ message: "✅ user added!", data: newUser });
    } catch (error) {
      console.log("❌ Error saving user:", error);
      res.status(500).json({ error: error.message });
    }
  }
});

// email查詢會員資料
router.post("/getUser", async (req, res) => {
  try {
    const { email } = req.query; // 例如 /api/user?email=Febe@gmail.com

    if (!email) {
      return res.status(400).json({ error: "❌ 請提供 email" });
    }
    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .json({ message: "❌ 查無此會員", status: "error" });
    }

    res.status(200).json({
      email: user.email,
      pwd: user.pwd,
      id: user._id,
      uname: user.uname,
    });
  } catch (error) {
    console.error("❌ 查詢會員發生錯誤:", error);
    res.status(500).json({ error: "伺服器錯誤，請稍後再試" });
  }
});

module.exports = router;
