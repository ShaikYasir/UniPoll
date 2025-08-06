import React from "react";

const StudentsList = ({ students, onRemoveStudent, isTeacher }) => {
  if (!students || students.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>👥</div>
        <p>No students online</p>
      </div>
    );
  }

  return (
    <div className="student-list">
      {students.map((student, index) => (
        <div key={student.socketId || index} className="student-item">
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#3b82f6",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: "600" }}>{student.name}</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                {student.joinedAt
                  ? `Joined ${new Date(student.joinedAt).toLocaleTimeString()}`
                  : "Online"}
              </div>
            </div>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            {student.hasAnswered !== null && (
              <span
                className={`status-indicator ${
                  student.hasAnswered ? "status-answered" : "status-waiting"
                }`}
              >
                {student.hasAnswered ? "Answered" : "Waiting"}
              </span>
            )}

            {isTeacher && onRemoveStudent && (
              <button
                onClick={() => onRemoveStudent(student.socketId)}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
                title="Remove student"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: "1rem",
          padding: "0.75rem",
          background: "#f0f9ff",
          borderRadius: "6px",
          fontSize: "14px",
          color: "#0369a1",
        }}
      >
        <strong>{students.length}</strong> student
        {students.length !== 1 ? "s" : ""} connected
        {students.some((s) => s.hasAnswered !== null) && (
          <span style={{ marginLeft: "1rem" }}>
            • <strong>{students.filter((s) => s.hasAnswered).length}</strong>{" "}
            answered
          </span>
        )}
      </div>
    </div>
  );
};

export default StudentsList;
