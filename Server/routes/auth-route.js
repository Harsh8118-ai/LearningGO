const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controllers"); // ✅ Ensure this path is correct
const { signupSchema, loginSchema } = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");
const authMiddleware = require("../middlewares/auth-middleware");

// 🔹 **Check if controllers are defined**
if (!authControllers) {
  throw new Error("authControllers is undefined. Check your auth-controllers.js file.");
}

// ✅ Home Route
router.route("/").get(authControllers.home);

// ✅ Manual Signup & Login
router.route("/register").post(validate(signupSchema), authControllers.register);
router.route("/login").post(validate(loginSchema), authControllers.login);

// ✅ OAuth Signup/Login (Google/GitHub)
router.route("/oauth").post(authControllers.oauthLogin);

// ✅ Profile Routes
router.route("/updateProfile").put(authMiddleware, authControllers.UpdateProfile);
router.route("/user").get(authMiddleware, authControllers.user);

module.exports = router;
