import PropTypes from "prop-types";

const Keyboard = ({ correctLetters, wrongLetters, keyClickHandler, shake }) => {
  const qwertyRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  return (
    <div className={`keyboard ${shake ? "shake-animation" : ""}`}>
      {qwertyRows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((letter) => (
            <div
              onClick={() => {
                keyClickHandler(letter);
              }}
              key={letter}
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
      ))}
    </div>
  );
};

Keyboard.propTypes = {
  correctLetters: PropTypes.array.isRequired,
  wrongLetters: PropTypes.array.isRequired,
  keyClickHandler: PropTypes.func.isRequired,
  shake: PropTypes.bool.isRequired,
};

export default Keyboard;
