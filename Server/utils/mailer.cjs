const nodemailer = require("nodemailer");
console.log("🔐 EMAIL_USER:", process.env.EMAIL_USER);
console.log("🔐 EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");
// 📩 Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail
    pass: process.env.EMAIL_PASS,   // app password
  },
});

/* ---------------------------------------------------
   SEND EMAIL FUNCTION
----------------------------------------------------- */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"Mellow Café ☕" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📧 Email sent:", info.response);

    return true;
  } catch (error) {
    console.error("❌ Email send error:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;