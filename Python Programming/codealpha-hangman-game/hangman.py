"""
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
   |   /|\
   |
   |
=========""",
    r"""
   ------
   |    |
   |    O
   |   /|\
   |   /
   |
=========""",
    r"""
   ------
   |    |
   |    O
   |   /|\
   |   / \
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

    print("\n" + "=" * 40)
    print("        CODEALPHA HANGMAN GAME")
    print("=" * 40)
    print("Welcome! Guess the hidden word one letter at a time.")
    print(f"You are allowed up to {MAX_INCORRECT_GUESSES} incorrect guesses.\n")

    while incorrect_guesses < MAX_INCORRECT_GUESSES:
        display_game_status(secret_word, guessed_letters, incorrect_guesses)
        guess = get_player_guess(guessed_letters)
        guessed_letters.append(guess)
        if guess in secret_word:
            print(f"\n[+] Good guess! {guess!r} is in the word.")
        else:
            incorrect_guesses += 1
            print(f"\n[-] Sorry, {guess!r} is not in the word.")
        if all(letter in guessed_letters for letter in secret_word):
            print("\n" + "*" * 40)
            print("        CONGRATULATIONS! YOU WON!")
            print("*" * 40)
            print(f"The secret word was: {secret_word}")
            return

    print(HANGMAN_STAGES[incorrect_guesses])
    print("=" * 40)
    print("           GAME OVER!")
    print("=" * 40)
    print(f"You ran out of guesses. The word was: {secret_word!r}. Better luck next time!\n")


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
    print("\nThank you for playing CodeAlpha Hangman! Goodbye.\n")


if __name__ == "__main__":
    main()
