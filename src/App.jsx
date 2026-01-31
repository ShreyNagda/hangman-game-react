import { useCallback, useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import axios from "axios";
import { FaLightbulb, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import * as Dialog from "@radix-ui/react-dialog";
import Header from "./Components/Header";
import ScoreBoard from "./Components/ScoreBoard";
import Figure from "./Components/Figure";
import Word from "./Components/Word";
import Keyboard from "./Components/Keyboard";
import Hint from "./Components/Hint";

function App() {
  const [word, setWord] = useState("");
  const [hint, setHint] = useState("");
  const [status, setStatus] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [playable, setPlayable] = useState(true);
  const [correctLetters, setCorrectLetters] = useState([
    "a",
    "e",
    "i",
    "o",
    "u",
  ]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [maxAttempts, setMaxAttempts] = useState(6);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    streak: 0,
    totalScore: 0,
  });
  const [theme, setTheme] = useState("light");
  const [gameMode, setGameMode] = useState("random");
  const [shakeKeyboard, setShakeKeyboard] = useState(false);
  const [dailyChallengeCompleted, setDailyChallengeCompleted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load stats and theme from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem("hangmanStats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    const savedTheme = localStorage.getItem("hangmanTheme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.classList.toggle("dark-mode", savedTheme === "dark");
    }

    // Check if daily challenge was completed today
    const dailyData = localStorage.getItem("hangmanDailyChallenge");
    if (dailyData) {
      const { date } = JSON.parse(dailyData);
      const today = new Date().toDateString();
      if (date === today) {
        setDailyChallengeCompleted(true);
      }
    }
  }, []);

  // Generate daily challenge word
  const getDailyWord = () => {
    const today = new Date().toDateString();
    const seed = today
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    faker.seed(seed);
    let dailyWord = faker.word.noun({ length: { min: 5, max: 7 } });
    dailyWord = dailyWord.replace(/[^a-zA-Z0-9]/g, "");
    return dailyWord;
  };

  // Get word based on difficulty
  const getWordByDifficulty = (diff) => {
    let wordLength = { min: 5, max: 7 };
    let attempts = 6;

    if (diff === "easy") {
      wordLength = { min: 4, max: 5 };
      attempts = 8;
    } else if (diff === "hard") {
      wordLength = { min: 7, max: 10 };
      attempts = 4;
    }

    setMaxAttempts(attempts);

    let currentword = faker.word.noun({ length: wordLength });
    currentword = currentword.replace(/[^a-zA-Z0-9]/g, "");
    return currentword;
  };

  function startGame(mode = gameMode, diff = difficulty) {
    let currentword;

    if (mode === "daily") {
      currentword = getDailyWord();
      setMaxAttempts(6);
    } else {
      currentword = getWordByDifficulty(diff);
    }

    setWord(currentword);
    setTimer(0);
    setIsTimerRunning(true);

    async function getHint(word) {
      try {
        const res = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
        );
        setHint(res.data[0].meanings[0].definitions[0].definition);
      } catch (error) {
        setHint("Hint Unavailable ", error);
      }
    }
    getHint(currentword);
  }

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning && playable) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, playable]);

  useEffect(() => {
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Don't check for win if game is already over
    if (!playable || status !== "") return;

    let _status = "win";
    if (correctLetters.length === 5) {
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
        setIsTimerRunning(false);
        setStatus("You Won 😊!");

        // Calculate score
        const timeBonus = Math.max(0, 300 - timer); // Bonus for fast completion
        const attemptsBonus = (maxAttempts - wrongLetters.length) * 50;
        const totalScore = timeBonus + attemptsBonus + 100;
        setScore(totalScore);

        // Update stats
        const newStats = {
          wins: stats.wins + 1,
          losses: stats.losses,
          streak: stats.streak + 1,
          totalScore: stats.totalScore + totalScore,
        };
        setStats(newStats);
        localStorage.setItem("hangmanStats", JSON.stringify(newStats));

        // Mark daily challenge as completed if in daily mode
        if (gameMode === "daily") {
          const today = new Date().toDateString();
          localStorage.setItem(
            "hangmanDailyChallenge",
            JSON.stringify({ date: today }),
          );
          setDailyChallengeCompleted(true);
        }

        // Create confetti
        createConfetti();

        clearInterval(interval);
      }, 500);
    }
  }, [
    correctLetters,
    gameMode,
    maxAttempts,
    playable,
    stats.losses,
    stats.streak,
    stats.totalScore,
    stats.wins,
    status,
    timer,
    word,
    wrongLetters.length,
  ]);

  useEffect(() => {
    if (wrongLetters.length === maxAttempts) {
      setStatus(`You Lose 😔! \n The word was ${word.toUpperCase()}`);
      setIsTimerRunning(false);
      const interval = setInterval(() => {
        setPlayable(false);

        // Update stats
        const newStats = {
          wins: stats.wins,
          losses: stats.losses + 1,
          streak: 0,
          totalScore: stats.totalScore,
        };
        setStats(newStats);
        localStorage.setItem("hangmanStats", JSON.stringify(newStats));

        // Mark daily challenge as completed if in daily mode
        if (gameMode === "daily") {
          const today = new Date().toDateString();
          localStorage.setItem(
            "hangmanDailyChallenge",
            JSON.stringify({ date: today }),
          );
          setDailyChallengeCompleted(true);
        }

        clearInterval(interval);
      }, 1000);
    }
    () => {
      return;
    };
  }, [
    gameMode,
    maxAttempts,
    stats.losses,
    stats.totalScore,
    stats.wins,
    word,
    wrongLetters,
  ]);

  const keyClickHandler = useCallback(
    (letter) => {
      if (
        playable &&
        !correctLetters.includes(letter) &&
        !wrongLetters.includes(letter)
      ) {
        if (word.includes(letter)) {
          setCorrectLetters((prev) => [...prev, letter]);
        } else {
          setWrongLetters((prev) => [...prev, letter]);
          // Trigger shake animation
          setShakeKeyboard(true);
          setTimeout(() => setShakeKeyboard(false), 500);
        }
      }
    },
    [playable, correctLetters, wrongLetters, word],
  );

  // Physical keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      const letter = e.key.toLowerCase();
      if (/^[a-z]$/.test(letter)) {
        keyClickHandler(letter);
      }
    };

    if (playable) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playable, correctLetters, wrongLetters, word, keyClickHandler]);

  function replayGame() {
    setCorrectLetters(["a", "e", "i", "o", "u"]);
    setWrongLetters([]);
    setStatus("");
    setScore(0);
    setTimer(0);
    setIsTimerRunning(true);
    setPlayable(true);
    startGame(gameMode, difficulty);
  }

  function giveUpGame() {
    setStatus(`You gave up! The word was ${word.toUpperCase()}`);
    setIsTimerRunning(false);
    setPlayable(false);

    // Update stats as a loss
    const newStats = {
      wins: stats.wins,
      losses: stats.losses + 1,
      streak: 0,
      totalScore: stats.totalScore,
    };
    setStats(newStats);
    localStorage.setItem("hangmanStats", JSON.stringify(newStats));

    // Mark daily challenge as completed if in daily mode
    if (gameMode === "daily") {
      const today = new Date().toDateString();
      localStorage.setItem(
        "hangmanDailyChallenge",
        JSON.stringify({ date: today }),
      );
      setDailyChallengeCompleted(true);
    }
  }

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("hangmanTheme", newTheme);
  }

  function changeDifficulty(newDiff) {
    setDifficulty(newDiff);
    setCorrectLetters(["a", "e", "i", "o", "u"]);
    setWrongLetters([]);
    setGameMode("random");
    setShowSettings(false);
    startGame("random", newDiff);
    setPlayable(true);
    setStatus("");
  }

  function startDailyChallenge() {
    // Check if already completed today
    const dailyData = localStorage.getItem("hangmanDailyChallenge");
    if (dailyData) {
      const { date } = JSON.parse(dailyData);
      const today = new Date().toDateString();
      if (date === today) {
        alert(
          "You've already completed today's daily challenge! Come back tomorrow for a new one.",
        );
        return;
      }
    }

    setGameMode("daily");
    setDifficulty("medium");
    setCorrectLetters(["a", "e", "i", "o", "u"]);
    setWrongLetters([]);
    setPlayable(true);
    setStatus("");
    setScore(0);
    setDailyChallengeCompleted(false);
    setShowSettings(false);
    startGame("daily", "medium");
  }

  function createConfetti() {
    const colors = ["#a3c4f3", "#ff6b6b", "#4ecdc4", "#ffe66d", "#ff8fab"];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti-particle";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + "s";
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 3000);
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  if (!playable) {
    return (
      <div className="game-over fade-in">
        <div className="game-over-title">{status}</div>
        {score > 0 && (
          <div className="game-stats">
            <div className="game-stats-item">
              Score: <span className="bonus-points">+{score}</span>
            </div>
            <div className="game-stats-item">Time: {formatTime(timer)}</div>
            <div className="game-stats-item">
              Attempts Left: {maxAttempts - wrongLetters.length}
            </div>
          </div>
        )}
        <div className="game-stats">
          <div className="game-stats-item">Total Wins: {stats.wins}</div>
          <div className="game-stats-item">Total Losses: {stats.losses}</div>
          <div className="game-stats-item">Current Streak: {stats.streak}</div>
          <div className="game-stats-item">Total Score: {stats.totalScore}</div>
        </div>
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
      <Header onSettingsClick={() => setShowSettings(true)} />

      <ScoreBoard
        stats={stats}
        timer={timer}
        formatTime={formatTime}
        gameMode={gameMode}
      />

      <div className="wrapper">
        <div className="game-container">
          <Figure wrongLetters={wrongLetters} maxAttempts={maxAttempts} />
          {showHint && hint !== null && (
            <Hint hint={hint} setter={setShowHint} open={showHint} />
          )}
          <Word correctLetters={correctLetters} word={word} />
          <div className="control-buttons">
            <button
              type="button"
              name="Hint Button"
              className={`btn hint-btn ${hint && "show"}`}
              onClick={() => setShowHint(true)}
            >
              <FaLightbulb />
            </button>
            <button className="control-btn danger" onClick={giveUpGame}>
              Give Up
            </button>
          </div>
        </div>
        <Keyboard
          wrongLetters={wrongLetters}
          correctLetters={correctLetters}
          keyClickHandler={keyClickHandler}
          shake={shakeKeyboard}
        />
      </div>

      {showSettings && (
        <Dialog.Root open={showSettings} onOpenChange={setShowSettings}>
          <Dialog.Portal>
            <Dialog.Overlay className="dialog-overlay" />
            <Dialog.Content className="dialog-content settings-dialog">
              <Dialog.Close asChild>
                <button className="dialog-close" aria-label="Close settings">
                  <FaTimes />
                </button>
              </Dialog.Close>
              <Dialog.Title className="dialog-title">
                Game Settings
              </Dialog.Title>
              <div className="settings-options">
                <div className="settings-group">
                  <div className="settings-label">Theme</div>
                  <div className="settings-buttons">
                    <button
                      className={`difficulty-btn ${theme === "light" ? "active" : ""}`}
                      onClick={toggleTheme}
                    >
                      <FaSun /> Light
                    </button>
                    <button
                      className={`difficulty-btn ${theme === "dark" ? "active" : ""}`}
                      onClick={toggleTheme}
                    >
                      <FaMoon /> Dark
                    </button>
                  </div>
                </div>
                <div className="settings-group">
                  <div className="settings-label">Difficulty</div>
                  <div className="settings-buttons">
                    <button
                      className={`difficulty-btn ${difficulty === "easy" && gameMode !== "daily" ? "active" : ""}`}
                      onClick={() => changeDifficulty("easy")}
                    >
                      Easy
                    </button>
                    <button
                      className={`difficulty-btn ${difficulty === "medium" && gameMode !== "daily" ? "active" : ""}`}
                      onClick={() => changeDifficulty("medium")}
                    >
                      Medium
                    </button>
                    <button
                      className={`difficulty-btn ${difficulty === "hard" && gameMode !== "daily" ? "active" : ""}`}
                      onClick={() => changeDifficulty("hard")}
                    >
                      Hard
                    </button>
                    <button
                      className={`difficulty-btn ${gameMode === "daily" ? "active" : ""} ${dailyChallengeCompleted && gameMode !== "daily" ? "disabled" : ""}`}
                      onClick={startDailyChallenge}
                      disabled={dailyChallengeCompleted && gameMode !== "daily"}
                      title={
                        dailyChallengeCompleted && gameMode !== "daily"
                          ? "Already completed today!"
                          : "Play today's challenge"
                      }
                    >
                      {dailyChallengeCompleted && gameMode !== "daily"
                        ? "✅ Daily"
                        : "📅 Daily"}
                    </button>
                  </div>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
      <footer className="footer">
        <p>Made with ❤️ by Shrey Nagda</p>
      </footer>
      {/* <Notification /> */}
    </div>
  );
}

export default App;
