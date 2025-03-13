const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

// ✅ **Home Controller**
const home = async (req, res) => {
  try {
    res.status(200).json({ msg: "Welcome to our home page" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ **User Registration (Manual Signup)**
const register = async (req, res, next) => {
  try {
    const { username, email, mobileNumber, password } = req.body;

    // Validation
    if (!username || !email || !password || !mobileNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email or mobile number already exists
    const userExist = await User.findOne({ 
      $or: [{ email }, { mobileNumber }] 
    });

    if (userExist) {
      return res.status(400).json({ message: "Email or Mobile Number already exists" });
    }

    // Create new user
    const userCreated = await User.create({
      username, 
      email, 
      mobileNumber, 
      password,
    });

    // Respond with success and token
    res.status(201).json({
      msg: "Registration Successful",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

// ✅ **User Login (Manual Login)**
const login = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    // Validation
    if (!mobileNumber || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if user exists
    const userExist = await User.findOne({ mobileNumber });

    if (!userExist) {
      return res.status(400).json({ message: "Invalid Mobile Number or Password" });
    }

    // Compare password
    const isPasswordValid = await userExist.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Mobile Number or Password" });
    }

    // Respond with success and token
    return res.status(200).json({
      msg: "Login Successful",
      token: await userExist.generateToken(),
      userId: userExist._id.toString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ **OAuth Login (Google/GitHub)**
const oauthLogin = async (req, res) => {
  try {
    const { email, username, googleId, githubId } = req.body;

    // Check if user already exists with OAuth ID
    let user = await User.findOne({ $or: [{ googleId }, { githubId }] });

    // If not found by OAuth ID, check by email
    if (!user) {
      user = await User.findOne({ email });

      // If found by email but OAuth ID is missing, update the record
      if (user) {
        if (googleId) user.googleId = googleId;
        if (githubId) user.githubId = githubId;
        await user.save();
      }
    }

    // If user is still not found, create a new user
    if (!user) {
      user = new User({
        username,
        email,
        googleId: googleId || null,
        githubId: githubId || null,
      });

      await user.save();
    }

    // Generate JWT token
    const token = user.generateToken();

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("OAuth login error:", error);
    res.status(500).json({ error: "Internal server error" });
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
const UpdateProfile = async (req, res) => {
  try {
    const { username, email, mobileNumber } = req.body;
    const userId = req.user._id;

    // Find user
    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    if (username) userDetails.username = username;
    if (email) userDetails.email = email;
    if (mobileNumber) userDetails.mobileNumber = mobileNumber;

    // Save the updated profile
    await userDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while updating profile",
      error: error.message,
    });
  }
};

// ✅ **Export Controllers**
module.exports = { home, register, login, oauthLogin, user, UpdateProfile };
