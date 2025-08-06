import React from "react";

const Timer = ({ timeRemaining, totalTime }) => {
  const percentage = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 0;
  const isWarning = timeRemaining <= 10 && timeRemaining > 0;
  const isExpired = timeRemaining === 0;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`timer ${isWarning || isExpired ? "warning" : ""}`}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <span>Time Remaining</span>
        <span style={{ fontSize: "1.2em", fontWeight: "bold" }}>
          {isExpired ? "TIME'S UP!" : formatTime(timeRemaining)}
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: "8px",
          backgroundColor: "rgba(0,0,0,0.1)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: isWarning || isExpired ? "#ef4444" : "#10b981",
            transition: "width 1s linear",
            borderRadius: "4px",
          }}
        ></div>
      </div>

      {isExpired && (
        <div
          style={{
            marginTop: "0.5rem",
            fontSize: "14px",
            color: "#dc2626",
          }}
        >
          Waiting for results...
        </div>
      )}
    </div>
  );
};

export default Timer;
