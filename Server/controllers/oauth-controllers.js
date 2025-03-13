const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

// 🔹 Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
};

// ✅ OAuth Login (Google/GitHub)
const oauthLogin = async (req, res) => {
  try {
    const { email, username, googleId, githubId } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (googleId && !user.googleId) user.googleId = googleId;
      if (githubId && !user.githubId) user.githubId = githubId;
      await user.save();
    } else {
      let uniqueUsername = username;
      let count = 1;
      while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${username}${count++}`;
      }

      user = new User({ username: uniqueUsername, email, googleId, githubId });
      await user.save();
    }

    const token = generateToken(user);
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}&username=${user.username}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=OAuthFailed`);
  }
};

// ✅ Update Username
const updateUsername = async (req, res) => {
  try {
    const { userId, newUsername } = req.body;

    if (!userId || !newUsername) {
      return res.status(400).json({ message: "User ID and new username are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: newUsername },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateToken(updatedUser);

    res.status(200).json({
      message: "Username updated successfully",
      token,
      user: { id: updatedUser._id, username: updatedUser.username, email: updatedUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Export OAuth Controller
module.exports = { oauthLogin, updateUsername };
