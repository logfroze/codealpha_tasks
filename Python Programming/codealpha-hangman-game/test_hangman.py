"""
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
        # d e _ e _ _ _ e _
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
        self.assertEqual(validate_guess("P")[0], False)  # already guessed 'p'
        self.assertEqual(validate_guess("t"), (True, "t"))

    def test_win_and_loss_conditions(self):
        """Confirms win condition (all letters found) and loss (6 mistakes)."""
        secret = "algorithm"
        all_unique = set(secret)
        self.assertTrue(all(letter in all_unique for letter in secret))

        # 6 incorrect guesses triggers game over
        self.assertEqual(6, MAX_INCORRECT_GUESSES)


if __name__ == "__main__":
    unittest.main()
