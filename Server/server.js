require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const session = require("express-session");
const passport = require("passport");
const connectDb = require("./utils/db");
require("./utils/passport-config"); // ✅ Initialize OAuth Strategies

// ✅ Import Routes
const authRoute = require("./routes/auth-route");
const oauthRoute = require("./routes/oauth-route");
const reviewRoute = require("./routes/review-route");
const quesRoute = require("./routes/ques-route");
const friendRoute = require("./routes/friend-route"); // ✅ New Friend System Route

const app = express();

// ✅ CORS Configuration
const allowedOrigins = process.env.NODE_ENV === "production"
  ? ["https://silkenglamour.com", "https://www.silkenglamour.com", "https://silken-glamour.vercel.app", "https://silkenglamour.netlify.app"]
  : ["http://localhost:5173"];

app.use(compression());
app.use(cors({ origin: allowedOrigins, methods: "GET, POST, PUT, DELETE", credentials: true }));
app.use(express.json());

// ✅ Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ✅ API Routes
app.use("/api/auth", authRoute);
app.use("/api/oauth", oauthRoute);
app.use("/api/form", reviewRoute);
app.use("/api/ques-post", quesRoute);
app.use("/api/friends", friendRoute); // ✅ Friend System API Route

// ✅ Root Route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to LearningGo Backend!");
});

// ✅ Error Handling Middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message || "Internal Server Error",
    extraDetails: error.extraDetails || "No additional information",
  });
});

// ✅ Connect to Database & Start Server
connectDb().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at port: ${PORT}`);
  });
});
