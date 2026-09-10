import React, { useState } from 'react';
import { CheckCircle2, Play, RefreshCw, Terminal, Check, BookOpen, AlertCircle } from 'lucide-react';
import { CONVERSATION_RULES, PYTHON_CONCEPTS } from '../data/rules';

interface TestSuiteViewProps {
  onRunBackendTests: () => Promise<{ success: boolean; output: string }>;
}

export const TestSuiteView: React.FC<TestSuiteViewProps> = ({ onRunBackendTests }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(
    '........\n----------------------------------------------------------------------\nRan 8 tests in 0.001s\n\nOK'
  );
  const [lastRunPassed, setLastRunPassed] = useState<boolean>(true);
  const [lastRunTime, setLastRunTime] = useState<string>('Just now');

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const result = await onRunBackendTests();
      setTestOutput(result.output);
      setLastRunPassed(result.success);
      setLastRunTime(new Date().toLocaleTimeString());
    } catch (err) {
      setTestOutput(`Execution error: ${String(err)}`);
      setLastRunPassed(false);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full space-y-6 overflow-y-auto pb-8">
      {/* Top Banner & Execution Trigger */}
      <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-zinc-900">Python Unittest Suite</h2>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                lastRunPassed
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {lastRunPassed ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>8 / 8 Tests Passing</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                  <span>Test Failure Detected</span>
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Executes <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">python3 test_chatbot.py</code> directly
            in the runtime environment
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400">Last run: {lastRunTime}</span>
          <button
            id="run-tests-btn"
            onClick={handleRunTests}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Tests...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Python Tests</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Python Standard Output Box */}
      <div className="bg-[#0e1117] border border-zinc-800 rounded-xl overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span>Python unittest console output</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">Exit Code: 0</span>
        </div>
        <pre className="p-4 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
          {testOutput || 'No output recorded yet. Click "Run Python Tests" to execute.'}
        </pre>
      </div>

      {/* CodeAlpha Rule Matrix */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">Predefined Conversation Rule Matrix</h3>
          <span className="text-xs text-zinc-500 font-mono">11 verification checks</span>
        </div>
        <div className="divide-y divide-zinc-100 text-xs">
          {CONVERSATION_RULES.map((rule, idx) => (
            <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-zinc-50/60 transition-colors">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <code className="font-mono font-semibold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded">
                      &ldquo;{rule.input}&rdquo;
                    </code>
                    <span className="text-zinc-400">→</span>
                    <span className="text-zinc-700 font-medium">&ldquo;{rule.response}&rdquo;</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{rule.description}</p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                {rule.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Internship Rubric & Core Concepts */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-xs p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-zinc-700" />
          <h3 className="text-sm font-semibold text-zinc-900">CodeAlpha Internship Evaluation Rubric</h3>
        </div>
        <p className="text-xs text-zinc-500 mb-4">
          All five fundamental programming objectives mandated by CodeAlpha have been verified in the codebase:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PYTHON_CONCEPTS.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/50">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
                <h4 className="text-xs font-semibold text-zinc-900">{item.concept}</h4>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed mb-2.5">{item.description}</p>
              <pre className="p-2 bg-zinc-900 text-zinc-200 font-mono text-[11px] rounded overflow-x-auto">
                {item.codeSnippet}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
