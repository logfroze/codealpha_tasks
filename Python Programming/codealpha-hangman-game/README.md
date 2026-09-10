# CodeAlpha Hangman Game

A clean, beginner-friendly console-based Hangman game developed in Python 3.

---

## Overview

This project is a classic text-based Hangman game developed as part of the CodeAlpha programming internship curriculum. The game runs directly in any standard Python terminal or console without external dependencies or graphic frameworks. The objective is to guess a randomly chosen secret word one letter at a time within a maximum of 6 incorrect guesses.

---

## Features

- **Predefined Word Pool**: Uses a curated list of exactly 5 programming-related English words (`python`, `developer`, `internship`, `programming`, `algorithm`).
- **Random Word Selection**: A different word is randomly chosen for every game round using Python's built-in `random` module.
- **Dynamic Hidden Word Display**: Secret letters remain concealed as underscores (`_`) until correctly guessed, revealing all occurrences of matched letters simultaneously.
- **Visual ASCII Hangman Stages**: Features an 7-stage ASCII gallows that progressively draws as incorrect guesses accumulate (0 to 6).
- **Comprehensive Input Validation**:
  - Rejects empty inputs.
  - Rejects inputs longer than one character.
  - Rejects numbers and special symbols.
  - Rejects previously guessed letters (without penalizing the player).
  - Handles uppercase and lowercase inputs uniformly.
- **Immediate Win & Loss Detection**: The game immediately checks win/loss conditions after each guess without requiring redundant inputs.
- **Play Again Loop**: Allows seamless replaying with a fully reset game state or clean exit upon completion.

---

## Python Concepts Used

This application demonstrates core Python fundamentals:

- **Modules & Imports**: `import random` for pseudo-random number and choice generation.
- **Control Flow**:
  - `while` loops for game turns and input validation prompts.
  - `if`, `elif`, and `else` conditional structures.
- **Data Structures**:
  - **Lists**: For word storage, guess tracking, and ASCII stage templates.
  - **Strings**: String indexing, slicing, methods (`.strip()`, `.lower()`, `.isalpha()`, `.join()`).
- **Functions**: Clean separation of responsibilities (`select_random_word`, `build_hidden_word`, `display_game_status`, `get_player_guess`, `play_round`, `ask_play_again`, `main`).
- **Input / Output**: Standard `print()` formatting and `input()` handling with robust exception handling.
- **Idiomatic Python**: List comprehensions, `all()` built-in generator expressions, and `if __name__ == "__main__":` idiom.

---

## How to Run

Ensure you have **Python 3.7+** installed on your system.

1. Clone or navigate to the project directory:
   ```bash
   git clone <your-repository-url>
   cd codealpha-python-hangman
   ```

2. Run the game using the Python interpreter:
   ```bash
   python hangman.py
   ```
   Or on systems where Python 3 is explicitly aliased:
   ```bash
   python3 hangman.py
   ```

---

## How to Play

1. When the game starts, you will see a series of underscores representing the letters in the secret word, along with an empty gallows.
2. Type a single English letter when prompted and press **Enter**.
3. If the letter is in the secret word, all matching positions will be revealed.
4. If the letter is not in the word, your incorrect guess count increases by 1, and a piece of the hangman figure will be drawn.
5. If you guess all letters in the word before reaching **6 incorrect guesses**, you win!
6. If you reach 6 incorrect guesses, the game ends and reveals the secret word.
7. Choose `y` to play another round or `n` to exit.

---

## Project Structure

```text
codealpha-python-hangman/
│
├── hangman.py       # Main Python source code with complete game logic
├── README.md        # Documentation, overview, and instructions
└── .gitignore       # Git ignore rules
```

---

## Internship Task

- **Organization**: CodeAlpha
- **Track**: Python Programming Internship
- **Task**: Task 1 - Hangman Game
- **Requirements Satisfied**:
  - Pure Python console application
  - Standard library only (`random`)
  - Exactly 5 predefined words
  - 6-guess maximum limit
  - Robust input validation and replay loop

---

## Author

- **Intern**: CodeAlpha Python Programming Intern
- **Project**: Hangman Game Console Project
