const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

// 🔹 Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
};

// ✅ **Home Controller**
const home = async (req, res) => {
  try {
    res.status(200).json({ msg: "Welcome to our home page" });
  } catch (error) {
    console.error("❌ Home Route Error:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ **User Registration (Manual Signup)**
const register = async (req, res, next) => {
  try {
    const { username, email, mobileNumber, password } = req.body;

    if (!username || !email || !mobileNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExist = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (userExist) {
      return res.status(400).json({ message: "Email or Mobile Number already exists" });
    }

    const newUser = new User({ username, email, mobileNumber, password });
    await newUser.save();

    const token = generateToken(newUser._id);

    return res.status(201).json({
      message: "Registration Successful",
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ **User Login (Manual Login)**
const login = async (req, res, next) => {
  try {
    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Fix: Ensure password is selected
    const user = await User.findOne({ mobileNumber }).select("+password");
    if (!user) {
      console.log("⚠️ User not found:", mobileNumber);
      return res.status(400).json({ message: "Invalid Mobile Number or Password" });
    }

    // Fix: Password comparison
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("❌ Incorrect password for user:", mobileNumber);
      return res.status(400).json({ message: "Invalid Mobile Number or Password" });
    }

    console.log("✅ Login successful for user:", mobileNumber);

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login Successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ **Get User Data**
const user = async (req, res) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("❌ Get User Data Error:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ **Update User Profile**
const updateProfile = async (req, res, next) => {
  try {
    const { username, email, mobileNumber } = req.body;
    const userId = req.user._id;

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== userDetails.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    if (mobileNumber && mobileNumber !== userDetails.mobileNumber) {
      const mobileExists = await User.findOne({ mobileNumber });
      if (mobileExists) {
        return res.status(400).json({ message: "Mobile Number already in use" });
      }
    }

    userDetails.username = username || userDetails.username;
    userDetails.email = email || userDetails.email;
    userDetails.mobileNumber = mobileNumber || userDetails.mobileNumber;

    await userDetails.save();

    return res.status(200).json({
      message: "Profile Updated Successfully",
      user: {
        id: userDetails._id,
        username: userDetails.username,
        email: userDetails.email,
        mobileNumber: userDetails.mobileNumber,
      },
    });
  } catch (error) {
    console.error("❌ Profile Update Error:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ **Export Controllers**
module.exports = { home, register, login, user, updateProfile };
