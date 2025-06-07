import { FaTimes } from "react-icons/fa";

const Hint = ({ hint, setter }) => {
  return (
    <div className="hint">
      <button
        type="button"
        name="Close Button"
        className="btn floating-btn"
        onClick={() => setter(false)}
      >
        <FaTimes />
      </button>
      {hint}
    </div>
  );
};

export default Hint;
