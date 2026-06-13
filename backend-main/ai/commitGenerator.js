import { GoogleGenAI } from "@google/genai";

let aiInstance = null;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not configured or uses placeholder. Falling back to local heuristic generator.");
    return null;
  }
  
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

export const generateCommitMessages = async (params) => {
  const { changedFiles, context, diffSnippet } = params;
  const client = getGeminiClient();

  if (!client) {
    // Elegant heuristic fallback output standard
    return generateFallbackCommitMessages(changedFiles, context);
  }

  try {
    const filesList = changedFiles.join(", ");
    
    const prompt = `You are an expert software developer and Git master. Generate 3 distinct conventional commit message suggestions based on the following changed files, diff chunk, and repository context.

Repository Context: ${context || "RepoMind AI developer project"}
Changed Files: ${filesList}
Diff Snippet (if any):
${diffSnippet || "No diff snippet provided."}

Return the suggestions formatted as a clean JSON array of strings. Each item must strictly follow the conventional commits standard (e.g., "feat: ...", "fix: ...", "refactor: ...", "docs: ...", etc.). Keep them concise, actionable, under 72 characters, and entirely lowercased messages.

JSON Output Format:
["feat: add dashboard analytics charts", "fix: resolve authentication token expiry", "refactor: optimize database connection pool"]`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (text) {
      const suggestions = JSON.parse(text.trim());
      if (Array.isArray(suggestions) && suggestions.length > 0) {
        return suggestions;
      }
    }
    throw new Error("Invalid response format received from model.");
  } catch (err) {
    console.error("Gemini API commit message generation failed, triggering high-fidelity fallback:", err);
    return generateFallbackCommitMessages(changedFiles, context);
  }
};

/**
 * Heuristic generator for fallback support or offline developer environment sandbox.
 */
function generateFallbackCommitMessages(changedFiles, context) {
  const primaryFile = changedFiles[0] || "index.ts";
  const fileExt = primaryFile.split(".").pop() || "";
  const baseName = primaryFile.split("/").pop() || "";

  if (baseName.toLowerCase().includes("auth") || baseName.toLowerCase().includes("user")) {
    return [
      `fix: resolve user session validation and auth token checks for ${baseName}`,
      `feat: integrate secure OAuth authorization and scopes into ${baseName}`,
      `refactor: optimize credentials parsing in auth middleware pipeline`
    ];
  } else if (baseName.toLowerCase().includes("chat") || baseName.toLowerCase().includes("socket")) {
    return [
      `feat: implement real-time event distribution layer to ${baseName}`,
      `fix: patch websocket reconnection socket drops for repository rooms`,
      `refactor: streamline message buffering logic in teams dashboard`
    ];
  } else if (baseName.toLowerCase().includes("chart") || baseName.toLowerCase().includes("analytics") || baseName.toLowerCase().includes("health")) {
    return [
      `feat: add analytics dashboard charts utilizing recharts visualization library`,
      `refactor: optimize mathematical weights calculation for repository health engine`,
      `style: polish display panel padding, density metrics, and modern slate themes`
    ];
  }

  // Generic patterns
  return [
    `feat: implement core operations inside ${baseName}`,
    `fix: address type checks and compiler warnings on files: ${changedFiles.slice(0, 2).join(", ")}`,
    `refactor: clean up structure and improve performance on ${baseName}`
  ];
}
