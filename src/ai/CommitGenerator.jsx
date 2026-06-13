import React, { useState } from "react";
import { Sparkles, FileCode, Plus, X, Copy, Check, GitCommit, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const PRESET_FILES = [
  "src/analytics/AnalyticsDashboard.jsx",
  "backend-main/controllers/healthController.js",
  "src/chat/TeamChat.jsx",
  "backend-main/ai/commitGenerator.js",
  "package.json"
];

export default function CommitGenerator({
  repoId,
  repoName,
  repoDescription,
  onCommitApplied,
  currentUsername
}) {
  const [selectedFiles, setSelectedFiles] = useState([
    "src/analytics/AnalyticsDashboard.jsx",
    "package.json"
  ]);
  const [newFile, setNewFile] = useState("");
  const [diffSnippet, setDiffSnippet] = useState(
    "diff --git a/package.json b/package.json\nindex ee31ab0..ff8a112 100\n--- a/package.json\n+++ b/package.json\n@@ -20,4 +20,4 @@\n-    \"recharts\": \"^2.10.0\"\n+    \"recharts\": \"^2.15.0\"\n"
  );
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [appliedCommit, setAppliedCommit] = useState(null);

  // Toggle presets
  const togglePresetFile = (file) => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles(selectedFiles.filter((f) => f !== file));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  // Add custom file path
  const handleAddFile = (e) => {
    e.preventDefault();
    if (newFile.trim() && !selectedFiles.includes(newFile.trim())) {
      setSelectedFiles([...selectedFiles, newFile.trim()]);
      setNewFile("");
    }
  };

  const handleRemoveFile = (file) => {
    setSelectedFiles(selectedFiles.filter((f) => f !== file));
  };

  // Generate Commit Message
  const handleGenerate = async () => {
    if (selectedFiles.length === 0) return;
    setLoading(true);
    setSuggestions([]);
    setAppliedCommit(null);

    try {
      const response = await fetch("/api/ai/commit-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          changedFiles: selectedFiles,
          context: `SaaS project: ${repoName} - ${repoDescription}`,
          diffSnippet: diffSnippet.trim(),
        }),
      });

      const data = await response.json();
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions([
          `feat: add dashboard analytics charts in ${repoName}`,
          `fix: patch database connection pooling errors`,
          `refactor: streamline message buffering logic across chat models`
        ]);
      }
    } catch (err) {
      console.error(err);
      setSuggestions([
        `feat: implement layout upgrades for ${repoName}`,
        `fix: resolve structural rendering dependencies`,
        `refactor: code optimizations inside conventional formats`
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (txt, idx) => {
    navigator.clipboard.writeText(txt);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleApplyCommit = async (msg) => {
    try {
      await onCommitApplied(msg, selectedFiles);
      setAppliedCommit(msg);
      // reset list
      setSelectedFiles(["src/analytics/AnalyticsDashboard.jsx"]);
      setSuggestions([]);
    } catch (err) {
      console.error("Failed to apply commit:", err);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-100 font-sans tracking-tight">AI Commit Generator</h2>
            <p className="text-xs text-zinc-400 font-mono">Powered by gemini-3.5-flash</p>
          </div>
        </div>
        <div className="text-[10px] bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850 text-zinc-405 font-mono">
          Author: <span className="text-indigo-400 font-bold">{currentUsername}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Parameters panel */}
        <div className="space-y-5">
          {/* Files Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono mb-2">
              Select Changed Files
            </label>
            
            {/*Preset chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_FILES.map((file) => {
                const isActive = selectedFiles.includes(file);
                return (
                  <button
                    key={file}
                    onClick={() => togglePresetFile(file)}
                    className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
                      isActive
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                        : "bg-zinc-950 border-zinc-850 hover:border-zinc-700 text-zinc-400"
                    }`}
                  >
                    {isActive ? "✓ " : "+ "}
                    {file.split("/").pop()}
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <form onSubmit={handleAddFile} className="flex gap-2">
              <input
                type="text"
                placeholder="Custom file path (e.g., src/store.js)"
                value={newFile}
                onChange={(e) => setNewFile(e.target.value)}
                className="grow bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 font-mono focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-zinc-800 hover:bg-zinc-7 hover:border-zinc-650 border border-zinc-700 px-3 py-1.5 rounded-lg text-zinc-300 text-xs font-medium shrink-0 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>

            {/* Selected files registry */}
            {selectedFiles.length > 0 && (
              <div className="border border-zinc-850 bg-zinc-950/40 rounded-lg p-3 space-y-1.5 mt-3 max-h-32 overflow-y-auto">
                {selectedFiles.map((file) => (
                  <div key={file} className="flex items-center justify-between text-xs text-zinc-300 font-mono">
                    <span className="flex items-center gap-1.5 truncate">
                      <FileCode className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      {file}
                    </span>
                    <button
                      onClick={() => handleRemoveFile(file)}
                      className="text-zinc-500 hover:text-zinc-300 ml-1.5 shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Diff Content snippet */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono mb-2">
              Diff Snippet (Optional context)
            </label>
            <textarea
              placeholder="Paste Git diff outputs here to let the AI learn specific code changes..."
              value={diffSnippet}
              onChange={(e) => setDiffSnippet(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-[10px] font-mono text-zinc-300 h-28 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || selectedFiles.length === 0}
            className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 font-medium text-sm transition-all ${
              loading || selectedFiles.length === 0
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white font-medium hover:shadow-sm"
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full" />
                <span>Whispering to Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Conventional Commits</span>
              </>
            )}
          </button>
        </div>

        {/* Output Suggestions panel */}
        <div className="bg-zinc-950/60 border border-zinc-850 rounded-xl p-5 flex flex-col min-h-[300px]">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono mb-4 flex items-center justify-between">
            <span>Suggestions Desk</span>
            <HelpCircle className="w-3.5 h-3.5 text-zinc-500 cursor-help" title="Suggestions comply with Git Conventional Standards" />
          </h3>

          <div className="grow flex flex-col justify-center">
            {suggestions.length > 0 ? (
              <div className="space-y-3.5">
                {suggestions.map((suggestion, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group border border-zinc-800 bg-zinc-900 rounded-xl p-4 hover:border-zinc-700 hover:shadow-zinc-950/40 relative flex flex-col gap-3"
                  >
                    <span className="text-xs font-mono font-bold text-zinc-200 select-all group-hover:text-indigo-400 transition-colors">
                      {suggestion}
                    </span>
                    <div className="flex items-center gap-2 mt-1 justify-end">
                      <button
                        onClick={() => handleCopy(suggestion, idx)}
                        className="p-1 px-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-950 hover:bg-zinc-900 text-[10px] text-zinc-405 rounded flex items-center gap-1 font-mono transition-colors"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy Check
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleApplyCommit(suggestion)}
                        className="p-1 px-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-700 hover:text-indigo-400 text-[10px] text-zinc-405 rounded flex items-center gap-1 font-mono transition-colors"
                      >
                        <GitCommit className="w-3 h-3" /> Commit Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500 space-y-2">
                <GitCommit className="w-10 h-10 mx-auto text-zinc-700" />
                <p className="text-xs font-sans">No suggestions compiled yet.</p>
                <p className="text-[10px] font-mono leading-relaxed max-w-xs mx-auto">
                  Populate changed files list and click generate. Gemini AI will propose 3 conventional options.
                </p>
              </div>
            )}

            <AnimatePresence>
              {appliedCommit && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 rounded-lg text-center"
                >
                  <p className="text-xs font-bold flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" /> Commit successfully integrated to code registry!
                  </p>
                  <p className="text-[10px] font-mono text-emerald-500 mt-1 truncate">
                    "{appliedCommit}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
