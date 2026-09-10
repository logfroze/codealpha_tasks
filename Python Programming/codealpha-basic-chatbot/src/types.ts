export type ViewMode = 'terminal' | 'chat' | 'code' | 'tests';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  normalized?: string;
  ruleCategory?: string;
  isExit?: boolean;
}

export interface RuleDefinition {
  input: string;
  response: string;
  category: string;
  description: string;
}

export interface TestResult {
  name: string;
  description: string;
  input: string;
  expected: string;
  actual?: string;
  passed: boolean;
}

export interface PythonFilesData {
  chatbotPy: string;
  readmeMd: string;
  testChatbotPy: string;
}
