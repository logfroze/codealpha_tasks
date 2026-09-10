import express from "express";
import path from "path";
import fs from "fs";
import { execFile, exec } from "child_process";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health check and environment
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      pythonVersion: "3.10.12",
      project: "CodeAlpha Basic Chatbot",
    });
  });

  // API Route: Chat interaction executed directly against python3 chatbot.py
  app.post("/api/chat", (req, res) => {
    const userMessage = req.body?.message ?? "";

    const pythonScript = `
import sys
import json
from chatbot import get_response, is_exit_command, normalize_input

user_input = sys.stdin.read()
normalized = normalize_input(user_input)
response = get_response(user_input)
is_exit = is_exit_command(user_input)

rule_category = "Fallback (Unrecognized)"
if not normalized:
    rule_category = "Empty Input Validation"
elif is_exit:
    rule_category = "Exit / Termination"
elif normalized == "hello":
    rule_category = "Core Greeting"
elif normalized in ["hi", "hey", "good morning", "good evening", "good afternoon"]:
    rule_category = "Greeting Variation"
elif normalized in ["how are you", "how are you doing", "how are things"]:
    rule_category = "Status Inquiry"
elif normalized in ["what is your name", "what's your name", "who are you"]:
    rule_category = "Identity & Name"
elif normalized in ["thanks", "thank you"]:
    rule_category = "Gratitude"
elif normalized in ["help", "commands"]:
    rule_category = "Help / Guidance"

result = {
    "raw": user_input,
    "normalized": normalized,
    "response": response,
    "is_exit": is_exit,
    "rule_category": rule_category,
}
print(json.dumps(result))
`;

    const child = execFile(
      "python3",
      ["-c", pythonScript],
      { cwd: process.cwd() },
      (error, stdout, stderr) => {
        if (error) {
          console.error("Python exec error:", stderr || error.message);
          return res.status(500).json({
            error: "Failed to execute Python chatbot script",
            details: stderr || error.message,
          });
        }

        try {
          const parsed = JSON.parse(stdout.trim());
          return res.json(parsed);
        } catch {
          return res.json({
            raw: userMessage,
            normalized: userMessage.trim().toLowerCase(),
            response: stdout.trim() || "Execution completed.",
            is_exit: false,
            rule_category: "Standard Response",
          });
        }
      }
    );

    // Send user message via stdin to handle special characters cleanly
    if (child.stdin) {
      child.stdin.write(userMessage);
      child.stdin.end();
    }
  });

  // API Route: Run automated test suite
  app.post("/api/run-tests", (_req, res) => {
    exec("python3 test_chatbot.py", { cwd: process.cwd() }, (error, stdout, stderr) => {
      // unittest outputs summary to stderr
      const combinedOutput = `${stdout}\n${stderr}`.trim();
      const passed = !error;
      res.json({
        success: passed,
        output: combinedOutput,
        timestamp: new Date().toISOString(),
      });
    });
  });

  // API Route: Fetch source files for the Code Viewer and Download options
  app.get("/api/files", (_req, res) => {
    try {
      const chatbotCode = fs.readFileSync(path.join(process.cwd(), "chatbot.py"), "utf-8");
      const readmeContent = fs.readFileSync(path.join(process.cwd(), "README.md"), "utf-8");
      const testCode = fs.readFileSync(path.join(process.cwd(), "test_chatbot.py"), "utf-8");

      res.json({
        chatbotPy: chatbotCode,
        readmeMd: readmeContent,
        testChatbotPy: testCode,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to read project files", details: String(err) });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CodeAlpha Basic Chatbot server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
