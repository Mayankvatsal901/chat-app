const express = require("express");
const dotenv = require("dotenv");
const { connections } = require("./lib/db.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const authRoutes = require("./routes/auth.routes.js");
const messageRoutes = require("./routes/message.routes.js");

const { app, server } = require("./lib/socket.js");
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

// CORS SETTINGS — MUST MATCH FRONTEND DOMAIN
const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-app-1-drsf.onrender.com", // your frontend static site
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// AUTH & MESSAGE APIS
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// NO wildcard route here (frontend deployed separately)

server.listen(PORT, () => {
  console.log("server is running on port:" + PORT);
  connections();
});
