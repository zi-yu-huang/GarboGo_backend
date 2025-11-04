// services/emailService.js

const nodemailer = require('nodemailer');
// 建議從環境變數載入這些機密資訊
const { EMAIL_USER, EMAIL_PASS, EMAIL_SERVICE } = process.env; 

// 步驟一：配置郵件發送器 (Transporter)
let transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE || 'Gmail', // 使用 Gmail 或其他服務
  auth: {
    user: 'febehuang07@gmail.com', // 您的發送郵箱
    pass: 'uevx gxyf hrfz yrgv'  // 郵箱的專用應用程式密碼
  }
});

// 封裝發送 Email 的核心邏輯
async function sendVerificationEmail(recipientEmail, verificationCode) {
  try {
    await transporter.sendMail({
      from: `"GarboGo 團隊" <${EMAIL_USER}>`,
      to: recipientEmail,
      subject: 'GarboGo 帳號驗證碼',
      html: `<p>謝謝您註冊GarboGo！</p>
      <p>您的驗證碼是：<strong>${verificationCode}</strong></p>`
    });
    console.log(`✅ Verification email sent to ${recipientEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${recipientEmail}:`, error);
    // 實務上可以選擇拋出錯誤或紀錄日誌
    throw new Error('Failed to send verification email.'); 
  }
}

// 產生隨機驗證碼的輔助函式 (6位數字)
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 匯出需要的函式
module.exports = {
  sendVerificationEmail,
  generateCode
};