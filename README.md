# Hangman Game

Welcome to the **Hangman Game**! A classic word-guessing game where players try to figure out a hidden word by guessing one letter at a time. But be careful! With each incorrect guess, a part of the hangman’s body is drawn. You have only **7 guesses** to get it right before the hangman is complete.

---

## Features

- **Interactive Gameplay**: Guess the word letter by letter.
- **Limited Guesses**: Players get 7 chances before the game ends.
- **Dynamic Hangman Drawing**: Each incorrect guess reveals a new body part of the hangman.
- **Responsive Design**: The game works seamlessly on mobile, tablet, and desktop devices.

---

## How to Play

1. **Objective**: Guess the hidden word before the hangman is fully drawn.
2. **Rules**:
   - Each correct letter will appear in its correct position in the word.
   - Each incorrect guess will reveal one of the 7 parts of the hangman:
     - Head
     - Body
     - Left Arm
     - Right Arm
     - Left Leg
     - Right Leg
     - Hangman completed
   - The game ends when you either guess the word correctly or all 7 parts of the hangman are revealed.
3. **Winning**: Successfully guess the word before the hangman is completed.

---

## Technologies Used

- **Frontend**: React.js, TailwindCSS
- **Logic**: JavaScript
- **Styling**: CSS (with Tailwind classes)
- **Icons**: React Icons for UI elements

---

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/hangman-game.git
   cd hangman-game
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the App**:

   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---

## Folder Structure

```
hangman-game/
├── public/
├── src/
│   ├── components/        # Reusable React components
│   ├── assets/            # Images, icons, and fonts
│   ├── styles/            # CSS and Tailwind config
│   ├── App.js             # Main app component
│   └── index.js           # Entry point
└── package.json
```

---

## Future Enhancements

- Add difficulty levels (easy, medium, hard).
- Include a timer for each round.
- Track player score across multiple games.
- Support for multiplayer mode.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---


## Acknowledgements

- Inspired by the classic Hangman game.
- Special thanks to all contributors and testers!

---

Start guessing and have fun! 🎉
