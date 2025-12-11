const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendVerificationEmail(recipientEmail, verificationCode) {
  const msg = {
    to: recipientEmail,
    from: 'febehuang07@gmail.com',
    subject: 'GarboGo 帳號驗證碼',
    html: `
      <p>謝謝您註冊 GarboGo！</p>
      <p>您的驗證碼是：<strong>${verificationCode}</strong></p>
    `
  };

  try {
    await sgMail.send(msg);
    console.log(`✔️ Email sent to ${recipientEmail}`);
  } catch (error) {
    console.error("❌ SendGrid Error:", error);

    if (error.response && error.response.body) {
      console.error("🔍 SendGrid detailed error:", error.response.body);
    }

    throw new Error('Failed to send verification email.');
  }
}


function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = {
  sendVerificationEmail,
  generateCode
};
