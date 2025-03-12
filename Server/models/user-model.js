const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [255, "Username must not be more than 255 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [255, "Email must not be more than 255 characters"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email format",
      ],
    },
    mobileNumber: {
      type: String,
      required: [true, "Phone Number is required"],
      unique: true,
      match: [/^\d{10}$/, "Phone Number must be exactly 10 digits."],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [1024, "Password must not be more than 1024 characters"],
    },
  },
  { timestamps: true }
);

// 🔹 **Middleware: Hash Password Before Saving**
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// 🔹 **Method: Compare Password**
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate Token Method
userSchema.methods.generateToken = function () {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT Secret Key is missing in environment variables!");
  }
  
  return jwt.sign(
    {
      userId: this._id.toString(),
      mobileNumber: this.mobileNumber,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30d" } // Token expires in 30 days
  );
};

// Export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
