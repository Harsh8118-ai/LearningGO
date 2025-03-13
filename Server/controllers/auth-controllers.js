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
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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

    res.status(201).json({
      message: "Registration Successful",
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    next(error);
  }
};

// ✅ **User Login (Manual Login)**
const login = async (req, res, next) => {
  try {
    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ mobileNumber });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid Mobile Number or Password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login Successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// ✅ **Get User Data**
const user = async (req, res) => {
  try {
    const userData = req.user;
    return res.status(200).json({ userData });
  } catch (error) {
    console.log(`Error from the user route: ${error}`);
    res.status(500).json({ message: "Internal server error" });
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

    res.status(200).json({
      message: "Profile Updated Successfully",
      user: userDetails,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ **Export Controllers**
module.exports = { home, register, login, user, updateProfile };
