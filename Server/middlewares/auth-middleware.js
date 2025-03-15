const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        console.log("🔹 Received Authorization Header:", token);

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: Token not provided or invalid format" });
        }

        const jwtToken = token.split(" ")[1]; // Extract token properly
        console.log("🔹 Extracted JWT Token:", jwtToken);

        if (!process.env.JWT_SECRET_KEY) {
            console.error("❌ JWT Secret Key is missing in environment variables");
            return res.status(500).json({ message: "Internal Server Error: Missing JWT Secret Key" });
        }

        // Verify JWT Token
        let isVerified;
        try {
            isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
        } catch (error) {
            console.error("❌ JWT Verification Failed:", error);
            return res.status(401).json({ message: "Unauthorized: Invalid or Expired Token" });
        }

        console.log("✅ Decoded JWT:", isVerified);

        if (!isVerified.id) {
            return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
        }

        // Find user in DB
        const userData = await User.findById(isVerified.id).select("-password");

        if (!userData) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        console.log("🔹 Authenticated User:", userData);

        // Attach user to request object
        req.user = userData;
        req.token = jwtToken;
        req.userID = userData._id;

        next();
    } catch (error) {
        console.error("❌ Authentication Error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized: Token expired" });
        } else {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    }
};

module.exports = authMiddleware;
