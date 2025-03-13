require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const connectDb = require("./utils/db");
const User = require("./models/user-model");

const authRoute = require("./routes/auth-route");
const reviewRoute = require("./routes/review-route");
const quesRoute = require("./routes/ques-route");

const app = express();

// ✅ CORS Configuration
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://silkenglamour.com",
        "https://www.silkenglamour.com",
        "https://silken-glamour.vercel.app",
        "https://silkenglamour.netlify.app",
      ]
    : ["http://localhost:5173", "http://localhost:5173/login"];

const corsOptions = {
  origin: allowedOrigins,
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};

// ✅ Middleware
app.use(compression());
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

/* ───────────────────────────────────────────── */
/* ✅ GitHub OAuth Strategy */
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails?.[0]?.value });

        if (!user) {
          user = await User.create({
            username: profile.username || "GitHub User",
            email: profile.emails?.[0]?.value || `github_${profile.id}@example.com`,
            githubId: profile.id,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

/* ✅ Google OAuth Strategy */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails?.[0]?.value });

        if (!user) {
          user = await User.create({
            username: profile.displayName || "Google User",
            email: profile.emails?.[0]?.value,
            googleId: profile.id,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

/* ✅ Serialize & Deserialize User */
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

/* ───────────────────────────────────────────── */
/* ✅ GitHub Auth Routes */
app.get("/api/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

app.get(
  "/api/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:5173/login"); // Redirect to frontend after login
  }
);

/* ✅ Google Auth Routes */
app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:5173/login"); // Redirect to frontend after login
  }
);

/* ✅ Logout Route */
app.get("/api/auth/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("http://localhost:5173/login");
  });
});

/* ───────────────────────────────────────────── */
/* ✅ Root route */
app.get("/", (req, res) => {
  res.status(200).send("Welcome to LearningGo Backend!");
});

/* ✅ API Routes */
app.use("/api/auth", authRoute);
app.use("/api/form", reviewRoute);
app.use("/api/ques-post", quesRoute);

/* ✅ Error handling middleware */
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  res.status(statusCode).json({
    message: error.message || "Internal Server Error",
    extraDetails: error.extraDetails || "No additional information",
  });
});

/* ✅ Connect to Database & Start Server */
connectDb().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at port: ${PORT}`);
  });
});
