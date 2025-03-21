require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const compression = require("compression");
const session = require("express-session");
const passport = require("passport");
const connectDb = require("./utils/db");
require("./utils/passport-config"); // ✅ Initialize OAuth

// ✅ Import Routes
const authRoute = require("./routes/auth-route");
const oauthRoute = require("./routes/oauth-route");
const quesRoute = require("./routes/ques-route");
const friendRoute = require("./routes/friend-route");
const messageRoute = require("./routes/chat-route"); // ✅ Message API Route


// ✅ Import WebSocket Controller
const initializeSocket = require("./controllers/webSocket-controllers");

const app = express();
const server = http.createServer(app); // ✅ Create HTTP Server for WebSocket
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production"
      ? ["https://silkenglamour.com", "https://www.silkenglamour.com", "https://silken-glamour.vercel.app", "https://silkenglamour.netlify.app"]
      : ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ CORS & Middleware
app.use(compression());
app.use(cors({ origin: io.opts.cors.origin, methods: "GET, POST, PUT, DELETE", credentials: true }));
app.use(express.json());
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
app.use("/api/ques-post", quesRoute);
app.use("/api/friends", friendRoute);
app.use("/api/chat", messageRoute); // ✅ Message API Route

// ✅ Initialize WebSocket
initializeSocket(io);

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
  server.listen(PORT, () => {
    console.log(`🚀 Server is running at port: ${PORT}`);
  });
});