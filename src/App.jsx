import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import axios from "axios";
import { FaLightbulb } from "react-icons/fa6";

import Title from "./Components/Title";
import Figure from "./Components/Figure";
import Word from "./Components/Word";
import Keyboard from "./Components/Keyboard";
import Hint from "./Components/Hint";

function App({}) {
  const [word, setWord] = useState("");
  const [hint, setHint] = useState("");
  const [status, setStatus] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [playable, setPlayable] = useState(true);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);

  function startGame() {
    let currentword = faker.word.noun({ length: { min: 4, max: 7 } });
    currentword = currentword.replace(/[^a-zA-Z0-9]/g, "");
    setWord(currentword);
    async function getHint(word) {
      try {
        const res = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );
        setHint(res.data[0].meanings[0].definitions[0].definition);
      } catch (err) {
        setHint("Hint Unavailable");
      }
    }
    getHint(currentword);
  }
  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    let _status = "win";
    if (correctLetters.length === 0) {
      _status = "";
    }
    word.split("").forEach((letter) => {
      if (!correctLetters.includes(letter)) {
        _status = "";
      }
    });
    if (_status === "win") {
      const interval = setInterval(() => {
        setPlayable(false);
        setStatus("You Won 😊!");
        clearInterval(interval);
      }, 500);
    }
  }, [correctLetters]);

  useEffect(() => {
    if (wrongLetters.length === 6) {
      setStatus(`You Lose 😔! \n The word was ${word.toUpperCase()}`);
      const interval = setInterval(() => {
        setPlayable(false);
        clearInterval(interval);
      }, 1000);
    }
    () => {
      return;
    };
  }, [wrongLetters]);

  function keyClickHandler(letter) {
    if (
      playable &&
      !correctLetters.includes(letter) &&
      !wrongLetters.includes(letter)
    ) {
      if (word.includes(letter)) {
        setCorrectLetters((prev) => [...prev, letter]);
      } else {
        setWrongLetters((prev) => [...prev, letter]);
      }
    }
  }

  function replayGame() {
    setCorrectLetters([]);
    setWrongLetters([]);
    setStatus("");
    startGame();
    setPlayable(true);
  }

  if (!playable) {
    return (
      <div className="game-over">
        <div className="game-over-title">{status}</div>
        <button
          type="button"
          name="Replay Button"
          className="replay-btn"
          onClick={replayGame}
        >
          Replay
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <Title />
      <div className="game-container">
        <Figure wrongLetters={wrongLetters} />
        <button
          type="button"
          name="Hint Button"
          className={`btn hint-btn ${hint && "show"}`}
          onClick={() => setShowHint(true)}
        >
          <FaLightbulb />
        </button>
        {showHint && hint !== null && <Hint hint={hint} setter={setShowHint} />}
        <Word correctLetters={correctLetters} word={word} />
      </div>
      <Keyboard
        wrongLetters={wrongLetters}
        correctLetters={correctLetters}
        keyClickHandler={keyClickHandler}
      />
      {/* <Notification /> */}
    </div>
  );
}

export default App;
