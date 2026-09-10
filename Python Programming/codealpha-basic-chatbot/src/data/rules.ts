import { RuleDefinition } from '../types';

export const CONVERSATION_RULES: RuleDefinition[] = [
  {
    input: 'hello',
    response: 'Hi!',
    category: 'Core Greeting',
    description: 'Primary greeting required by CodeAlpha specifications',
  },
  {
    input: 'hi / hey',
    response: 'Hello! How can I help you today?',
    category: 'Greeting Variation',
    description: 'Casual greeting variation',
  },
  {
    input: 'good morning',
    response: 'Good morning! Hope you have a wonderful day ahead.',
    category: 'Time Greeting',
    description: 'Time-of-day morning greeting',
  },
  {
    input: 'good evening',
    response: 'Good evening! Hope your day is going well.',
    category: 'Time Greeting',
    description: 'Time-of-day evening/afternoon greeting',
  },
  {
    input: 'how are you',
    response: "I'm fine, thanks!",
    category: 'Status Inquiry',
    description: 'Required status inquiry',
  },
  {
    input: 'what is your name',
    response: 'I am a simple rule-based Python chatbot built for the CodeAlpha internship.',
    category: 'Identity Query',
    description: 'Internship chatbot identity description',
  },
  {
    input: 'thanks / thank you',
    response: "You're welcome!",
    category: 'Gratitude',
    description: 'Polite acknowledgement',
  },
  {
    input: 'help / commands',
    response: "You can greet me ('hello', 'hi'), ask how I am ('how are you'), ask for my name ('what is your name'), or type 'bye' to exit.",
    category: 'Assistance',
    description: 'Lists supported conversational prompts',
  },
  {
    input: 'bye / exit / quit',
    response: 'Goodbye!',
    category: 'Session Exit',
    description: 'Required termination trigger that exits the while loop',
  },
  {
    input: '(empty message)',
    response: 'Please enter a message.',
    category: 'Validation',
    description: 'Input validation guard avoiding crashes on blank lines',
  },
  {
    input: '(unrecognized text)',
    response: "I'm sorry, I don't understand that yet.",
    category: 'Fallback',
    description: 'Default fallback response for unknown conversational branches',
  },
];

export const PYTHON_CONCEPTS = [
  {
    concept: 'Conditional Logic (if-elif-else)',
    description:
      'Branches user inputs deterministically to predefined outputs based on normalized strings without external models.',
    codeSnippet: `if normalized == "hello":\n    return "Hi!"\nelif normalized == "how are you":\n    return "I'm fine, thanks!"`,
  },
  {
    concept: 'Input Normalization',
    description:
      'Strips leading/trailing whitespace, removes trailing punctuation, and downcases text to guarantee case-insensitive matching.',
    codeSnippet: `normalized = user_input.strip().lower().rstrip("?!.")`,
  },
  {
    concept: 'Modular Functions',
    description:
      'Separates concerns cleanly across single-responsibility functions: normalize_input(), get_response(), is_exit_command(), and chat().',
    codeSnippet: `def get_response(user_input: str) -> str:\n    normalized = normalize_input(user_input)\n    ...`,
  },
  {
    concept: 'Control Flow (while loop)',
    description:
      'Maintains persistent command-line interaction and cleanly terminates upon receiving exit keywords or keyboard interrupts.',
    codeSnippet: `while True:\n    user_input = input("You: ")\n    if is_exit_command(user_input):\n        break`,
  },
  {
    concept: 'Edge Case & Error Handling',
    description:
      'Handles blank spaces, non-empty whitespace strings, and unexpected keyboard interrupts (Ctrl+C) gracefully.',
    codeSnippet: `try:\n    user_input = input("You: ")\nexcept (KeyboardInterrupt, EOFError):\n    break`,
  },
];
