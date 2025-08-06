import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1
          style={{ fontSize: "3rem", marginBottom: "2rem", color: "#1f2937" }}
        >
          Live Polling System
        </h1>
        <p
          style={{ fontSize: "1.2rem", color: "#6b7280", marginBottom: "3rem" }}
        >
          Choose your role to get started
        </p>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/teacher" style={{ textDecoration: "none" }}>
            <div
              className="card"
              style={{
                width: "300px",
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.2s",
                ":hover": { transform: "translateY(-5px)" },
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>👨‍🏫</div>
              <h2 style={{ color: "#1f2937", marginBottom: "1rem" }}>
                Teacher
              </h2>
              <p style={{ color: "#6b7280" }}>
                Create polls, ask questions, and view live results from your
                students
              </p>
              <button
                className="btn btn-primary"
                style={{ marginTop: "1rem", width: "100%" }}
              >
                Enter as Teacher
              </button>
            </div>
          </Link>

          <Link to="/student" style={{ textDecoration: "none" }}>
            <div
              className="card"
              style={{
                width: "300px",
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.2s",
                ":hover": { transform: "translateY(-5px)" },
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>👨‍🎓</div>
              <h2 style={{ color: "#1f2937", marginBottom: "1rem" }}>
                Student
              </h2>
              <p style={{ color: "#6b7280" }}>
                Join the class, answer questions, and see how you compare with
                others
              </p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: "1rem", width: "100%" }}
              >
                Enter as Student
              </button>
            </div>
          </Link>
        </div>

        <div style={{ marginTop: "4rem", color: "#6b7280" }}>
          <h3>Features:</h3>
          <div
            style={{
              display: "flex",
              gap: "2rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "1rem",
            }}
          >
            <div>✅ Real-time polling</div>
            <div>⏱️ Timed questions</div>
            <div>📊 Live results</div>
            <div>👥 Student management</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
