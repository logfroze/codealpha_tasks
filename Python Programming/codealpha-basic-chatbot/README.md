# CodeAlpha Basic Chatbot

A simple, robust rule-based console chatbot developed in Python 3 for the **CodeAlpha Programming Internship**. This project demonstrates core programming fundamentals including conditional branching, input normalization, looping, modular function design, and terminal user interaction without external dependencies or machine learning APIs.

---

## Overview

The **CodeAlpha Basic Chatbot** is a console-driven conversational program that interacts with users through predefined response rules. It parses, sanitizes, and evaluates incoming text inputs against structured condition statements, providing instant and predictable replies to standard greetings, status questions, and commands.

---

## Features

- **Input Normalization**: Converts all inputs to lowercase and trims extraneous whitespace and punctuation, guaranteeing case-insensitive matching (`HELLO`, `hello`, `  hello  `).
- **Predefined Conversation Rules**: Immediate responses for common greetings, inquiries, gratitude, and help requests.
- **Graceful Error Handling**: Handles empty messages and unrecognized inputs gracefully with clear guidance.
- **Interactive Conversation Loop**: Continuous execution loop powered by a `while True` construct with clean keyboard interrupt (`Ctrl+C`) handling.
- **Dedicated Exit Conditions**: Supports commands (`bye`, `exit`, `quit`) to terminate the session cleanly.
- **Zero External Dependencies**: Built entirely with Python standard library constructs for 100% portability.

---

## Conversation Rules

| User Input (Normalized) | Chatbot Response | Rule Category |
|---|---|---|
| `hello` | `Hi!` | Core Greeting |
| `hi`, `hey` | `Hello! How can I help you today?` | Alternative Greetings |
| `good morning` | `Good morning! Hope you have a wonderful day ahead.` | Time-based Greeting |
| `good evening`, `good afternoon` | `Good evening! Hope your day is going well.` | Time-based Greeting |
| `how are you` | `I'm fine, thanks!` | Status Inquiry |
| `how are you doing` | `I'm doing great, thank you for asking!` | Status Inquiry |
| `what is your name`, `who are you` | `I am a simple rule-based Python chatbot built for the CodeAlpha internship.` | Identity Query |
| `thanks`, `thank you` | `You're welcome!` | Gratitude |
| `help`, `commands` | `You can greet me ('hello', 'hi'), ask how I am ('how are you'), ask for my name ('what is your name'), or type 'bye' to exit.` | Help / Usage |
| `bye`, `exit`, `quit` | `Goodbye!` | Session Termination |
| *(empty message)* | `Please enter a message.` | Input Validation |
| *(unrecognized input)* | `I'm sorry, I don't understand that yet.` | Fallback Handler |

---

## Python Concepts Used

1. **Conditional Logic (`if-elif-else`)**: Evaluates user inputs sequentially to select the appropriate response rule.
2. **Modular Functions**:
   - `normalize_input()`: Cleans and standardizes raw user strings.
   - `get_response()`: Contains the core rule-matching conditional tree.
   - `is_exit_command()`: Isolates termination triggers.
   - `display_header()`: Renders the introductory banner.
   - `chat()`: Manages the runtime interactive conversation loop.
3. **Control Flow (`while` loop)**: Maintains active dialogue until an exit trigger is detected.
4. **String Operations**: `.strip()`, `.lower()`, and `.rstrip()` for sanitization and uniform comparisons.
5. **Exception Handling**: Catches `KeyboardInterrupt` and `EOFError` for clean terminal exit on `Ctrl+C`.
6. **Execution Guard**: Standard `if __name__ == "__main__":` idiom for safe imports and testing.

---

## How to Run

### Prerequisites
- Python 3.7 or higher (no pip packages required)

### Run from Terminal
```bash
# Navigate to the project directory
cd CodeAlpha_Basic_Chatbot

# Run the chatbot
python3 chatbot.py
```

---

## How to Use

1. Launch the program in your terminal.
2. View the welcome banner and prompt:
   ```text
   ========================================
             BASIC PYTHON CHATBOT
   ========================================

   Hello! I'm a simple rule-based chatbot.
   Type a message to start chatting.
   Type 'bye' to exit.

   You: hello
   Bot: Hi!

   You: how are you
   Bot: I'm fine, thanks!

   You: bye
   Bot: Goodbye!
   ```
3. Type any message and press **Enter**.
4. Type `bye`, `exit`, or `quit` to leave the conversation.

---

## Project Structure

```text
CodeAlpha_Basic_Chatbot/
│
├── chatbot.py      # Core rule-based chatbot program
└── README.md       # Comprehensive documentation and evaluation guide
```

---

## Internship Task

- **Organization**: CodeAlpha
- **Track**: Python Programming Internship
- **Task**: Task 1 - Basic Rule-Based Chatbot
- **Objectives**: Demonstrate mastery of Python fundamentals (loops, conditionals, functions, user I/O) through a clean, reliable, hand-coded terminal application.

---

## Author

- **Intern**: CodeAlpha Python Intern
- **Year**: 2025 / 2026
