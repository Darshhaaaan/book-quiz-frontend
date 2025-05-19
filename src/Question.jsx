import React from "react";

const Question = ({ data, onSelect, displayNumber, selectedText }) => {
  return (
    <div className="question-box">
      <h2>{displayNumber}. {data.question}</h2>
      <ul>
  {data.options.map((opt, i) => (
    <li key={i}>
      <button
        onClick={() => onSelect(opt)}
        className={opt.text === selectedText ? "selected" : ""}
      >
        {opt.text}
      </button>
    </li>
  ))}
</ul>
    </div>
  );
};

export default Question;
