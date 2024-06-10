const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const passport = require("./auth/passport-config");
require("dotenv").config();
require("events").EventEmitter.defaultMaxListeners = 20;

// get data from rmf-web api-server and send to client
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://192.168.1.48:5173", // Change this to your Vite development server port
    credentials: true,
  },
});
const clientIO = require("socket.io-client");

io.on("connection", (socket) => {
  console.log("New client connected");
  const api_url = "192.168.1.48";
  try {
    // Assuming you have already established a connection to the Socket.io server
    const socket = clientIO(`http://${api_url}:8000`);

    // Function to subscribe to a room
    function subscribeToRoom(roomName) {
      console.log("Subscribing to room");
      // Send a message to the 'subscribe' room with the desired room name
      socket.emit("subscribe", { room: roomName });
    }

    // Function to handle incoming messages from the subscribed room
    function handleRobotState(message) {
      // console.log("Received message:", message);
      // Emit the message to your Socket.IO server
      io.emit("tinyRobot_state", message);
    }

    // Subscribe to a specific room
    subscribeToRoom("/fleets/tinyRobot/state");

    // Listen for messages on that room
    socket.on("/fleets/tinyRobot/state", handleRobotState);
  } catch (err) {
    console.log(err);
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const port = process.env.PORT;
if (!port) {
  console.error("Error: The PORT environment variable is not defined.");
  process.exit(1);
}

const db = require("./models/createdb");

const session = require("express-session");
const MemoryStore = require("memorystore")(session);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    cookie: {
      maxAge: 86400000, // Session duration in milliseconds (24h)
    },
  })
);
// Serve images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "http://192.168.1.48:5173", // Change this to your Vite development server port
    credentials: true,
  })
);

// Routes
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // If authentication failed, `info` should contain the message
      return res.status(401).send({ success: false, message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.send({ success: true, user: user });
    });
  })(req, res, next);
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.send({ success: true });
  });
});

app.get("/checkAuth", (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ authenticated: true });
  } else {
    res.send({ authenticated: false });
  }
});

const home_api = require("./API/home");
const users_api = require("./API/user");
const retrieve_api = require("./API/retrieve");
const store_api = require("./API/store");
const setting_api = require("./API/setting");
const map_api = require("./API/map");
const { app: fleet_api } = require("./API/fleet");
const { app: item_api } = require("./API/item");
const { app: warehouse_api } = require("./API/warehouse");

app.use("/home", home_api);
app.use("/user", users_api);
app.use("/retrieve", retrieve_api);
app.use("/store", store_api);
app.use("/setting", setting_api);
app.use("/map", map_api);
app.use("/fleet", fleet_api);
app.use("/item", item_api);
app.use("/warehouse", warehouse_api);

// Close database when server is shut down
process.on("SIGINT", () => {
  console.log("Server is shutting down...");

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error("Error closing database connection:", err);
      process.exit(1);
    } else {
      console.log("Database connection closed.");
      process.exit();
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello, welcome to my server!");
});

// Any that are not found / default
app.use(function (req, res) {
  res.sendStatus(404);
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// for production after running $npm run build in client folder
/*
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});
*/
