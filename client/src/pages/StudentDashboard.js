import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import socketService from "../services/socketService";
import {
  setCurrentPoll,
  setResults,
  setTimeRemaining,
  decrementTime,
  setError,
  clearError,
} from "../store/pollSlice";
import {
  setUserType,
  setStudentInfo,
  setConnected,
  setHasAnswered,
} from "../store/userSlice";
import PollQuestion from "../components/PollQuestion";
import PollResults from "../components/PollResults";
import Timer from "../components/Timer";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPoll, results, timeRemaining, error } = useSelector(
    (state) => state.poll
  );
  const { studentName, isConnected, hasAnswered } = useSelector(
    (state) => state.user
  );

  const [nameInput, setNameInput] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    dispatch(setUserType("student"));

    // Generate unique student ID for this tab
    const tabId =
      sessionStorage.getItem("studentId") ||
      Date.now().toString() + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem("studentId", tabId);

    // Check if student name is already stored for this tab
    const storedName = sessionStorage.getItem("studentName");
    if (storedName) {
      setNameInput(storedName);
      joinAsStudent(storedName, tabId);
    }

    return () => {
      socketService.offAllListeners();
      socketService.disconnect();
      dispatch(setConnected(false));
    };
  }, [dispatch, joinAsStudent]);

  const startTimer = React.useCallback(
    (timeLimit) => {
      const interval = setInterval(() => {
        dispatch(decrementTime());
      }, 1000);

      // Clear interval after time limit
      setTimeout(() => {
        clearInterval(interval);
      }, timeLimit * 1000);
    },
    [dispatch]
  );

  const joinAsStudent = React.useCallback(
    (name, id) => {
      // Connect to socket
      socketService.connect();
      dispatch(setConnected(true));

      socketService.joinAsStudent(name, id);
      dispatch(setStudentInfo({ name, id }));

      // Store name for this tab
      sessionStorage.setItem("studentName", name);
      setIsJoined(true);

      // Socket event listeners
      socketService.onNewQuestion((poll) => {
        dispatch(setCurrentPoll(poll));
        dispatch(setTimeRemaining(poll.timeLimit || 60));
        dispatch(setHasAnswered(false));
        setSelectedOption(null);
        setShowResults(false);

        // Start countdown timer
        startTimer(poll.timeLimit || 60);
      });

      socketService.onPollResults((results) => {
        dispatch(setResults(results));
        dispatch(setCurrentPoll(null));
        setShowResults(true);
      });

      socketService.onAnswerSubmitted((response) => {
        if (response.success) {
          dispatch(setHasAnswered(true));
        }
      });

      socketService.onPollError((error) => {
        dispatch(setError(error.message));
      });

      socketService.onNameTaken((error) => {
        dispatch(setError(error.message));
        setIsJoined(false);
        sessionStorage.removeItem("studentName");
      });

      socketService.onRemovedByTeacher(() => {
        alert("You have been removed from the session by the teacher.");
        sessionStorage.removeItem("studentName");
        sessionStorage.removeItem("studentId");
        navigate("/");
      });
    },
    [dispatch, navigate, startTimer]
  );

  const handleJoin = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      dispatch(setError("Please enter your name"));
      return;
    }

    const tabId = sessionStorage.getItem("studentId");
    joinAsStudent(nameInput.trim(), tabId);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) {
      dispatch(setError("Please select an option"));
      return;
    }

    socketService.submitAnswer(selectedOption);
    dispatch(clearError());
  };

  if (!isJoined) {
    return (
      <div className="container">
        <div
          style={{
            maxWidth: "400px",
            margin: "100px auto",
            textAlign: "center",
          }}
        >
          <h1 style={{ marginBottom: "2rem", color: "#1f2937" }}>
            Join as Student
          </h1>

          {error && (
            <div className="error-message">
              {error}
              <button
                onClick={() => dispatch(clearError())}
                style={{
                  float: "right",
                  background: "none",
                  border: "none",
                  color: "#dc2626",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleJoin} className="card">
            <div className="form-group">
              <label htmlFor="name">Enter your name:</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Your name"
                maxLength={50}
                required
              />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Join Session
              </button>
              <Link to="/" className="btn btn-secondary">
                Back
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1 style={{ color: "#1f2937" }}>Student Dashboard</h1>
          <p style={{ color: "#6b7280" }}>
            Welcome, <strong>{studentName}</strong>!
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: isConnected ? "#10b981" : "#ef4444",
              }}
            ></div>
            <span
              style={{
                color: isConnected ? "#10b981" : "#ef4444",
                fontWeight: "600",
              }}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <Link to="/" className="btn btn-secondary">
            Leave Session
          </Link>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button
            onClick={() => dispatch(clearError())}
            style={{
              float: "right",
              background: "none",
              border: "none",
              color: "#dc2626",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      )}

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* Waiting for question */}
        {!currentPoll && !results && (
          <div
            className="card"
            style={{ textAlign: "center", padding: "3rem" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
            <h2 style={{ marginBottom: "1rem" }}>Waiting for question...</h2>
            <p style={{ color: "#6b7280" }}>
              Your teacher will start a poll soon. Stay tuned!
            </p>
          </div>
        )}

        {/* Active question */}
        {currentPoll && currentPoll.isActive && !hasAnswered && (
          <div className="card">
            <Timer
              timeRemaining={timeRemaining}
              totalTime={currentPoll.timeLimit || 60}
            />

            <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>
              {currentPoll.question}
            </h2>

            <PollQuestion
              poll={currentPoll}
              selectedOption={selectedOption}
              onSelectOption={setSelectedOption}
              disabled={hasAnswered}
            />

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button
                className="btn btn-primary"
                onClick={handleSubmitAnswer}
                disabled={
                  hasAnswered || selectedOption === null || timeRemaining === 0
                }
                style={{ minWidth: "200px" }}
              >
                {hasAnswered ? "Answer Submitted" : "Submit Answer"}
              </button>
            </div>
          </div>
        )}

        {/* Waiting for others */}
        {currentPoll && hasAnswered && (
          <div
            className="card"
            style={{ textAlign: "center", padding: "3rem" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h2 style={{ marginBottom: "1rem", color: "#10b981" }}>
              Answer Submitted!
            </h2>
            <p style={{ color: "#6b7280" }}>
              Waiting for other students to finish answering...
            </p>
            <div style={{ marginTop: "2rem" }}>
              <Timer
                timeRemaining={timeRemaining}
                totalTime={currentPoll.timeLimit || 60}
              />
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && results && (
          <div className="card">
            <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>
              Poll Results
            </h2>
            <PollResults results={results} />
            <div
              style={{
                textAlign: "center",
                marginTop: "2rem",
                color: "#6b7280",
              }}
            >
              Waiting for the next question...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
