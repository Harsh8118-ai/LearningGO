const OTP = require("../models/otp-model");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
require("dotenv").config(); // Load environment variables

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📌 Generate & Send OTP  
// 📌 Generate & Send OTP  
const sendOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
  
    // 🛑 Purane OTPs delete karo pehle
    await OTP.deleteMany({ email });
  
    const otp = otpGenerator.generate(4, { 
      digits: true, 
      lowerCaseAlphabets: false, 
      upperCaseAlphabets: false, 
      specialChars: false 
    });
  
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      });
  
      await OTP.create({ email, otp });
  
      res.status(200).json({ message: "OTP sent successfully!" });
    } catch (error) {
      console.error("❌ Error sending OTP:", error.message);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  };
  

// 📌 Verify OTP  
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) return res.status(400).json({ message: "Invalid or expired OTP" });

    await OTP.deleteOne({ _id: otpRecord._id }); // Delete OTP after verification
    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

module.exports = { sendOTP, verifyOTP };
