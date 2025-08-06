import React from "react";

const PollResults = ({ results }) => {
  if (!results) return null;

  const totalVotes = results.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  return (
    <div>
      <h3 style={{ marginBottom: "1rem", textAlign: "center" }}>
        {results.question}
      </h3>

      <div
        style={{ marginBottom: "1rem", textAlign: "center", color: "#6b7280" }}
      >
        Total responses: <strong>{totalVotes}</strong>
      </div>

      <div className="results-chart">
        {results.options.map((option) => {
          const percentage =
            totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

          return (
            <div key={option.id} style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                <span>{option.text}</span>
                <span>
                  {option.votes} votes ({percentage}%)
                </span>
              </div>

              <div className="result-bar">
                <div
                  className="result-fill"
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {results.startTime && results.endTime && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            background: "#f9fafb",
            borderRadius: "8px",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          <div>
            <strong>Started:</strong>{" "}
            {new Date(results.startTime).toLocaleString()}
          </div>
          <div>
            <strong>Ended:</strong> {new Date(results.endTime).toLocaleString()}
          </div>
          <div>
            <strong>Duration:</strong>{" "}
            {Math.round(
              (new Date(results.endTime) - new Date(results.startTime)) / 1000
            )}{" "}
            seconds
          </div>
        </div>
      )}
    </div>
  );
};

export default PollResults;
