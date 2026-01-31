import PropTypes from "prop-types";

const ScoreBoard = ({ stats, timer, formatTime, gameMode }) => {
  return (
    <div className="scoreboard">
      <div className="score-container fade-in">
        <div className="score-item">🏆 {stats.totalScore}</div>
        <div className="score-item">🔥 {stats.streak}</div>
      </div>

      {gameMode === "daily" && (
        <div className="game-mode-badge">📅 Daily Challenge</div>
      )}

      <div className="timer-container">⏱️ {formatTime(timer)}</div>
    </div>
  );
};

ScoreBoard.propTypes = {
  stats: PropTypes.shape({
    totalScore: PropTypes.number.isRequired,
    wins: PropTypes.number.isRequired,
    losses: PropTypes.number.isRequired,
    streak: PropTypes.number.isRequired,
  }).isRequired,
  timer: PropTypes.number.isRequired,
  formatTime: PropTypes.func.isRequired,
  gameMode: PropTypes.string.isRequired,
};

export default ScoreBoard;
