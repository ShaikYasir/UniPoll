import React, { useState } from "react";

const PollCreator = ({ onCreatePoll, disabled }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [timeLimit, setTimeLimit] = useState(60);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    const validOptions = options.filter((opt) => opt.trim() !== "");
    if (validOptions.length < 2) {
      alert("Please provide at least 2 options");
      return;
    }

    onCreatePoll({
      question: question.trim(),
      options: validOptions.map((opt) => opt.trim()),
      timeLimit,
    });

    // Reset form
    setQuestion("");
    setOptions(["", "", "", ""]);
    setTimeLimit(60);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="question">Question:</label>
        <input
          type="text"
          id="question"
          className="form-control"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
          maxLength={200}
          disabled={disabled}
          required
        />
      </div>

      <div className="form-group">
        <label>Options:</label>
        {options.map((option, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
          >
            <input
              type="text"
              className="form-control"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              maxLength={100}
              disabled={disabled}
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(index)}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
                disabled={disabled}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            style={{
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "8px 12px",
              cursor: "pointer",
              marginTop: "0.5rem",
            }}
            disabled={disabled}
          >
            + Add Option
          </button>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="timeLimit">Time Limit (seconds):</label>
        <select
          id="timeLimit"
          className="form-control"
          value={timeLimit}
          onChange={(e) => setTimeLimit(parseInt(e.target.value))}
          disabled={disabled}
        >
          <option value={30}>30 seconds</option>
          <option value={60}>60 seconds</option>
          <option value={90}>90 seconds</option>
          <option value={120}>2 minutes</option>
          <option value={180}>3 minutes</option>
          <option value={300}>5 minutes</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: "100%" }}
        disabled={disabled}
      >
        {disabled ? "Wait for students to answer" : "Create Poll"}
      </button>
    </form>
  );
};

export default PollCreator;
