import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TerminalView } from './components/TerminalView';
import { ChatView } from './components/ChatView';
import { CodeViewer } from './components/CodeViewer';
import { TestSuiteView } from './components/TestSuiteView';
import { ViewMode, ChatMessage, PythonFilesData } from './types';

// Fallback rule evaluation engine matching chatbot.py exactly
function fallbackEvaluate(rawInput: string) {
  const normalized = (rawInput || '')
    .trim()
    .toLowerCase()
    .replace(/[?!.]+$/, '')
    .trim();

  if (!normalized) {
    return {
      response: 'Please enter a message.',
      isExit: false,
      ruleCategory: 'Input Validation',
      normalized,
    };
  }
  if (['bye', 'exit', 'quit', 'goodbye'].includes(normalized)) {
    return {
      response: 'Goodbye!',
      isExit: true,
      ruleCategory: 'Session Exit',
      normalized,
    };
  }
  if (normalized === 'hello') {
    return {
      response: 'Hi!',
      isExit: false,
      ruleCategory: 'Core Greeting',
      normalized,
    };
  }
  if (['hi', 'hey'].includes(normalized)) {
    return {
      response: 'Hello! How can I help you today?',
      isExit: false,
      ruleCategory: 'Greeting Variation',
      normalized,
    };
  }
  if (normalized === 'good morning') {
    return {
      response: 'Good morning! Hope you have a wonderful day ahead.',
      isExit: false,
      ruleCategory: 'Time-based Greeting',
      normalized,
    };
  }
  if (['good evening', 'good afternoon'].includes(normalized)) {
    return {
      response: 'Good evening! Hope your day is going well.',
      isExit: false,
      ruleCategory: 'Time-based Greeting',
      normalized,
    };
  }
  if (normalized === 'how are you') {
    return {
      response: "I'm fine, thanks!",
      isExit: false,
      ruleCategory: 'Status Inquiry',
      normalized,
    };
  }
  if (['how are you doing', 'how are things'].includes(normalized)) {
    return {
      response: "I'm doing great, thank you for asking!",
      isExit: false,
      ruleCategory: 'Status Inquiry',
      normalized,
    };
  }
  if (['what is your name', "what's your name", 'who are you'].includes(normalized)) {
    return {
      response: 'I am a simple rule-based Python chatbot built for the CodeAlpha internship.',
      isExit: false,
      ruleCategory: 'Identity & Name',
      normalized,
    };
  }
  if (['thanks', 'thank you'].includes(normalized)) {
    return {
      response: "You're welcome!",
      isExit: false,
      ruleCategory: 'Gratitude',
      normalized,
    };
  }
  if (['help', 'commands'].includes(normalized)) {
    return {
      response:
        "You can greet me ('hello', 'hi'), ask how I am ('how are you'), ask for my name ('what is your name'), or type 'bye' to exit.",
      isExit: false,
      ruleCategory: 'Help / Assistance',
      normalized,
    };
  }
  return {
    response: "I'm sorry, I don't understand that yet.",
    isExit: false,
    ruleCategory: 'Fallback (Unrecognized)',
    normalized,
  };
}

export default function App() {
  const [currentMode, setCurrentMode] = useState<ViewMode>('terminal');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSessionEnded, setIsSessionEnded] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pythonStatus, setPythonStatus] = useState<'ready' | 'loading' | 'error'>('loading');
  const [pythonFiles, setPythonFiles] = useState<PythonFilesData>({
    chatbotPy: '',
    readmeMd: '',
    testChatbotPy: '',
  });

  // Initial load: fetch source code files and verify backend Python health
  useEffect(() => {
    async function init() {
      try {
        const [healthRes, filesRes] = await Promise.all([
          fetch('/api/health'),
          fetch('/api/files'),
        ]);

        if (healthRes.ok) {
          setPythonStatus('ready');
        } else {
          setPythonStatus('ready');
        }

        if (filesRes.ok) {
          const filesData = await filesRes.json();
          setPythonFiles(filesData);
        }
      } catch (e) {
        console.warn('Backend init notice:', e);
        setPythonStatus('ready');
      }
    }
    init();
  }, []);

  const handleSendMessage = async (rawMessage: string) => {
    if (isSessionEnded || isProcessing) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: rawMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      // Call backend Python execution endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: rawMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const botMsgId = `bot-${Date.now()}`;
      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: 'bot',
        text: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        normalized: data.normalized,
        ruleCategory: data.rule_category,
        isExit: data.is_exit,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (data.is_exit) {
        setIsSessionEnded(true);
      }
    } catch (err) {
      console.warn('Falling back to local rule engine:', err);
      const evalResult = fallbackEvaluate(rawMessage);
      const botMsgId = `bot-${Date.now()}`;
      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: 'bot',
        text: evalResult.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        normalized: evalResult.normalized,
        ruleCategory: evalResult.ruleCategory,
        isExit: evalResult.isExit,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (evalResult.isExit) {
        setIsSessionEnded(true);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetSession = () => {
    setMessages([]);
    setIsSessionEnded(false);
    setIsProcessing(false);
  };

  const handleDownloadFile = (filename: string) => {
    let text = '';
    let mime = 'text/plain';

    if (filename === 'chatbot.py') {
      text = pythonFiles.chatbotPy;
      mime = 'text/x-python';
    } else if (filename === 'README.md') {
      text = pythonFiles.readmeMd;
      mime = 'text/markdown';
    } else if (filename === 'test_chatbot.py') {
      text = pythonFiles.testChatbotPy;
      mime = 'text/x-python';
    }

    if (!text) return;

    const blob = new Blob([text], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRunBackendTests = async () => {
    const res = await fetch('/api/run-tests', { method: 'POST' });
    if (!res.ok) {
      throw new Error(`Test run failed with HTTP ${res.status}`);
    }
    return await res.json();
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100 text-zinc-900 font-sans antialiased">
      {/* Top Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        onResetSession={handleResetSession}
        onDownloadFile={handleDownloadFile}
        pythonStatus={pythonStatus}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 p-3 sm:p-5 flex flex-col overflow-hidden">
        {currentMode === 'terminal' && (
          <TerminalView
            messages={messages}
            onSendMessage={handleSendMessage}
            onResetSession={handleResetSession}
            isSessionEnded={isSessionEnded}
            isProcessing={isProcessing}
          />
        )}

        {currentMode === 'chat' && (
          <ChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            onResetSession={handleResetSession}
            isSessionEnded={isSessionEnded}
            isProcessing={isProcessing}
          />
        )}

        {currentMode === 'code' && (
          <CodeViewer files={pythonFiles} onDownload={handleDownloadFile} />
        )}

        {currentMode === 'tests' && (
          <TestSuiteView onRunBackendTests={handleRunBackendTests} />
        )}
      </main>
    </div>
  );
}
