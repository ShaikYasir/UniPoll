const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);
app.use(express.json());

// Serve static files from the React app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// In-memory storage (replace with database for production)
let polls = [];
let currentPoll = null;
let students = new Map(); // studentId -> { name, socketId, hasAnswered }
let pollResults = new Map(); // pollId -> { question, options, votes, startTime, endTime }

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

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

    // Check if name is already taken
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

    // Send current poll if exists
    if (currentPoll) {
      socket.emit("new-question", currentPoll);
    }

    // Update teachers with new student list
    io.to("teachers").emit("students-list", Array.from(students.values()));
    console.log(`Student ${name} joined:`, socket.id);
  });

  // Teacher creates a new poll
  socket.on("create-poll", (pollData) => {
    const { question, options, timeLimit } = pollData;

    // Check if all students have answered previous question or no question exists
    const studentsArray = Array.from(students.values());
    const allAnswered =
      studentsArray.length === 0 ||
      studentsArray.every(
        (s) => s.hasAnswered === true || s.hasAnswered === null
      );

    if (currentPoll && !allAnswered) {
      socket.emit("poll-error", {
        message:
          "Cannot create new poll. Not all students have answered the previous question.",
      });
      return;
    }

    currentPoll = {
      id: Date.now().toString(),
      question,
      options: options.map((opt, index) => ({
        id: index,
        text: opt,
        votes: 0,
      })),
      timeLimit: timeLimit || 60,
      startTime: new Date(),
      endTime: new Date(Date.now() + (timeLimit || 60) * 1000),
      isActive: true,
    };

    // Reset student answer status
    students.forEach((student) => {
      student.hasAnswered = false;
    });

    // Send to all students
    io.to("students").emit("new-question", currentPoll);

    // Send to teachers
    io.to("teachers").emit("poll-created", currentPoll);

    // Auto-end poll after time limit
    setTimeout(() => {
      if (currentPoll && currentPoll.id === currentPoll.id) {
        endCurrentPoll();
      }
    }, (timeLimit || 60) * 1000);

    console.log("New poll created:", question);
  });

  // Student submits answer
  socket.on("submit-answer", (data) => {
    if (!currentPoll || !currentPoll.isActive) {
      socket.emit("poll-error", { message: "No active poll" });
      return;
    }

    const student = students.get(socket.studentId);
    if (!student) {
      socket.emit("poll-error", { message: "Student not found" });
      return;
    }

    if (student.hasAnswered) {
      socket.emit("poll-error", {
        message: "You have already answered this question",
      });
      return;
    }

    const { optionId } = data;
    const option = currentPoll.options.find((opt) => opt.id === optionId);

    if (!option) {
      socket.emit("poll-error", { message: "Invalid option" });
      return;
    }

    // Update vote count
    option.votes++;
    student.hasAnswered = true;

    // Check if all students have answered
    const studentsArray = Array.from(students.values());
    const allAnswered = studentsArray.every((s) => s.hasAnswered === true);

    if (allAnswered) {
      endCurrentPoll();
    } else {
      // Send updated poll to teachers
      io.to("teachers").emit("poll-updated", {
        ...currentPoll,
        studentsAnswered: studentsArray.filter((s) => s.hasAnswered).length,
        totalStudents: studentsArray.length,
      });
    }

    socket.emit("answer-submitted", { success: true });
    console.log(`Student ${student.name} answered poll:`, currentPoll.question);
  });

  // Teacher requests to end poll
  socket.on("end-poll", () => {
    if (currentPoll && currentPoll.isActive) {
      endCurrentPoll();
    }
  });

  // Get poll results
  socket.on("get-results", () => {
    if (currentPoll) {
      socket.emit("poll-results", currentPoll);
    }
  });

  // Teacher removes student
  socket.on("remove-student", (studentId) => {
    const student = students.get(studentId);
    if (student) {
      io.to(student.socketId).emit("removed-by-teacher");
      students.delete(studentId);
      io.to("teachers").emit("students-list", Array.from(students.values()));
      console.log(`Student ${student.name} removed by teacher`);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    // Remove student if it was a student connection
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

// Function to end current poll
function endCurrentPoll() {
  if (currentPoll) {
    currentPoll.isActive = false;
    currentPoll.endTime = new Date();

    // Store poll results
    pollResults.set(currentPoll.id, { ...currentPoll });

    // Send results to everyone
    io.emit("poll-results", currentPoll);

    console.log("Poll ended:", currentPoll.question);
  }
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/api/poll-history", (req, res) => {
  const history = Array.from(pollResults.values()).sort(
    (a, b) => new Date(b.startTime) - new Date(a.startTime)
  );
  res.json(history);
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

// For Vercel deployment, export the app and socket server
if (process.env.VERCEL) {
  module.exports = { app, io };
} else {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
}
