// import React from "react";
import PropTypes from "prop-types";

const Word = ({ correctLetters, word }) => {
  return (
    <div className="word-container">
      {word.split("").map((letter, index) => (
        <span
          key={index}
          className={`letter ${correctLetters.includes(letter) ? "letter-revealed" : ""}`}
        >
          {correctLetters.includes(letter) && letter}
        </span>
      ))}
    </div>
  );
};

Word.propTypes = {
  correctLetters: PropTypes.arrayOf(PropTypes.string).isRequired,
  word: PropTypes.string.isRequired,
};

export default Word;
