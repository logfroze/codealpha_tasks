"""
Unit tests for CodeAlpha Basic Chatbot.
Verifies all required conversation rules, input normalization, edge cases, and exit conditions.
"""

import unittest
from chatbot import get_response, is_exit_command, normalize_input


class TestCodeAlphaChatbot(unittest.TestCase):

    def test_normalization(self):
        """Test input cleaning, lowercase conversion, and whitespace trimming."""
        self.assertEqual(normalize_input("  HELLO  "), "hello")
        self.assertEqual(normalize_input("How Are You?"), "how are you")
        self.assertEqual(normalize_input("BYE!"), "bye")
        self.assertEqual(normalize_input(""), "")
        self.assertEqual(normalize_input("   "), "")

    def test_greetings(self):
        """Test core greeting and variations."""
        self.assertEqual(get_response("hello"), "Hi!")
        self.assertEqual(get_response("HELLO"), "Hi!")
        self.assertEqual(get_response("  Hello  "), "Hi!")
        self.assertEqual(get_response("hi"), "Hello! How can I help you today?")
        self.assertEqual(get_response("hey"), "Hello! How can I help you today?")
        self.assertEqual(get_response("good morning"), "Good morning! Hope you have a wonderful day ahead.")
        self.assertEqual(get_response("Good Evening!"), "Good evening! Hope your day is going well.")

    def test_status_inquiries(self):
        """Test questions about how the bot is doing."""
        self.assertEqual(get_response("how are you"), "I'm fine, thanks!")
        self.assertEqual(get_response("HOW ARE YOU?"), "I'm fine, thanks!")
        self.assertEqual(get_response("how are you doing"), "I'm doing great, thank you for asking!")

    def test_name_and_identity(self):
        """Test identity questions."""
        self.assertIn("CodeAlpha", get_response("what is your name"))
        self.assertIn("CodeAlpha", get_response("who are you"))

    def test_gratitude(self):
        """Test thank you responses."""
        self.assertEqual(get_response("thanks"), "You're welcome!")
        self.assertEqual(get_response("Thank You!"), "You're welcome!")

    def test_exit_conditions(self):
        """Test termination triggers and responses."""
        self.assertTrue(is_exit_command("bye"))
        self.assertTrue(is_exit_command("BYE"))
        self.assertTrue(is_exit_command("  bye  "))
        self.assertTrue(is_exit_command("exit"))
        self.assertTrue(is_exit_command("quit"))
        self.assertFalse(is_exit_command("hello"))
        self.assertEqual(get_response("bye"), "Goodbye!")
        self.assertEqual(get_response("exit"), "Goodbye!")

    def test_empty_input(self):
        """Test graceful handling of empty or whitespace inputs."""
        self.assertEqual(get_response(""), "Please enter a message.")
        self.assertEqual(get_response("   "), "Please enter a message.")

    def test_unknown_fallback(self):
        """Test fallback for unrecognized text."""
        self.assertEqual(
            get_response("can you do my homework"),
            "I'm sorry, I don't understand that yet."
        )
        self.assertEqual(
            get_response("xyz123456789!"),
            "I'm sorry, I don't understand that yet."
        )


if __name__ == "__main__":
    unittest.main()
