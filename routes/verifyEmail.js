const express = require("express");
const router = express.Router();
// 新增一筆垃圾桶資料
const User = require("../models/users");

const { sendVerificationEmail, generateCode } = require("../services/optEmail"); // 假設這是您建立的Email服務

// 新增一筆會員資料 (步驟 2)
router.post("/register", async (req, res) => {
  const { uname, email } = req.body;

  // Step 1: 檢查 Email 欄位是否提供 (基本檢查)
  if (!email) {
    return res.status(400).json({
      message: "請提供電子郵件地址。",
      status: "error",
    });
  }

  try {
    // Step 2: 查找用戶
    const existingUser = await User.findOne({ email });

    // 準備新的驗證碼和過期時間
    const verificationCode = generateCode();
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10分鐘後過期

    let actionMessage = "";
    let updateResult = null;

    // =======================================================
    // A. 處理用戶已存在的情境 (重新發送或拒絕)
    // =======================================================
    if (existingUser) {
      // if (existingUser.isVerified) {
      //   // 情境 A1: 已註冊且已驗證 (拒絕發送，應引導登入)
      //   return res.status(400).json({
      //     message: "此帳號已完成註冊和驗證，請直接登入。",
      //     status: "verified",
      //   });
      // } else {
        // 情境 A2: 已註冊但未驗證 (重新發送/更新舊記錄)
        actionMessage = "驗證碼已發送。";

        // 更新舊記錄的驗證碼和過期時間
        updateResult = await User.findOneAndUpdate(
          { email: email },
          {
            $set: {
              verificationCode: verificationCode,
              codeExpiry: expiryTime,
            },
          },
          { new: true }
        );
      // }

      // =======================================================
      // B. 處理用戶不存在的情境 (首次註冊/發送)
      // =======================================================
    } else {
      // 情境 B: 用戶不存在 (創建新記錄並發送)
      actionMessage = "註冊成功，請檢查您的電子郵件以完成驗證。";

      const newUser = new User({
        uname: uname , // 假設 uname 可能是可選的
        email: email,
        // ⚠️ 暫時不設定密碼 (pwd)，留待驗證通過後設定
        isVerified: false,
        verificationCode: verificationCode,
        codeExpiry: expiryTime,
      });
      updateResult = await newUser.save();
    }

    // Step 3: 發送 Email (無論是新增還是更新，都需要發送)
    await sendVerificationEmail(email, verificationCode);

    // Step 4: 成功回傳
    res.status(200).json({
      message: actionMessage,
      status: "pending_verification",
      data: { email: email },
    });
  } catch (error) {
    console.error("❌ 發送驗證碼處理錯誤:", error);
    res.status(500).json({ error: error.message, status: "error" });
  }
});

// 驗證 Email API (步驟 3)
router.post("/verifyEmail", async (req, res) => {
  const { email, code } = req.body;

  try {
    // 1. 查找用戶
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "用戶不存在" });
    }

    // 2. 檢查驗證碼是否匹配且未過期
    if (user.verificationCode === code && user.codeExpiry > Date.now()) {
      // 3. 驗證成功：更新狀態
      user.isVerified = true;
      user.verificationCode = undefined; // 清除驗證碼
      user.codeExpiry = undefined;
      await user.save();

      res.status(200).json({ message: "✅ 註冊成功，帳號已啟用！" });
    } else {
      res
        .status(200)
        .json({ message: "❌ 驗證碼錯誤或已過期", status: "error" });
    }
  } catch (error) {
    res.status(500).json({ error: "伺服器錯誤" });
  }
});

module.exports = router;
