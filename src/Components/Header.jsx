import PropTypes from "prop-types";
import { FaCog } from "react-icons/fa";
import Title from "./Title";

const Header = ({ onSettingsClick }) => {
  return (
    <header className="header">
      <button
        className="settings-btn"
        onClick={onSettingsClick}
        aria-label="Settings"
      >
        <FaCog />
      </button>
      <Title />
    </header>
  );
};

Header.propTypes = {
  onSettingsClick: PropTypes.func.isRequired,
};

export default Header;
