import React from "react";

const Keyboard = ({ correctLetters, wrongLetters, keyClickHandler }) => {
  let letters = "abcdefghijklmnopqrstuvwxyz";
  return (
    <div className="keyboard">
      {letters.split("").map((letter, index) => (
        <div
          onClick={() => {
            keyClickHandler(letter);
          }}
          key={index}
          className={`keys ${
            [...correctLetters, ...wrongLetters].includes(letter)
              ? "clicked"
              : ""
          }`}
        >
          {letter}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
