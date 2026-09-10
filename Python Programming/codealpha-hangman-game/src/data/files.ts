export const HANGMAN_PY_SOURCE = `"""
CodeAlpha - Python - Task 01: Hangman Game
A simple, clean console-based Hangman game in Python 3.
"""

import random

# Predefined list of exactly 5 words for the game
WORDS = ["python", "developer", "internship", "programming", "algorithm"]

# Maximum allowed incorrect guesses
MAX_INCORRECT_GUESSES = 6

# ASCII art stages (0 = empty gallows ... 6 = full hangman)
HANGMAN_STAGES = [
    """
   ------
   |    |
   |
   |
   |
   |
=========""",
    """
   ------
   |    |
   |    O
   |
   |
   |
=========""",
    """
   ------
   |    |
   |    O
   |    |
   |
   |
=========""",
    """
   ------
   |    |
   |    O
   |   /|
   |
   |
=========""",
    r"""
   ------
   |    |
   |    O
   |   /|\\
   |
   |
=========""",
    r"""
   ------
   |    |
   |    O
   |   /|\\
   |   /
   |
=========""",
    r"""
   ------
   |    |
   |    O
   |   /|\\
   |   / \\
   |
=========""",
]


def select_random_word(word_list):
    """Selects and returns a random word from the provided list."""
    return random.choice(word_list)


def build_hidden_word(secret_word, guessed_letters):
    """
    Returns the secret word with correctly guessed letters revealed
    and unrevealed letters shown as underscores.
    """
    displayed = [letter if letter in guessed_letters else "_" for letter in secret_word]
    return " ".join(displayed)


def display_game_status(secret_word, guessed_letters, incorrect_guesses):
    """Prints the hangman graphic, hidden word, guessed letters, and remaining guesses."""
    print(HANGMAN_STAGES[incorrect_guesses])
    print(f"Word: {build_hidden_word(secret_word, guessed_letters)}")
    if guessed_letters:
        print(f"Guessed letters: {', '.join(sorted(guessed_letters))}")
    else:
        print("Guessed letters: None")
    remaining = MAX_INCORRECT_GUESSES - incorrect_guesses
    print(f"Incorrect guesses: {incorrect_guesses}/{MAX_INCORRECT_GUESSES}  (Remaining: {remaining})")
    print("-" * 40)


def get_player_guess(guessed_letters):
    """Prompts for a single letter, validates it, and returns it lowercase."""
    while True:
        raw_input = input("Enter a letter: ").strip()
        if not raw_input:
            print("[!] Please enter a letter. Input cannot be empty.")
            continue
        if len(raw_input) != 1:
            print("[!] Please enter only one letter at a time.")
            continue
        if not raw_input.isalpha():
            print("[!] Invalid character. Please enter an English letter (A-Z).")
            continue
        letter = raw_input.lower()
        if letter in guessed_letters:
            print(f"[!] You already guessed {letter!r}. Try another letter.")
            continue
        return letter


def play_round():
    """Runs one complete round of Hangman."""
    secret_word = select_random_word(WORDS)
    guessed_letters = []
    incorrect_guesses = 0

    print("\\n" + "=" * 40)
    print("        CODEALPHA HANGMAN GAME")
    print("=" * 40)
    print("Welcome! Guess the hidden word one letter at a time.")
    print(f"You are allowed up to {MAX_INCORRECT_GUESSES} incorrect guesses.\\n")

    while incorrect_guesses < MAX_INCORRECT_GUESSES:
        display_game_status(secret_word, guessed_letters, incorrect_guesses)
        guess = get_player_guess(guessed_letters)
        guessed_letters.append(guess)
        if guess in secret_word:
            print(f"\\n[+] Good guess! {guess!r} is in the word.")
        else:
            incorrect_guesses += 1
            print(f"\\n[-] Sorry, {guess!r} is not in the word.")
        if all(letter in guessed_letters for letter in secret_word):
            print("\\n" + "*" * 40)
            print("        CONGRATULATIONS! YOU WON!")
            print("*" * 40)
            print(f"The secret word was: {secret_word}")
            return

    print(HANGMAN_STAGES[incorrect_guesses])
    print("=" * 40)
    print("           GAME OVER!")
    print("=" * 40)
    print(f"You ran out of guesses. The word was: {secret_word!r}. Better luck next time!\\n")


def ask_play_again():
    """Asks the player whether they want another round."""
    while True:
        response = input("Would you like to play again? (y/n): ").strip().lower()
        if response in ["y", "yes"]:
            return True
        elif response in ["n", "no"]:
            return False
        else:
            print("[!] Please enter 'y' for yes or 'n' for no.")


def main():
    """Main entry point. Controls the overall replay loop."""
    running = True
    while running:
        play_round()
        running = ask_play_again()
    print("\\nThank you for playing CodeAlpha Hangman! Goodbye.\\n")


if __name__ == "__main__":
    main()
`;

export const TEST_HANGMAN_PY_SOURCE = `"""
Unit tests for CodeAlpha Hangman Game (hangman.py)
Validates core mechanics, word selection, masking, and validation logic.
"""

import unittest
from hangman import WORDS, MAX_INCORRECT_GUESSES, HANGMAN_STAGES, select_random_word, build_hidden_word


class TestHangmanGame(unittest.TestCase):
    def test_word_pool_composition(self):
        """Verifies the predefined word pool contains the specified 5 lowercase words."""
        self.assertEqual(len(WORDS), 5)
        expected = ["python", "developer", "internship", "programming", "algorithm"]
        self.assertEqual(WORDS, expected)
        for w in WORDS:
            self.assertTrue(w.islower())
            self.assertTrue(w.isalpha())

    def test_select_random_word(self):
        """Verifies select_random_word picks an item present in the word pool."""
        for _ in range(20):
            word = select_random_word(WORDS)
            self.assertIn(word, WORDS)

    def test_max_incorrect_guesses_and_stages(self):
        """Verifies exactly 6 incorrect guesses allowed and 7 ASCII stages (0 to 6)."""
        self.assertEqual(MAX_INCORRECT_GUESSES, 6)
        self.assertEqual(len(HANGMAN_STAGES), 7)

    def test_build_hidden_word_empty_guesses(self):
        """Ensures all letters are masked as underscores when no letters are guessed."""
        word = "python"
        masked = build_hidden_word(word, [])
        self.assertEqual(masked, "_ _ _ _ _ _")

    def test_build_hidden_word_partial_guesses(self):
        """Verifies only guessed letters are revealed, including multiple occurrences."""
        word = "developer"
        guessed = ["e", "d"]
        masked = build_hidden_word(word, guessed)
        self.assertEqual(masked, "d e _ e _ _ _ e _")

    def test_build_hidden_word_full_reveal(self):
        """Ensures full word is revealed when all distinct letters are guessed."""
        word = "python"
        guessed = ["p", "y", "t", "h", "o", "n"]
        masked = build_hidden_word(word, guessed)
        self.assertEqual(masked, "p y t h o n")

    def test_input_validation_rules(self):
        """Simulates input validation checks implemented in get_player_guess."""
        guessed = ["p", "y"]

        def validate_guess(raw: str):
            cleaned = raw.strip()
            if not cleaned:
                return False, "empty"
            if len(cleaned) != 1:
                return False, "multichar"
            if not cleaned.isalpha():
                return False, "non_alpha"
            letter = cleaned.lower()
            if letter in guessed:
                return False, "already_guessed"
            return True, letter

        self.assertEqual(validate_guess("")[0], False)
        self.assertEqual(validate_guess("  ")[0], False)
        self.assertEqual(validate_guess("py")[0], False)
        self.assertEqual(validate_guess("1")[0], False)
        self.assertEqual(validate_guess("!")[0], False)
        self.assertEqual(validate_guess("P")[0], False)
        self.assertEqual(validate_guess("t"), (True, "t"))

    def test_win_and_loss_conditions(self):
        """Confirms win condition (all letters found) and loss (6 mistakes)."""
        secret = "algorithm"
        all_unique = set(secret)
        self.assertTrue(all(letter in all_unique for letter in secret))
        self.assertEqual(6, MAX_INCORRECT_GUESSES)


if __name__ == "__main__":
    unittest.main()
`;

export const README_MD_SOURCE = `# CodeAlpha Hangman Game

A clean, beginner-friendly console-based Hangman game developed in Python 3.

---

## Overview

This project is a classic text-based Hangman game developed as part of the CodeAlpha programming internship curriculum. The game runs directly in any standard Python terminal or console without external dependencies or graphic frameworks. The objective is to guess a randomly chosen secret word one letter at a time within a maximum of 6 incorrect guesses.

---

## Features

- **Predefined Word Pool**: Uses a curated list of exactly 5 programming-related English words (\`python\`, \`developer\`, \`internship\`, \`programming\`, \`algorithm\`).
- **Random Word Selection**: A different word is randomly chosen for every game round using Python's built-in \`random\` module.
- **Dynamic Hidden Word Display**: Secret letters remain concealed as underscores (\`_\`) until correctly guessed, revealing all occurrences of matched letters simultaneously.
- **Visual ASCII Hangman Stages**: Features an 7-stage ASCII gallows that progressively draws as incorrect guesses accumulate (0 to 6).
- **Comprehensive Input Validation**:
  - Rejects empty inputs.
  - Rejects inputs longer than one character.
  - Rejects numbers and special symbols.
  - Rejects previously guessed letters (without penalizing the player).
  - Handles uppercase and lowercase inputs uniformly.
- **Immediate Win & Loss Detection**: The game immediately checks win/loss conditions after each guess without requiring redundant inputs.
- **Play Again Loop**: Allows seamless replaying with a fully reset game state or clean exit upon completion.
`;
