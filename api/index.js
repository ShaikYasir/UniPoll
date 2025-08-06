const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Socket.io configuration for Vercel
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/api/socket.io",
  transports: ["websocket", "polling"],
});

// Middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);
app.use(compression());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

// In-memory storage (replace with database for production)
let polls = [];
let currentPoll = null;
let students = new Map();
let pollResults = new Map();

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // All socket event handlers from the original server.js
  // (Copy the socket event handlers here)

  // Teacher joins
  socket.on("teacher-join", () => {
    socket.join("teachers");
    socket.emit("current-poll", currentPoll);
    socket.emit("students-list", Array.from(students.values()));
    console.log("Teacher joined:", socket.id);
  });

  // Student joins
  socket.on("student-join", (data) => {
    const { name, studentId } = data;

    const existingStudent = Array.from(students.values()).find(
      (s) => s.name === name
    );
    if (existingStudent && existingStudent.socketId !== socket.id) {
      socket.emit("name-taken", { message: "This name is already in use" });
      return;
    }

    students.set(studentId, {
      name,
      socketId: socket.id,
      hasAnswered: currentPoll ? false : null,
      joinedAt: new Date(),
    });

    socket.join("students");
    socket.studentId = studentId;

    if (currentPoll) {
      socket.emit("new-question", currentPoll);
    }

    io.to("teachers").emit("students-list", Array.from(students.values()));
    console.log(`Student ${name} joined:`, socket.id);
  });

  // Other socket handlers...
  socket.on("disconnect", () => {
    if (socket.studentId) {
      const student = students.get(socket.studentId);
      if (student) {
        students.delete(socket.studentId);
        io.to("teachers").emit("students-list", Array.from(students.values()));
        console.log(`Student ${student.name} disconnected`);
      }
    }
    console.log("Client disconnected:", socket.id);
  });
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: "Vercel",
  });
});

app.get("/api/poll-history", (req, res) => {
  const history = Array.from(pollResults.values()).sort(
    (a, b) => new Date(b.startTime) - new Date(a.startTime)
  );
  res.json(history);
});

// Export for Vercel
module.exports = app;
