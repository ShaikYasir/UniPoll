import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import socketService from "../services/socketService";
import {
  setCurrentPoll,
  updatePoll,
  setResults,
  setStudents,
  setPollHistory,
  setLoading,
  setError,
  clearError,
} from "../store/pollSlice";
import { setUserType, setConnected } from "../store/userSlice";
import PollCreator from "../components/PollCreator";
import PollResults from "../components/PollResults";
import StudentsList from "../components/StudentsList";

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { currentPoll, results, students, pollHistory, error } = useSelector(
    (state) => state.poll
  );
  const { isConnected } = useSelector((state) => state.user);

  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    dispatch(setUserType("teacher"));

    // Connect to socket
    const socket = socketService.connect();
    socketService.joinAsTeacher();
    dispatch(setConnected(true));

    // Socket event listeners
    socketService.onCurrentPoll((poll) => {
      if (poll) {
        dispatch(setCurrentPoll(poll));
      }
    });

    socketService.onPollCreated((poll) => {
      dispatch(setCurrentPoll(poll));
      dispatch(clearError());
    });

    socketService.onPollUpdated((poll) => {
      dispatch(updatePoll(poll));
    });

    socketService.onPollResults((results) => {
      dispatch(setResults(results));
      setShowResults(true);
    });

    socketService.onStudentsList((studentsList) => {
      dispatch(setStudents(studentsList));
    });

    socketService.onPollError((error) => {
      dispatch(setError(error.message));
    });

    // Fetch poll history
    fetchPollHistory();

    return () => {
      socketService.offAllListeners();
      socketService.disconnect();
      dispatch(setConnected(false));
    };
  }, [dispatch]);

  const fetchPollHistory = async () => {
    try {
      const response = await fetch("/api/poll-history");
      const history = await response.json();
      dispatch(setPollHistory(history));
    } catch (error) {
      console.error("Failed to fetch poll history:", error);
    }
  };

  const handleCreatePoll = (pollData) => {
    dispatch(setLoading(true));
    socketService.createPoll(pollData);
    setShowResults(false);
    dispatch(setLoading(false));
  };

  const handleEndPoll = () => {
    socketService.endPoll();
  };

  const handleRemoveStudent = (studentId) => {
    if (window.confirm("Are you sure you want to remove this student?")) {
      socketService.removeStudent(studentId);
    }
  };

  const canCreateNewPoll = () => {
    if (!currentPoll) return true;
    if (!currentPoll.isActive) return true;

    const studentsArray = students || [];
    return (
      studentsArray.length === 0 ||
      studentsArray.every((s) => s.hasAnswered === true)
    );
  };

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
        <h1 style={{ color: "#1f2937" }}>Teacher Dashboard</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? "Hide History" : "View History"}
          </button>
          <Link to="/" className="btn btn-secondary">
            Exit
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
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
        <span style={{ color: "#6b7280" }}>
          | {students.length} student{students.length !== 1 ? "s" : ""} online
        </span>
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

      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}
      >
        <div>
          {/* Poll Creator */}
          <div className="card">
            <h2 style={{ marginBottom: "1rem" }}>Create New Poll</h2>
            {!canCreateNewPoll() && (
              <div
                style={{
                  background: "#fef3c7",
                  border: "2px solid #f59e0b",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "1rem",
                  color: "#92400e",
                }}
              >
                Wait for all students to answer before creating a new poll.
              </div>
            )}
            <PollCreator
              onCreatePoll={handleCreatePoll}
              disabled={!canCreateNewPoll()}
            />
          </div>

          {/* Current Poll */}
          {currentPoll && currentPoll.isActive && (
            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <h2>Current Poll</h2>
                <button className="btn btn-danger" onClick={handleEndPoll}>
                  End Poll
                </button>
              </div>
              <h3 style={{ marginBottom: "1rem" }}>{currentPoll.question}</h3>
              <div style={{ marginBottom: "1rem" }}>
                <span style={{ fontWeight: "600" }}>
                  Answered: {students.filter((s) => s.hasAnswered).length} /{" "}
                  {students.length}
                </span>
              </div>
              <div>
                {currentPoll.options.map((option) => (
                  <div
                    key={option.id}
                    className="poll-option"
                    style={{ cursor: "default" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{option.text}</span>
                      <span style={{ fontWeight: "600" }}>
                        {option.votes} votes
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {(showResults || (results && !currentPoll?.isActive)) && (
            <div className="card">
              <h2 style={{ marginBottom: "1rem" }}>Poll Results</h2>
              <PollResults results={results} />
            </div>
          )}

          {/* Poll History */}
          {showHistory && (
            <div className="card">
              <h2 style={{ marginBottom: "1rem" }}>Poll History</h2>
              {pollHistory.length === 0 ? (
                <p style={{ color: "#6b7280" }}>No polls conducted yet.</p>
              ) : (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {pollHistory.map((poll) => (
                    <div
                      key={poll.id}
                      style={{
                        padding: "12px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <h4 style={{ marginBottom: "8px" }}>{poll.question}</h4>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          marginBottom: "8px",
                        }}
                      >
                        {new Date(poll.startTime).toLocaleString()}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {poll.options.map((option) => (
                          <span key={option.id} style={{ fontSize: "14px" }}>
                            {option.text}: <strong>{option.votes}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Students List */}
        <div>
          <div className="card">
            <h2 style={{ marginBottom: "1rem" }}>
              Students ({students.length})
            </h2>
            <StudentsList
              students={students}
              onRemoveStudent={handleRemoveStudent}
              isTeacher={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
