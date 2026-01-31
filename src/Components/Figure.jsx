import React from "react";

const Figure = ({ wrongLetters, maxAttempts = 6 }) => {
  let errors = wrongLetters.length;
  const parts = [
    {
      condition: errors > 0,
      element: <circle key="head" cx="140" cy="70" r="20" />,
    },
    {
      condition: errors > 1,
      element: <line key="body" x1="140" y1="90" x2="140" y2="150" />,
    },
    {
      condition: errors > 2,
      element: <line key="leftarm" x1="140" y1="120" x2="120" y2="100" />,
    },
    {
      condition: errors > 3,
      element: <line key="rightarm" x1="140" y1="120" x2="160" y2="100" />,
    },
    {
      condition: errors > 4,
      element: <line key="leftleg" x1="140" y1="150" x2="120" y2="180" />,
    },
    {
      condition: errors > 5,
      element: <line key="rightleg" x1="140" y1="150" x2="160" y2="180" />,
    },
  ];

  return (
    <div className="figure-wrapper">
      <svg className="figure-container slide-in" viewBox="0 0 200 250">
        {/* <!-- Rod --> */}
        <line x1="60" y1="20" x2="140" y2="20" />
        <line x1="140" y1="20" x2="140" y2="50" />
        <line x1="60" y1="20" x2="60" y2="230" />
        <line x1="20" y1="230" x2="100" y2="230" />

        {/* Body parts with animation */}
        {parts.slice(0, Math.ceil(maxAttempts)).map((part, index) =>
          part.condition ? (
            <g key={index} className="fade-in">
              {part.element}
            </g>
          ) : null,
        )}
      </svg>
      <div
        style={{ textAlign: "center", marginTop: "10px", fontWeight: "600" }}
      >
        {errors} / {maxAttempts} attempts
      </div>
    </div>
  );
};

export default Figure;
