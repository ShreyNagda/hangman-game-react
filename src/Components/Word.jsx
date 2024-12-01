import React from "react";

const Word = ({ correctLetters, word }) => {
  return (
    <div className="word-container">
      {word.split("").map((letter, index) => (
        <span key={index} className="letter">
          {correctLetters.includes(letter) && letter}
        </span>
      ))}
    </div>
  );
};

export default Word;
