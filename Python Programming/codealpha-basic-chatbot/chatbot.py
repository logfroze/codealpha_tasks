"""
CodeAlpha - Python - Task 04: Basic Chatbot
Author: CodeAlpha Intern
Description: A simple rule-based console chatbot demonstrating fundamental
Python concepts including conditional statements (if-elif-else), functions,
while loops, string manipulation, and input normalization.
"""


def normalize_input(user_input: str) -> str:
    """Normalize user input by trimming whitespace and converting to lowercase."""
    if user_input is None:
        return ""
    # Strip leading/trailing whitespaces and convert to lowercase
    normalized = user_input.strip().lower()
    # Strip optional trailing punctuation marks like '?' or '!' or '.' for natural input
    normalized = normalized.rstrip("?!.")
    return normalized.strip()


def is_exit_command(user_input: str) -> bool:
    """Check if the user input matches an exit/termination command."""
    normalized = normalize_input(user_input)
    return normalized in ["bye", "exit", "quit", "goodbye"]


def get_response(user_input: str) -> str:
    """
    Determine the chatbot response based on predefined conversation rules.
    Demonstrates clear if-elif-else conditional branching.
    """
    normalized = normalize_input(user_input)

    # 1. Validation for empty message
    if not normalized:
        return "Please enter a message."

    # 2. Exit greetings
    if normalized in ["bye", "exit", "quit", "goodbye"]:
        return "Goodbye!"

    # 3. Core required greeting: hello -> Hi!
    elif normalized == "hello":
        return "Hi!"

    # 4. Additional greeting variations
    elif normalized in ["hi", "hey"]:
        return "Hello! How can I help you today?"

    elif normalized == "good morning":
        return "Good morning! Hope you have a wonderful day ahead."

    elif normalized in ["good evening", "good afternoon"]:
        return "Good evening! Hope your day is going well."

    # 5. Core required status check: how are you -> I'm fine, thanks!
    elif normalized == "how are you":
        return "I'm fine, thanks!"

    elif normalized in ["how are you doing", "how are things"]:
        return "I'm doing great, thank you for asking!"

    # 6. Identity & name queries
    elif normalized in ["what is your name", "what's your name", "who are you"]:
        return "I am a simple rule-based Python chatbot built for the CodeAlpha internship."

    # 7. Gratitude & appreciation
    elif normalized in ["thanks", "thank you"]:
        return "You're welcome!"

    # 8. Help instructions
    elif normalized in ["help", "commands"]:
        return (
            "You can greet me ('hello', 'hi'), ask how I am ('how are you'), "
            "ask for my name ('what is your name'), or type 'bye' to exit."
        )

    # 9. Fallback response for unknown input
    else:
        return "I'm sorry, I don't understand that yet."


def display_header():
    """Display the formatted welcome banner and instructions."""
    print("=" * 40)
    print("          BASIC PYTHON CHATBOT")
    print("=" * 40)
    print("\nHello! I'm a simple rule-based chatbot.")
    print("Type a message to start chatting.")
    print("Type 'bye' to exit.\n")


def chat():
    """
    Main conversation loop.
    Controls user interaction flow and program termination.
    """
    display_header()

    while True:
        try:
            user_input = input("You: ")
        except (KeyboardInterrupt, EOFError):
            print("\nBot: Goodbye!")
            break

        # Check for empty input (whitespace-only)
        if not user_input.strip():
            print("Bot: Please enter a message.\n")
            continue

        # Check if user wants to exit
        if is_exit_command(user_input):
            print(f"Bot: {get_response(user_input)}")
            break

        # Generate and display bot response
        response = get_response(user_input)
        print(f"Bot: {response}\n")


if __name__ == "__main__":
    chat()
