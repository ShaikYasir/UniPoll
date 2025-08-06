import React from "react";

const PollQuestion = ({ poll, selectedOption, onSelectOption, disabled }) => {
  if (!poll) return null;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        {poll.options.map((option) => (
          <div
            key={option.id}
            className={`poll-option ${
              selectedOption === option.id ? "selected" : ""
            }`}
            onClick={() => !disabled && onSelectOption(option.id)}
            style={{
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: `2px solid ${
                    selectedOption === option.id ? "#3b82f6" : "#d1d5db"
                  }`,
                  backgroundColor:
                    selectedOption === option.id ? "#3b82f6" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selectedOption === option.id && (
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                    }}
                  ></div>
                )}
              </div>
              <span style={{ fontSize: "16px", fontWeight: "500" }}>
                {option.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollQuestion;
