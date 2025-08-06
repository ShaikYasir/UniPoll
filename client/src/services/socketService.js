import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(
    serverUrl = process.env.NODE_ENV === "production"
      ? window.location.protocol + "//" + window.location.host
      : "http://localhost:5000"
  ) {
    this.socket = io(serverUrl, {
      transports: ["websocket", "polling"],
      timeout: 5000,
      path:
        process.env.NODE_ENV === "production" ? "/api/socket.io" : "/socket.io",
    });

    this.socket.on("connect", () => {
      console.log("Connected to server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Teacher methods
  joinAsTeacher() {
    if (this.socket) {
      this.socket.emit("teacher-join");
    }
  }

  createPoll(pollData) {
    if (this.socket) {
      this.socket.emit("create-poll", pollData);
    }
  }

  endPoll() {
    if (this.socket) {
      this.socket.emit("end-poll");
    }
  }

  removeStudent(studentId) {
    if (this.socket) {
      this.socket.emit("remove-student", studentId);
    }
  }

  // Student methods
  joinAsStudent(name, studentId) {
    if (this.socket) {
      this.socket.emit("student-join", { name, studentId });
    }
  }

  submitAnswer(optionId) {
    if (this.socket) {
      this.socket.emit("submit-answer", { optionId });
    }
  }

  // Common methods
  getResults() {
    if (this.socket) {
      this.socket.emit("get-results");
    }
  }

  // Event listeners
  onCurrentPoll(callback) {
    if (this.socket) {
      this.socket.on("current-poll", callback);
    }
  }

  onNewQuestion(callback) {
    if (this.socket) {
      this.socket.on("new-question", callback);
    }
  }

  onPollCreated(callback) {
    if (this.socket) {
      this.socket.on("poll-created", callback);
    }
  }

  onPollUpdated(callback) {
    if (this.socket) {
      this.socket.on("poll-updated", callback);
    }
  }

  onPollResults(callback) {
    if (this.socket) {
      this.socket.on("poll-results", callback);
    }
  }

  onStudentsList(callback) {
    if (this.socket) {
      this.socket.on("students-list", callback);
    }
  }

  onAnswerSubmitted(callback) {
    if (this.socket) {
      this.socket.on("answer-submitted", callback);
    }
  }

  onPollError(callback) {
    if (this.socket) {
      this.socket.on("poll-error", callback);
    }
  }

  onNameTaken(callback) {
    if (this.socket) {
      this.socket.on("name-taken", callback);
    }
  }

  onRemovedByTeacher(callback) {
    if (this.socket) {
      this.socket.on("removed-by-teacher", callback);
    }
  }

  // Remove listeners
  offAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

const socketService = new SocketService();
export default socketService;
